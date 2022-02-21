---
title: Overview
label: CoTA
---

CoTA 全称 [Compact Token Aggregator Standard](https://talk.nervos.org/t/rfc-cota-a-compact-token-aggregator-standard-for-extremely-low-cost-nfts-and-fts/6338)，基于 Nervos CKB Cell 模型设计的 Token 管理协议。Cell 作为 CKB 生态资产的承载容器，其 Capacity(1 Byte = 1 CKB) 决定了其能存放的数据量，一个普通 Cell 最少需要 61 CKB，如果放置类似 UDT 的资产，则需要更多 CKB，这无形之中增加了用户的使用门槛。相比于账户模型，Cell 模型有更好的并发性，但是成本高日益成为其短板。在此背景下，[Nervina Labs](https://github.com/nervina-labs) 提出了 CoTA 协议，借助 [Sparse Merkle Tree](https://github.com/nervosnetwork/sparse-merkle-tree)(简称 SMT) 在一个 Cell 中管理用户自己所有的自定义资产，包括 NFT 和 FT，本文主要讨论 NFT，FT 暂时未实现。

每个用户（严格地说是地址）都有一个 CoTA Cell 来管理自己的所有自定义资产（NFT/FT），也就是说每个用户都有一个 merkel tree，用户的 merkel tree 数据统一由 Aggregator 管理。

详细请参考 [CoTA 协议设计](./design.md)

### SMT

为了更好理解 CoTA 协议，我们有必要先来看一下 SMT，以下是 SMT 的简单示意图：

```
# N = 256 sparse merkle tree
height:
255                0                              root
                /     \
254            0        1

.............................

           /   \          /  \
2         0     1        0    1
1        / \   / \      / \   / \
0       0   1 0  1 ... 0   1 0   1
       0x00..00 0x00..01   ...   0x11..11         leaves
```

简单说就是 2^256 个叶子结点通过两两拼接组成新的 hash，循环往复，最终得到一个 root hash 的过程，每个叶子节点都有一个 32byte 的 key 和 value，key 代表该叶子节点的位置，value 代表该叶子节点真实的数据，通过给定 merkel proof 和 root hash 就可以证明某个 value 存在或者不存在。关于 SMT 的详细介绍可以参考 [What’s a Sparse Merkle Tree](https://medium.com/@kelvinfichter/whats-a-sparse-merkle-tree-acda70aeb837)。

CoTA 协议定义了四种 NFT 相关的叶子类型（Key 和 Value 的数据结构有所不同），分别是 Define、Hold、Withdraw 和 Claim，他们通过字段 `smt_type` 区分，其中 Define 主要跟 NFT 的发行和分发有关，Hold 表示用户持有 NFT，Withdraw 和 Claim 跟 NFT 的转让相关。NFT 转让分两步，第一步发送方执行 withdraw 交易，指定某些 NFT 给指定的接收方，并更新自己的 Hold 和 Withdraw 类型的叶子节点，第二步接收方 claim 属于自己的 NFT，并更新自己的 Hold 和 Claim 类型的叶子节点。

### CoTA Cell 的数据结构

```yaml
# CoTA cell data structure
data:
  version: byte # must be 0
  smt_root: byte32
type:
  code_hash: cota_type
  args: lock_hash[0..20] # must match self.lock_script
lock: --
```

CoTA Cell Data 只有两个字段，version 和 smt_root，version 默认为 0，smt_root 为每次更新 merkel tree 叶子节点后最新的 root hash，换言之 live cell 只存储 smt root 作为全网共识的数据，而叶子节点信息则存储在 witness 中，witness 信息作为非共识性数据，会保留在 CKB 全节点数据中。这样可以最大限度地减少链上占用空间，降低用户的使用成本，相应的代价就是需要一个链外的 Aggregator 不断回溯链上交易恢复出完整的 merkel tree，并将叶子节点数据存储至数据库。如果 CoTA Cell 要做更新数据或者转让 NFT 等操作，都需要借助 Aggregator 帮忙生成最新的 smt root，以及链上合约验证需要的 smt proof。

详细请参考 [CoTA 数据结构和合约规则](./script-rule.md)

### CoTA NFT 发行

既然 CoTA 协议是为了方便管理用户的 NFT/FT 资产，那么我们就以发行 NFT 为例，说明一下 CoTA 协议是如何工作的。上文提到 CoTA Cell Data 只存储了 smt root hash，SMT 叶子节点数据存储于 Witness 中，所以我们先来看一下发行场景下 Transaction 和 Witness 的数据结构。

```
# Define transaction data structure
inputs: cota_cell

outputs: cota_cell

outputs_data: version + smt_root

witnesses:
  witness_args.input_type = action_type + DefineCotaNFTEntries
  witness_args.output_type = nft_metadata
```

Define 交易本身并不复杂，只是更新了 cell data 中的 `smt_root`，主要信息存储在 witness 中，`action_type` 是一个 `uint8` 类型的数据，主要用来区分交易行为（除了发行，还有转让、更新 NFT 信息等），`DefineCotaNFTEntries` 存放了 Define 需要的数据，`nft_metadata` 信息存放该系列 NFT 的其他信息，例如名称、简介、ImageUrl 等，`nft_metadata` 遵从 [CKB Transaction Metadata Standard Proposal](https://talk.nervos.org/t/ckb-transaction-metadata-standard-proposal/6332)，详情参考下文的 Metadata 示例。我们重点来看 `DefineCotaNFTEntries`

```yaml
# Define witness data structure
array CotaId [byte; 20];

struct DefineCotaNFTId {
  smt_type: Uint16,
  cota_id: CotaId,
}

struct DefineCotaNFTValue {
  total: Uint32,
  issued: Uint32,
  configure: byte,
}
vector DefineCotaNFTKeyVec <DefineCotaNFTId>;
vector DefineCotaNFTValueVec <DefineCotaNFTValue>;

table DefineCotaNFTEntries {
  define_keys: DefineCotaNFTKeyVec,
  define_values: DefineCotaNFTValueVec,
  proof: Bytes,
  action: Bytes,
}
```

可以看到，`DefineCotaNFTEntries` 提供了 NFT 发行需要的信息，例如`cota_id`(同一个系列 NFT 的唯一标识 ID)、发行总量、配置信息、smt_proof 等，上链前 `DefineCotaNFTEntries` 也会做序列化处理，Type 合约会对上述信息做必要的检查，然后根据 smt root、smt proof 以及叶子节点的原始信息，验证 Define 交易前该叶子节点的数据不存在 merkel tree 中，同时验证 Define 交易后该叶子节点的数据存在 merkel tree 中。

通过 CoTA NFT 发行过程，我们大概梳理了所需要的数据结构和合约验证逻辑，此外还有 NFT 分发、转让（Withdraw & Claim）和更新等交易，数据结构和验证逻辑都是相似的，详细请参考 [CoTA 数据结构和合约规则](./script-rule.md)

### CoTA Cell 注册

为了保证安全和防止潜在的攻击，CoTA Cell 必须与用户地址一一对应，换言之，每一个地址有且只能有一个 CoTA Cell，为此还需要提供一个 Global Registry Cell 来记录 CoTA Cell 的生成情况，简单说就是 Global Registry Cell 通过 SMT 来记录已注册的地址，每次注册新的 CoTA Cell 时，都需要先在 Global Registry Cell 检查是否已经存在，如果不存在则允许注册，否则不允许注册。

```yaml
# global_cota_registry_cell data structure
data:
  version: byte     // must be 0
  registry_smt_root: optional<byte32>
type:
  code_hash: global_cota_registry_type
  args: type_id
lock: always_success lock

# cota cell registry tx data structure
inputs: registry_cell
  normal_cell
outputs: registry_cell
  cota_cell1
  ...
  cota_cellN
outputs_data: version + registry_smt_root
  version
  ...
  version
witnesses: witness_args.input_type = CotaNFTRegistryEntries
```

详细的 registry 数据结构和合约规则，可以参考[CoTA 数据结构和合约规则](./script-rule.md)

### Aggregator

我们知道 Witness 需要存放 CoTA 和 SMT 相关的数据，而这部分依赖完整的 merkel tree 叶子信息，这部分数据需要回溯链上所有相关的交易才能获得，因此需要一个 Aggregator 的角色获取并维护这些数据，同时计算并构造 Witness 需要的数据。

考虑到链上数据解析和存储与计算并构造 Witness 需要的数据相对比较独立，因此 [CoTA Syncer](https://github.com/nervina-labs/cota-nft-entries-syncer) 负责 CoTA 和 Registry 相关数据的同步、解析和存储，[CoTA Registry Aggregator](https://github.com/nervina-labs/cota-registry-aggregator) 提供 CoTA 注册相关的数据的计算，同时对外提供注册 RPC 服务，[CoTA Aggregator](https://github.com/nervina-labs/cota-aggregator) 提供 CoTA 交易相关的数据的计算，同时对外提供生成 SMT Proof 相关 RPC 服务以及查询 CoTA NFT 相关的 RPC。具体的 Aggregator RPC 接口文档请参考 [CoTA Aggregator RPC](./aggregator/cota.md) 和 [CoTA Registry Aggregator RPC](./aggregator/registry.md)。

### SDK

为了方便第三发开发者借助 Aggregator 完成与 CoTA 合约交互，以及查询链上用户发行和持有 NFT 信息，我们还提供了 [JS SDK](https://github.com/nervina-labs/cota-sdk-js)

### Metadata 示例

#### Issuer Metadata

```json
{
  "id": "CTMeta",
  "ver": "1.0",
  "metadata": {
    "target": "output#0",
    "type": "issuer",
    "data": {
      "version": "0",
      "name": "Alice",
      "description": "Alice profile",
      "avatar": "https://alice-avater.jpg"
    }
  }
}
```

#### Class Metadata

```json
{
  "id": "CTMeta",
  "ver": "1.0",
  "metadata": {
    "target": "output#0",
    "type": "cota",
    "data": {
      "version": "0",
      "cota_id": "0x77e3571ee1b95ad98c3eeb09b237f6ba9e393a9e",
      "name": "HappyDog",
      "image": "https://i.loli.net/2021/04/28/ZCQPoxztsVHdNA9.jpg"
    }
  }
}
```
