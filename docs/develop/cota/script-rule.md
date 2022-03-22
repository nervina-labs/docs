---
title: 数据结构和合约规则
label: CoTA
---

### Witness 公共数据结构

```yaml
// common.mol
array Byte32 [byte; 32];
array Uint16 [byte; 2];   // 大端数据
array Uint32 [byte; 4];   // 大端数据
vector Bytes <byte>;

array CotaId [byte; 20];
array Characteristic [byte; 20];
array OutPointSlice [byte; 24];

struct CotaNFTId {
  smt_type: Uint16,
  cota_id: CotaId,
  index: Uint32,
}

struct CotaNFTInfo {
  configure: byte,
  state: byte,
  characteristic: Characteristic,
}

struct DefineCotaNFTId{
  smt_type: Uint16,
  cota_id: CotaId,
}

struct DefineCotaNFTValue {
  total: Uint32,
  issued: Uint32,
  configure: byte
}

vector DefineCotaNFTKeyVec <DefineCotaNFTId>;
vector DefineCotaNFTValueVec <DefineCotaNFTValue>;

vector HoldCotaNFTKeyVec <CotaNFTId>;
vector HoldCotaNFTValueVec <CotaNFTInfo>;

vector WithdrawalCotaNFTKeyVec <CotaNFTId>;

struct WithdrawalCotaNFTValue {
  nft_info: CotaNFTInfo,
  to_lock: Bytes,
  out_point: OutPointSlice,
}
vector WithdrawalCotaNFTValueVec <WithdrawalCotaNFTValue>;

struct ClaimCotaNFTKey {
  nft_id: CotaNFTId,
  out_point: OutPointSlice,
}
vector ClaimCotaNFTKeyVec <ClaimCotaNFTKey>;

vector ClaimCotaNFTValueVec <Byte32>;
struct ClaimCotaNFTInfo {
  version: byte,
  nft_info: CotaNFTInfo,
}
vector ClaimCotaNFTInfoVec <ClaimCotaNFTInfo>;

struct WithdrawalCotaNFTKeyV1 {
	nft_id: CotaNFTId,
  out_point: OutPointSlice,
}
vector WithdrawalCotaNFTKeyV1Vec <WithdrawalCotaNFTKeyV1>;

table WithdrawalCotaNFTValueV1 {
	nft_info: CotaNFTInfo,
  to_lock: Bytes,
}
vector WithdrawalCotaNFTValueV1Vec <WithdrawalCotaNFTValueV1>;
```

为了区分 witness 数据结构属于哪种交易类型，同时方便签名器显示可视化数据，以便用户确认，合约将会以完整的 action 文案作为 witness 数据的一部分参与签名，故而链外构造交易时，需严格按照下方可视化数据格式，特定义如下数据格式：

```jsx
// action_type: Uint8，位于 witness_args.input_type[0]
match action_type {
  0x01 => create                  // define and mint nft
  0x02 => mint                    // mint nft from define
  0x03 => withdraw                // withdraw nft tx
  0x04 => claim                   // claim nft tx
  0x05 => update                  // update nft info
  0x06 => transfer                // transfer nft with one step(claim & withdraw)
  0x07 => claim_udpate            // claim and update nft tx
  0x08 => transfer_update         // transfer and update nft tx
}
```

**可视化数据格式**

```jsx
// %d==0 => "unlimited"
// 合约和 witness 中出现的 lock_script 以 lockscript 的 molecule 序列化格式保存，呈现给用户层
// 则自动将 lock script 转化为 address
// 为了方便合约验证，lock_script 以 molecule 序列化后的 bytes 形式存放于 witness 中
// total 为大端 u32
// 对于 0x01、0x02、0x03、0x06 和 0x08，合约只验证单个 cota_id + token_index 或者 lock_scirpt
// 的情况，多个时不验证，其他情况合约都会验证
action = match action_type {
  0x01 => ("Create a new NFT collection with %d edition", total)
  0x02 => ("Mint the NFT %s to %s", cota_id + token_index, molecule_encode(lock_script))
  0x03 => ("Transfer the NFT %s to %s", cota_id + token_index, molecule_encode(lock_script))
  0x04 => ("Claim %d NFTs", count)
  0x05 => ("Update NFT information")
  0x06 => ("Transfer the NFT %s to %s", cota_id + token_index, molecule_encode(lock_script))
  0x07 => ("Claim %d NFTs and update NFTs information", count)
	0x08 => ("Transfer the NFT %s to %s and update the NFT information", cota_id + token_index, molecule_encode(lock_script))
}
```

### CoTA cell 数据结构

```yaml
# CoTA cell data structure
data:
    version: byte     // must be 0
    smt_root: optional<byte32>
type:
    code_hash: **cota_type**
    args: lockscript_hash[0..20]        # must match self.lockscript
lock:
    --
```

CoTA cell 规则：

- `version == 0`
- `cota_type_args == cota_lock_hash[0..20]`
- CoTA cell 不允许销毁，且不允许转让
- CoTA cell 的创建交易中必须有 `global_cota_registry_cell` 参与，合约判定 `global_cota_registry_cell` 的 type_id
- 一个地址只能有一个 CoTA cell

### CoTA cell 注册

CoTA cell 的生成需要 `global_cota_registry_cell` 的参与，目的是保证每个地址只能有一个 CoTA Cell。

```yaml
# global_cota_registry_cell data structure
data:
  version: byte     // must be 0
  registry_smt_root: optional<byte32>
type:
  code_hash: global_cota_registry_type
  args: type_id
lock: always_success lock
```

```yaml
# global_cota_registry_cell creation tx structure
inputs:
    normal_cell
outputs:
    registry_cell
outputs_data:
    version
witnesses:
    --

# global_cota_registry_cell update tx structure
inputs:
    registry_cell
    normal_cell
outputs:
    registry_cell
    cota_cell1
    ...
    cota_celln
outputs_data:
    version + registry_smt_root
    version
    ...
    version
witnesses:
    witness_args.input_type = CotaNFTRegistryEntries
```

`global_cota_registry` cell 规则：

- `global_cota_registry.type_args == type_id[0..20]`
- `global_cota_registry` cell 不允许销毁，且不允许转让
- `global_cota_registry` cell 更新时，`tx.outputs` 必须有 CoTA cell ，合约判定 `cota_cell` 的 `type_id`
- cota cell 注册生成的交易中会通过 `global_cota_registry` type script（包括 type args） 判断当前交易中必须有 `global_cota_registry` cell

**witness 数据结构**

```yaml
// registry.mol
// value: 0xFF...FF(registed), 0x00...00(unregisted)
import common;

struct Registry {
  lock_hash: Byte32,
  state: Byte32,
}

vector RegistryVec <Registry>;

table CotaNFTRegistryEntries {
  registries: RegistryVec,
  proof: Bytes,
}
```

### CoTA NFT 设计

```
inputs:
  cota_cell;

outputs:
  cota_cell;

outputs_data:
  version + smt_root;

witnesses:
  witness_args.input_type = action_type + DefineCotaNFTEntries;
```

**witness 数据结构**

```yaml
// define.mol
import common;

table DefineCotaNFTEntries {
  define_keys: DefineCotaNFTKeyVec,
  define_values: DefineCotaNFTValueVec,
  proof: Bytes,
  action: Bytes,
}
```

合约规则：

- `len(define_keys) == len(define_values) == 1`
- `define.cota_id == hash(inputs[0].out_point + (index_in_define_keys as u8))[0..20]`
- `define.issued == 0`
- `define_smt_type == 0x8100`
- action 必须与上述文档中定义的保持一致
- configure 与 mNFT 保持一致
- 发行前，define 的 keys/vaules 不在 input.smt 中（smt root 与 proof 验证）
- 发行后，define 的 keys/values 在 output.smt 中（smt root 与 proof 验证）

### CoTA NFT 分发

```
inputs:
  cota_cell;

outputs:
  cota_cell;

outputs_data:
  version + smt_root;

witnesses:
  witness_args.input_type = action_type + MintCotaNFTV1Entries;
```

**witness 数据结构**

```yaml
//mint.mol
import common;

table MintCotaNFTV1Entries {
  define_keys: DefineCotaNFTKeyVec,
  define_old_values: DefineCotaNFTValueVec,
  define_new_values: DefineCotaNFTValueVec,
  withdrawal_keys: WithdrawalCotaNFTKeyV1Vec,
  withdrawal_values: WithdrawalCotaNFTValueV1Vec ,
  proof: Bytes,
  action: Bytes,
}
```

合约规则：

- `len(define_keys) == 1`
- 对应的 `keys: values`，长度必须相等
- `withdrawal.out_point == inputs.cota_nft_cell.out_point[12..36]`
- `define.key.cota_id == withdrawal.key.cota_id`
- `new_define.issued - old_define.issued == len(withdrawal_keys)`
- `define.configure == withdrawal.configure`
- `withdrawal.nft_info.index` 单调递增，且必须在区间`[old_define.issued, new_define.issued)`内取值
- `define_smt_type == 0x8100`
- `withdraw_smt_type == 0x8102`
- action 必须与上述文档中定义的保持一致
- withdrawal 的 keys/vaules 不在 input.smt 中（smt root 与 proof 验证）
- withdrawal 的 keys/values 在 output.smt 中（smt root 与 proof 验证）
- define_old 的 keys/vaules 在 input.smt 中（smt root 与 proof 验证）
- define_new 的 keys/values 在 output.smt 中（smt root 与 proof 验证）

### CoTA NFT 转让之 withdraw

```
inputs:
  sender_cota_cell;

outputs:
  sender_cota_cell;

outputs_data:
  version + smt_root;

witnesses:
  witness_args.input_type = action_type + WithdrawalCotaNFTV1Entries;
```

**witness 数据结构**

```yaml
// transfer.mol
import common;

table WithdrawalCotaNFTV1Entries {
  hold_keys: HoldCotaNFTKeyVec,         // Before withdrawal
  hold_values: HoldCotaNFTValueVec,     // Before withdrawal
  withdrawal_keys: WithdrawalCotaNFTKeyV1Vec,   
  withdrawal_values: WithdrawalCotaNFTValueV1Vec,
  proof: Bytes,
  action: Bytes,
}
```

合约规则：

- `withdrawal.to_lock == receiver_lock_script`
- `withdrawal.out_point == inputs.cota_nft_cell.out_point[12..36]`
- `hold.value.nft_info == withdrawal.value.nft_info`
- `hold.key.cota_id + hold.key.index == withdrawal.key.nft_info.cota_id + withdrwal.key.nft_info.index`
- `hold_smt_type == 0x8101`
- `withdraw_smt_type == 0x8102`
- 对应的 `keys: values`，长度必须相等
- action 必须与上述文档中定义的保持一致
- withdrawal 的 keys/vaules 不在 input.smt 中（smt root 与 proof 验证）
- withdrawal 的 keys/values 在 output.smt 中（smt root 与 proof 验证）
- hold 的 keys/vaules 在 input.smt 中（smt root 与 proof 验证）
- hold 的 keys/values 不在 output.smt 中（smt root 与 proof 验证）

### CoTA NFT 转让之 claim

```
cell_deps:
  sender_cota_cell;

inputs:
  receiver_cota_cell;

outputs:
  receiver_cota_cell;

outputs_data:
  version + smt_root;

witnesses:
  witness_args.input_type = action_type + ClaimCotaNFTEntries;
```

**witness 数据结构**

```yaml
// transfer.mol
import common;

table ClaimCotaNFTEntries {
  hold_keys: HoldCotaNFTKeyVec,
  hold_values: HoldCotaNFTValueVec,
  claim_keys: ClaimCotaNFTKeyVec,
  claim_values: ClaimCotaNFTValueVec,
  proof: Bytes,
  withdrawal_proof: Bytes,
  action: Bytes,
}
```

合约规则：

- `cell_deps[0] == sender_cota_cell`
- `receiver.claim.out_point == sender.withdrawal.out_point`
- `claim.value == 0x00FF..FF(V0) or 0x01FF..FF(V1)`
- `hold.key.cota_id + hold.key.index == claim.key.cota_id + claim.key.index`
- `sender.withdrawal.to_lock == recevier_lock_script`
- `hold_smt_type == 0x8101`
- `claim_smt_type == 0x8103`
- 对应的 `keys: values`，长度必须相等
- action 必须与上述文档中定义的保持一致
- sender.withdrawal + sender.smt_root + withdrawal_proof 三者验证 smt 通过（需要区分 V0 和 V1 ）
- withdrawal_proof 只包含 smt_type 为 withdraw 的叶子结点
- claim 的 keys/vaules 不在 input.smt 中（smt root 与 proof 验证）
- claim 的 keys/values 在 output.smt 中（smt root 与 proof 验证）
- hold 的 keys/vaules 在 input.smt 中（smt root 与 proof 验证）
- hold 的 keys/values 不在 output.smt 中（smt root 与 proof 验证）

### CoTA NFT 转让 transfer (claim & withdraw)

```
cell_deps:
  sender_cota_cell;

inputs:
  receiver_cota_cell;

outputs:
  receiver_cota_cell;

outputs_data:
  version + smt_root;

witnesses:
  witness_args.input_type = action_type + TransferCotaNFTV1Entries;
```

**witness 数据结构**

```yaml
// transfer.mol
import common;

table TransferCotaNFTV1Entries {
  claim_keys: ClaimCotaNFTKeyVec,
  claim_values: ClaimCotaNFTValueVec,
  withdrawal_keys: WithdrawalCotaNFTKeyV1Vec,   
  withdrawal_values: WithdrawalCotaNFTValueV1Vec,
  proof: Bytes,
  withdrawal_proof: Bytes,
  action: Bytes,
}
```

合约规则：

- `cell_deps[0] == sender_cota_cell`
- `receiver.claim.out_point == sender.withdrawal.out_point`
- `receiver.withdraw.out_point == receiver_cota_cell_inputs[0].out_point`
- `claim.value == 0x00FF..FF(V0) or 0x01FF..FF(V1)`
- `claim.key.cota_id + claim.key.index == withdrawal.key.nft_info.cota_id + withdrawal.key.nft_info.index`
- `sender.withdrawal.to_lock == recevier_lock_script`
- `withdraw_smt_type == 0x8102`
- `claim_smt_type == 0x8103`
- 对应的 `keys: values`，长度必须相等
- action 必须与上述文档中定义的保持一致
- sender.withdrawal + sender.smt_root + withdrawal_proof 三者验证 smt 通过（需要区分 V0 和 V1 ）
- claim 的 keys/vaules 不在 input.smt 中（smt root 与 proof 验证）
- claim 的 keys/values 在 output.smt 中（smt root 与 proof 验证）
- withdrawal 的 keys/vaules 不在 input.smt 中（smt root 与 proof 验证）
- withdrawal 的 keys/values 在 output.smt 中（smt root 与 proof 验证）

### CoTA NFT 更新信息

```
inputs:
  cota_cell;

outputs:
  cota_cell;

outputs_data:
  version + smt_root;

witnesses:
  witness_args.input_type = action_type + UpdateCotaNFTEntries;
```

**witness 数据结构**

```yaml
// update.mol
import common;

table UpdateCotaNFTEntries {
  hold_keys: HoldCotaNFTKeyVec,
  hold_old_values: HoldCotaNFTValueVec,
  hold_new_values: HoldCotaNFTValueVec,
  proof: Bytes,
  action: Bytes,
}
```

合约规则：

- hold.state 满足 configure 配置，具体见 [mNFT 协议](https://talk.nervos.org/t/rfc-multi-purpose-nft-draft-spec/5434)
- `hold_smt_type == 0x8101`
- 对应的 `keys: values`，长度必须相等
- action 必须与上述文档中定义的保持一致
- hold_keys/hold_old_values 在 input.smt 中（smt root 与 proof 验证）
- hold_keys/hold_new_vaules 在 output.smt 中（smt root 与 proof 验证）

### CoTA NFT 转让之 claim 且更新 NFT 信息

```
cell_deps:
	sender_cota_cell

inputs:
	receiver_cota_cell

outputs:
	receiver_cota_cell

outputs_data:
	version + smt_root

witnesses:
	witness_args.input_type = action_type + ClaimUpdateCotaNFTV1Entries
```

**witness 数据结构**

```
// transfer_update.mol
import common;

table ClaimUpdateCotaNFTV1Entries {
	hold_keys: HoldCotaNFTKeyVec,
  hold_values: HoldCotaNFTValueVec,
  claim_keys: ClaimCotaNFTKeyVec,
  claim_infos: ClaimCotaNFTInfoVec,
  proof: Bytes,
  withdrawal_proof: Bytes,   
  action: Bytes,  
}
```

合约规则：

- `cell_deps[0] == sender_cota_cell`
- `receiver.claim.out_point == sender.withdrawal.out_point`
- `receiver.withdraw.out_point == receiver_cota_cell_inputs[0].out_point`
- `claim.key.cota_id + claim.key.index == withdrawal.key.nft_info.cota_id + withdrawal.key.nft_info.index`
- `sender.withdrawal.to_lock == recevier_lock_script`
- `hold_smt_type == 0x8101`
- `claim_smt_type == 0x8103`
- `claim.info.version == 0x00(V0) or 0x01(V1)`
- `claim_info.nft_info.configure == hold_value.nft_info.configure`
- 对应的 `keys: values`，长度必须相等
- holds 与 claims 数据必须一一对应
- action 必须与上述文档中定义的保持一致
- `hold.state/characteristic` 满足 configure 配置，具体见 [mNFT 协议](https://talk.nervos.org/t/rfc-multi-purpose-nft-draft-spec/5434)
- sender.withdrawal + sender.smt_root + withdrawal_proof 三者验证 smt 通过（需要区分 V0 和 V1 ）
- claim 的 keys/vaules 不在 input.smt 中（smt root 与 proof 验证）
- claim 的 keys/values(0xFF...FF) 在 output.smt 中（smt root 与 proof 验证）
- hold 的 keys/vaules 不在 input.smt 中（smt root 与 proof 验证）
- hold 的 keys/values 在 output.smt 中（smt root 与 proof 验证）

### CoTA NFT 转让 transfer 且更新 NFT 信息

```
cell_deps:
	sender_cota_cell

inputs:
	receiver_cota_cell

outputs:
	receiver_cota_cell

outputs_data:
		version + smt_root

witnesses:
	witness_args.input_type = action_type + TransferUpdateCotaNFTV1Entries 
```

**witness 数据结构**

```
// transfer_update.mol
import common;

table TransferUpdateCotaNFTV1Entries {
  claim_keys: ClaimCotaNFTKeyVec,
  claim_infos: ClaimCotaNFTInfoVec,
  withdrawal_keys: WithdrawalCotaNFTKeyV1Vec,   
  withdrawal_values: WithdrawalCotaNFTValueV1Vec,
  proof: Bytes,
  withdrawal_proof: Bytes,   
  action: Bytes,  
}
```

合约规则：

- `cell_deps[0] == sender_cota_cell`
- `receiver.claim.out_point == sender.withdrawal.out_point`
- `receiver.withdraw.out_point == receiver_cota_cell_inputs[0].out_point`
- `claim.key.cota_id + claim.key.index == withdrawal.key.nft_info.cota_id + withdrawal.key.nft_info.index`
- `sender.withdrawal.to_lock == recevier_lock_script`
- `withdraw_smt_type == 0x8102`
- `claim_smt_type == 0x8103`
- `claim.info.version == 0x00(V0) or 0x01(V1)`
- 对应的 `keys: values`，长度必须相等
- claims 与 withdrawals 数据必须一一对应
- action 必须与上述文档中定义的保持一致
- `withdrawal_value.nft_info.state/characteristic` 满足 configure 配置，具体见 [mNFT 协议](https://talk.nervos.org/t/rfc-multi-purpose-nft-draft-spec/5434)
- `claim_info.nft_info.configure == withdrawal_value.nft_info.configure`
- sender.withdrawal + sender.smt_root + withdrawal_proof 三者验证 smt 通过（需要区分 V0 和 V1 ）
- claim 的 keys/vaules 不在 input.smt 中（smt root 与 proof 验证）
- claim 的 keys/values(0xFF...FF) 在 output.smt 中（smt root 与 proof 验证）
- withdrawal 的 keys/vaules 不在 input.smt 中（smt root 与 proof 验证）
- withdrawal 的 keys/values 在 output.smt 中（smt root 与 proof 验证）

### CoTA cell 更新个人信息

CoTA cell 更新个人信息在合约层面不做校验，其信息存放在 witness_args.output_type 中，具体格式参考 [CKB Transaction Metadata Standard](https://talk.nervos.org/t/ckb-transaction-metadata-standard-proposal/6332)

虽然合约不校验个人信息的详细内容和格式，但是对于这种交易场景，合约需要保证交易只能更新 witnesses 数据， cell data / lock script / type script 都不允许修改。

合约规则如下：

当 witness_args.input_type 为空，那么:

- `input_cota_cell_data == output_cota_cell_data`
- lock 和 type 同其他交易场景的规则类似，input 和 output 必须相同
