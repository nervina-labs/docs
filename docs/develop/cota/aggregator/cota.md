---
title: CoTA Aggregator
label: CoTA
---

> block_number 表示当前数据同步到的最新区块高度，建议以当 block_number 与 CKB 链上最新高度一致时返回的数据为准

## JSONRPC 接口

- Method: generate_define_cota_smt

  - Params:

    ```json

    {
      lock_hash: hex_string_bytes32
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

- Method: generate_mint_cota_smt

  - Params:
    ```js
    {
      lock_hash: hex_string_bytes32,
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

- Method: generate_withdrawal_cota_smt

  - Params
    ```json
    {
        lock_hash: hex_string_bytes32,
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

- Method: generate_claim_cota_smt

  - Params

    ```json
    {
      lock_script: hex_string_bytes,
      withdrawal_lock_hash: hex_string_bytes32,
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

- Method: generate_update_cota_smt

  - Params
    ```json
    {
      lock_hash: hex_string_bytes32,
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

- Method: generate_transfer_cota_smt

  - Params
    ```json
    {
      lock_script: hex_string_bytes,
      withdrawal_lock_hash: hex_string_bytes32,
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
    withdrawal_lock_hash: Alice's lock hash
    transfer_out_point:   The out_point of Bob's CoTA live cell
    to_lock_script:       Tom's lock script
    ```

- Method: get_hold_cota_nft

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

- Method: get_withdraw_cota_nft

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
      block_number: number
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

- Method: get_mint_cota_nft

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
      block_number: number
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

- Method: is_claimed

  - Params
    ```json
    {
      lock_hash: hex_string_bytes32,
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

- Method: get_cota_nft_sender
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
