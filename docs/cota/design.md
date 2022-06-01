---
title: CoTA 协议
label: CoTA
---

# Compact Token Aggregator Standard (CoTA)

## 产品定位

为普通用户而不是币圈用户提供一个简单易用的 token 方案，包括制作、传播和持有兑换。

## 数据结构描述

**几点说明：**

- reserved 表示填充位，默认为零
- uint16、uint32、uint128 都为大端数据

### CoTA Cell

```yaml
# CoTA cell data structure
data:
  version: byte     // must be 0
  smt_root: byte32
type:
  code_hash: cota_type_code_hash
  args: lock_hash[0..20] # must match self.lock_script
lock: --
```

注：不允许 CoTA Cell 销毁，否则会出现重复 claim 的漏洞

### cota-NFT 发行定义

```yaml
# **cota-NFT-define** data structure
key:
  smt_type: uint16 # type bytes for cota-NFT-define big endian
  cota_id: Byte[20] # hash(inputs[0].out_point + first_output_index)[0..20]
  reserved: Byte[10]
value:
  total: uint32 # 0 for unlimited
  issued: uint32
  configure: Byte[1]
  reserved: Byte[23]
```

### cota-NFT 持有定义

```yaml
# **cota-NFT-hold** data structure
key:
  smt_type: uint16 # type byte for cota-NFT-hold
  cota_id: Byte[20]
  index_id: uint32
  reserved: Byte[6]
value:
  configure: Byte[1]
  state: Byte[1]
  characteristic: Byte[20] # user-defined data
  reserved: Byte[10]
```

### cota-NFT 提现 & 申领定义

```yaml
# **cota-NFT-withdraw** data structure
key:
    smt_type:  uint16       # type byte for cota-NFT-withdraw
    cota_id:   Byte[20]
    index_id:  uint32
    reserved:  Byte[6]
value:
  blake2b_hash of {
    configure: Byte[1]
    state:     Byte[1]
    characteristic: Byte[20]      # user-defined data
    to_lock:   lock_script
    out_point: OutPoint[12..36]   # Outpoint of previous input cell with SMT
  }

# **cota-NFT-claim** data structure
key:
blake2b_hash of {
    smt_type:  uint16        # type byte for cota-NFT-claim
    cota_id:   Byte[20]
    index_id:  uint32
    out_point: OutPoint[12..36] # Outpoint field recorded in the proof
  }
value:
    0x00...00 for nonclaimed
    0xFF...FF for claimed
```

## Meta 信息定义

Token 发行时，上面的数据结构已经定义了一些动态信息，如 token 总量等，但仍然需要定义一些静态信息，例如发行人信息、token 信息等。我们使用 [CKB Transaction Metadata Standard](https://www.notion.so/CKB-Transaction-Metadata-Standard-ae5619dc762c4797a27f42854c4ab70f) 进行定义，Metadata 信息存放在 `witness_args.output_type` 中。

## 交易描述

| name                | 1st byte 2nd byte | note                  |
| ------------------- | ----------------- | --------------------- |
| cota-NFT-define     | 0x81 (NFT) 0x00   | NFT definition        |
| cota-NFT-held       | 0x81 (NFT) 0x01   | NFT held record       |
| cota-NFT-withdrawal | 0x81 (NFT) 0x02   | NFT withdrawal record |
| cota-NFT-claim      | 0x81 (NFT) 0x03   | NFT claim record      |

### cota cell 发行人数据定义/更新

```yaml
input:
  cota_cell
output:
  cota_cell
witness:
  [0]: signature
  [1]: CTMeta: issuer static information
```

### cota-NFT 发行

```yaml
input:
  cota_cell:
    nft_smt_root:
      smt_root_old
output:
  cota_cell:
    nft_smt_root:
      smt_root_new:
        key:
          cotaid: <outpoint_hash of input.cota_cell>
        value:
          ...
witness:
  [0]: signature
  [1]: CTMeta: Token static information
```
