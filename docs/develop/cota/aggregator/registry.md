---
title: Registry Aggregator
label: CoTA
---

> block_number 表示当前数据同步到的最新区块高度，建议以当 block_number 与 CKB 链上最新高度一致时返回的数据为准

## JSONRPC 接口

### register_cota_cells

  - Params:

    ```json
    [
      lock_hash: hex_string_bytes32
    ]

    ```

  - Response
    ```json
    result: {
      registry_smt_entry: hex_string_bytes,
      smt_root_hash: hex_string_bytes32,
      block_number: number
    }
    ```

## RPC 接口示例

RPC 接口数据示例参考 [APIs](https://github.com/nervina-labs/cota-registry-aggregator/blob/develop/README.md#apis)
