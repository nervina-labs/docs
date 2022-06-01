---
title: CoTA Aggregator
label: CoTA
---

> block_number 表示当前数据同步到的最新区块高度，建议以当 block_number 与 CKB 链上最新高度一致时返回的数据为准

## JSONRPC 接口

### generate_define_cota_smt

为定义（define）CoTA 的交易生成 smt 数据（包括 `smt_entry` for `witness_args.input_type` 和 `smt_root` for cell data）

  - Params:

    ```json

    {
      lock_script: hex_string_bytes,
      cota_id: hex_string_bytes20,
      total: hex_string_bytes4,
      issued: hex_string_bytes4,
      configure: hex_string_bytes1,
    },

    ```

  - Response
    ```json
    result: {
    	define_smt_entries: hex_string_bytes,
    	smt_root_hash: hex_string_bytes32,
    	block_number: number
    }
    ```

### generate_mint_cota_smt

为 CoTA 分发（mint）的交易生成 smt 数据（包括 `smt_entry` for `witness_args.input_type` 和 `smt_root` for cell data）

  - Params:
    ```js
    {
      lock_script: hex_string_bytes,
      cota_id: hex_string_bytes20,
      out_point: hex_string_bytes24,
      withdrawals: [
        {
            token_index: hex_string_bytes4,
            state: hex_string_bytes1,
            characteristic: hex_string_bytes20,
            to_lock_script: hex_string_bytes,
        }
      ]
    }
    ```
  - Response
    ```json
    result: {
      mint_smt_entry: hex_string_bytes,
      smt_root_hash: hex_string_bytes32,
      block_number: number
    }
    ```

### generate_withdrawal_cota_smt

为 CoTA NFT 的 withdrawal 交易生成 smt 数据（包括 `smt_entry` for `witness_args.input_type` 和 `smt_root` for cell data）

  - Params
    ```json
    {
        lock_script: hex_string_bytes,
        out_point: hex_string_bytes24,
        withdrawals: [
        {
            cota_id: hex_string_bytes20,
            token_index: hex_string_bytes4,
            to_lock_script: hex_string_bytes,
        }
    }
    ```
  - Response
    ```json
    result: {
      withdraw_smt_entry: hex_string_bytes,
      smt_root_hash: hex_string_bytes32,
      block_number: number
    }
    ```

### generate_claim_cota_smt

为 CoTA NFT 的 claim 交易生成 smt 数据（包括 `smt_entry` for `witness_args.input_type` 和 `smt_root` for cell data）

  - Params

    ```json
    {
      lock_script: hex_string_bytes,
      withdrawal_lock_script: hex_string_bytes,
      claims: [
        {
          cota_id: hex_string_bytes20,
          token_index: hex_string_bytes4,
        }
      ]
    }
    ```

  - Response
    ```json
    result: {
      claim_smt_entry: hex_string_bytes,
      smt_root_hash: hex_string_bytes32,
      block_number: number
    }
    ```

### generate_update_cota_smt

为更新（update） CoTA NFT 的交易生成 smt 数据（包括 `smt_entry` for `witness_args.input_type` 和 `smt_root` for cell data）

  - Params
    ```json
    {
      lock_script: hex_string_bytes,
      nfts: [
        {
          cota_id: hex_string_bytes20,
          token_index: hex_string_bytes4,
          state: hex_string_bytes1,
          characteristic: hex_string_bytes20,
        }
      ]
    }
    ```
  - Response
    ```json
    result: {
      update_smt_entry: hex_string_bytes,
      smt_root_hash: hex_string_bytes32,
      block_number: number
    }
    ```

### generate_transfer_cota_smt

为 CoTA NFT 转让（transfer）交易生成 smt 数据（包括 `smt_entry` for `witness_args.input_type` 和 `smt_root` for cell data）

  - Params
    ```json
    {
      lock_script: hex_string_bytes,
      withdrawal_lock_script: hex_string_bytes,
      transfer_out_point: hex_string_bytes24,
      transfers: [
        {
          cota_id: hex_string_bytes20,
          token_index: hex_string_bytes4,
          to_lock_script: hex_string_bytes,
        }
      ]
    }
    ```
  - Response

    ```json
    result: {
      transfer_smt_entry: hex_string_bytes,
      smt_root_hash: hex_string_bytes32,
      block_number: number
    }
    ```

  - Example
    An example as blew to explain the parameters of `generate_transfer_cota_smt` RPC:
    ```bash
    Alice -- NFT A --> Bob -- NFT A --> Tom
    ```
    Now Bob will transfer the NFT A to Tom, here the RPC parameters are:
    ```
    lock_script:          Bob's lock script
    withdrawal_lock_script: Alice's lock script
    transfer_out_point:   The out_point of Bob's CoTA live cell
    to_lock_script:       Tom's lock script
    ```

### generate_claim_update_cota_smt

为 claim 并同时更新 CoTA NFT 信息的交易生成 smt 数据（包括 `smt_entry` for `witness_args.input_type` 和 `smt_root` for cell data）

  - Params
      
      ```json
      {
        lock_script: hex_string_bytes,
        withdrawal_lock_script: hex_string_bytes,
        nfts: [
          {
            cota_id: hex_string_bytes20,
            token_index: hex_string_bytes4,
            state: hex_string_bytes1,
            characteristic: hex_string_bytes20,
          }
        ]
      }
      ```
      
  - Response
      
      ```json
      result: {
        claim_update_smt_entry: hex_string_bytes,
        smt_root_hash: hex_string_bytes32,
        block_number: number
      }
      ```
        

### generate_transfer_update_cota_smt

为 CoTA 转让（transfer）并同时更新 NFT 信息的交易生成 smt 数据（包括 `smt_entry` for `witness_args.input_type` 和 `smt_root` for cell data）

  - Params
      
      ```json
      {
        lock_script: hex_string_bytes,
        withdrawal_lock_script: hex_string_bytes,
        transfer_out_point: hex_string_bytes24,
        transfers: [
          {
            cota_id: hex_string_bytes20,
            token_index: hex_string_bytes4,
            to_lock_script: hex_string_bytes,
            state: hex_string_bytes1,
            characteristic: hex_string_bytes20,
          }
        ]
      }
      ```
      
  - Response
      
      ```json
      result: {
        transfer_update_smt_entry: hex_string_bytes,
        smt_root_hash: hex_string_bytes32,
        block_number: number
      }
      ```
      
  - Example
      
      An example as blew to explain the parameters of `generate_transfer_update_cota_smt` RPC:
      
      ```bash
      Alice -- NFT A --> Bob -- NFT A --> Tom
      ```
      
      Now Bob will transfer the NFT A to Tom, here the RPC parameters are: 
      
      ```bash
      lock_script:          Bob's lock script
      withdrawal_lock_script: Alice's lock script
      transfer_out_point:   The out_point of Bob's CoTA live cell
      to_lock_script:       Tom's lock script
      ```


### get_hold_cota_nft

获取某人名下所持有的（hold，也就是 claim 之后）的 CoTA NFT 列表（不包括 withdraw 状态）

  - Params
    ```json
    {
      lock_script: hex_string_bytes,
      page: number,
      page_size:number,
    }
    ```
  - Response
    ```json
    result: {
      total: number,
      page_size: number,
      block_number: number,
      nfts: [
        {
          cota_id: hex_string_bytes20,
          token_index: hex_string_bytes4,
          configure: hex_string_bytes1,
          state: hex_string_bytes1,
          characteristic: hex_string_bytes20,
          name: string,
          description: string,
          image: string,
        }
      ]
    }
    ```

### get_withdraw_cota_nft

获取接收方名下 withdraw 状态的 CoTA NFT 列表（不包括 hold 状态），可带上 cota_id 参数进行过滤

>注：在发行方或发送方 Alice 分发（mint）或转让（transfer）或 withdraw 某 CoTA NFT 给接收方 Bob 后，且 Bob 尚未 claim 之前，该 NFT 在 Bob 名下即属于 withdraw 状态。
>
>如果 Bob 要转让（transfer）该 NFT 给第三方 Tom，可先通过本接口返回的 NFT 列表中获取所需转让的 NFT 相关信息然后进行下一步操作。

  - Params
    ```json
    {
      lock_script: hex_string_bytes,
      page: number,
      page_size:number,
    }
    ```
  - Response
    ```json
    result: {
      total: number,
      page_size: number,
      block_number: number,
      nfts: [
        {
          cota_id: hex_string_bytes20,
          token_index: hex_string_bytes4,
          configure: hex_string_bytes1,
          state: hex_string_bytes1,
          characteristic: hex_string_bytes20,
          name: string,
          description: string,
          image: string,
        }
      ]
    }
    ```

### get_mint_cota_nft

获取发行方已分发过的所有 CoTA NFT 的列表

  - Params
    ```json
    {
      lock_script: hex_string_bytes,
      page: number,
      page_size:number,
    }
    ```
  - Response
    ```json
    result: {
      total: number,
      page_size: number,
      block_number: number,
      nfts: [
        {
          cota_id: hex_string_bytes20,
          token_index: hex_string_bytes4,
          configure: hex_string_bytes1,
          state: hex_string_bytes1,
          characteristic: hex_string_bytes20,
          receiver_lock: hex_string_bytes,
          name: string,
          description: string,
          image: string,
        }
      ]
    }
    ```

### is_claimed

检查某 CoTA NFT 是否已被 claim
>如果接收方已 claim ，该 NFT 在接收方名下会变为 hold 状态，此时才可以将该 NFT 转给别人（withdraw 给别人）

  - Params
    ```json
    {
      lock_script: hex_string_bytes,
      cota_id: hex_string_bytes20,
      token_index: hex_string_bytes4,
    }
    ```
  - Response
    ```json
    result: {
      claimed: bool,
      block_number: number
    }
    ```

### get_cota_nft_sender

获取某 CoTA NFT 的发送方的 lock hash

  - Params
    ```json
    {
      lock_script: hex_string_bytes,
      cota_id: hex_string_bytes20,
      token_index: hex_string_bytes4,
    }
    ```
  - Response
    ```json
    result: {
      sender_lock_hash: hex_string_bytes32,
      block_number: number
    }
    ```

### get_define_info

根据 cota_id 获取某 CoTA NFT 的定义信息

  - Params
    ```json
    {
      cota_id: hex_string_bytes20,
    }
    ```
  - Response
    ```json
    result: {
      total: number,
      issued: number,
      configure: hex_string_bytes1,
      name: string,
      description: string,
      image: string,
      block_number: number
    }
    ```

### get_issuer_info

获取 issuer 的信息

  - Params
    ```json
    {
      lock_script: hex_string_bytes,
    }
    ```
  - Response
    ```json
    result: {
      avatar: number,
      name: string,
      description: string,
      block_number: number
    }
    ```

### parse_witness

解析 CoTA 的 witness 信息
>注：不同类型交易的 Cota witness 解析出的数据会有不同。

  - Params
    ```json
    {
      witness: hex_string_bytes,
      version: string,
    }
    ```
  - Response
    ```json
    result: {
      cota: {
        action: hex_string_bytes,
        claim_keys: [
          {
            nft_id: {
              cota_id: hex_string_bytes20,
              index: hex_string_bytes4,
              smt_type: hex_string_bytes2,
            },
            out_point: hex_string_bytes24,
          }
        ],
        claim_values: [hex_string_bytes32],
        hold_keys: [
          {
            cota_id: hex_string_bytes20,
            index: hex_string_bytes4,
            smt_type: hex_string_bytes2,
          }
        ],
        hold_values: [
          {
            characteristic: hex_string_bytes20,
            configure: hex_string_bytes1,
            state: hex_string_bytes1,
          }
        ],
        proof: hex_string_bytes,
        type: string,
      },
      info: string
    }
    ```

### get_cota_count

统计某人名下 hold 及 withdraw 状态的 NFT 总数

  - Params
    ```json
    {
      lock_script: hex_string_bytes,
      cota_id: hex_string_bytes20,
    }
    ```
  - Response
    ```json
    result: {
      count: nuber,
      block_number: number
    }
    ```

## RPC 接口示例

RPC 接口数据示例参考 [APIs](https://github.com/nervina-labs/cota-aggregator/blob/develop/README.md#apis)
