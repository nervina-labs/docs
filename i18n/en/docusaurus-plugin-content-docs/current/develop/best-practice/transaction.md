---
title: 转让交易
label: transaction
---

收藏者可以对自己持有的 token 发起转让交易。

Open API 仅提供生成未签名的交易、对已完成签名交易进行广播和查询交易状态的接口，签名交易的部分需要开发真自己实现。

## 1. 生成未签名的原始交易

API 文档：[`GET /api/v1/tx/token_transfers/new`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/unsigned_tx_generators/get_tx_token_transfers_new)

Options：

- `from_address` -- `string, required`: token 收藏者的地址，同时也是需要对生成交易签名的私钥的持有者；
- `to_address` -- `string, required`: 转让的目标地址，一旦转让交易广播成功，交易将无法撤回；
- `token_uuid` -- `string, option`: 要转让 token 的 token_uuid;
- `nft_type_args` -- `string, option`: 要转让 token 的 nft_type_args；

:::info

`token_uuid` 和 `nft_type_args` 两者必须至少传入一个，如果二者同时传入时，将转让 `token_uuid` 对应的 token

:::

请求示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
from_address = 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdx83pmv9wj80kf0w5zfym9am9eply253tuu8v5lsn'
to_address = 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp'
token_uuid = 'a46916b6-b180-4020-ab2b-59377fe3d9e9'
endpoint = f'/api/v1/tx/token_transfers/new?from_address={from_address}&to_address={to_address}&token_uuid={token_uuid}'

# 如果使用 nft_type_args，则 endpoint 如下：
# nft_type_args = 'cf12d78e-96b9-40d1-b6ca-1d5ff1d87287'
# endpoint = f'/api/v1/tx/token_transfers/new?from_address={from_address}&to_address={to_address}&nft_type_args={nft_type_args}'

content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=content)
```

返回示例：

```json
{
  "unsigned_tx": {
    "version": "0x0",
    "cell_deps": [
      {
        "out_point": {
          "tx_hash": "0xbd262c87a84c08ea3bc141700cf55c1a285009de0e22c247a8d9597b4fc491e6",
          "index": "0x2"
        },
        "dep_type": "code"
      },
      {
        "out_point": {
          "tx_hash": "0xd346695aa3293a84e9f985448668e9692892c959e7e83d6d8042e59c08b8cf5c",
          "index": "0x0"
        },
        "dep_type": "code"
      },
      {
        "out_point": {
          "tx_hash": "0x03dd2a5594ed2d79196b396c83534e050ba0ad07fa5c1cd61a7094f9fb60a592",
          "index": "0x0"
        },
        "dep_type": "code"
      },
      {
        "out_point": {
          "tx_hash": "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
          "index": "0x0"
        },
        "dep_type": "dep_group"
      }
    ],
    "header_deps": [],
    "inputs": [
      {
        "previous_output": {
          "tx_hash": "0x0e9cad38a05005dff037c5c1df917efe5be53409976405a330ed15e14f939d3b",
          "index": "0x0"
        },
        "since": "0x0",
        "capacity": "0x31eb3ba4e",
        "lock": {
          "code_hash": "0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63",
          "args": "0xc43b615d23bec97ba8249365eecb90fc8aa457ce",
          "hash_type": "type"
        },
        "type": {
          "code_hash": "0xb1837b5ad01a88558731953062d1f5cb547adf89ece01e8934a9f0aeed2d959f",
          "args": "0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf0000002300000000",
          "hash_type": "type"
        }
      }
    ],
    "outputs": [
      {
        "capacity": "0x31eb3b450",
        "lock": {
          "code_hash": "0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63",
          "args": "0x009871fde1b88fe71d00c2e5c2f3d49ec009e629",
          "hash_type": "type"
        },
        "type": {
          "code_hash": "0xb1837b5ad01a88558731953062d1f5cb547adf89ece01e8934a9f0aeed2d959f",
          "args": "0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf0000002300000000",
          "hash_type": "type"
        }
      }
    ],
    "outputs_data": ["0x000000000000000000c000"],
    "witnesses": ["0x"]
  }
}
```

## 2. 对签名后的交易广播上链

API 文档：[`POST /api/v1/tx/token_transfers`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/unsigned_tx_generators/post_tx_token_transfers)

Options：

- `from_address` -- `string, required`: token 收藏者的地址，同时也是需要对生成交易签名的私钥的持有者；
- `to_address` -- `string, required`: 转让的目标地址，一旦转让交易广播成功，交易将无法撤回；
- `signed_tx` -- `string, required`: 签名完成的交易字符串
- `token_uuid` -- `string, option`: 要转让 token 的 token_uuid;
- `nft_type_args` -- `string, option`: 要转让 token 的 nft_type_args；

:::info

`token_uuid` 和 `nft_type_args` 两者必须至少传入一个，如果二者同时传入时，将转让 `token_uuid` 对应的 token

:::info

请求示例：

```python
import requests

key = ''
secret = ''
method = 'POST'
endpoint = '/api/v1/tx/token_transfers'
content = {
    'from_address': 'ckt1qjda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xws7nx9v0ycll73vnzpsc0nvm3rh8jkc5g2a7xm59',
    'to_address': 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp',
    'nft_type_args': '0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf0000003300000002',
    'token_uuid': 'f40588f2-7ed3-468c-afbf-ef92f2ecf99a',
    'signed_tx': '{"version":"0x0","cell_deps":[{"out_point":{"tx_hash":"0xbd262c87a84c08ea3bc141700cf55c1a285009de0e22c247a8d9597b4fc491e6","index":"0x2"},"dep_type":"code"},{"out_point":{"tx_hash":"0xd346695aa3293a84e9f985448668e9692892c959e7e83d6d8042e59c08b8cf5c","index":"0x0"},"dep_type":"code"},{"out_point":{"tx_hash":"0x03dd2a5594ed2d79196b396c83534e050ba0ad07fa5c1cd61a7094f9fb60a592","index":"0x0"},"dep_type":"code"},{"out_point":{"tx_hash":"0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37","index":"0x0"},"dep_type":"dep_group"}],"header_deps":[],"inputs":[{"previous_output":{"tx_hash":"0x52419c2bf7131908052e7fbed374ca82f3b9a23c091bcfcb487c4ac1c4c90717","index":"0x1"},"since":"0x0"}],"outputs":[{"capacity":"0x31eb3c002","type":{"code_hash":"0xb1837b5ad01a88558731953062d1f5cb547adf89ece01e8934a9f0aeed2d959f","args":"0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf0000003300000002","hash_type":"type"},"lock":{"code_hash":"0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63","args":"0x009871fde1b88fe71d00c2e5c2f3d49ec009e629","hash_type":"type"}}],"outputs_data":["0x000000000000000000c000"],"witnesses":["0x5500000010000000550000005500000041000000c3e23abd5f3fb6350d138c7e25933c1a7e150d6aa75f8c118e55233101052af079ba116a515180252b73e2cbe02a2924118ed710c7e5c5e80c7e5b80258be45800"]}'
}
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=content)
```

返回示例：

```json
{
  "tx_hash": "0x8ea665214de0a494f8df0125cbf492e96b2ec1df2cae8569bfe1d27759a3925b",
  "uuid": "396d73ca-f0b2-44ef-93a0-ea0d40e6fdc0"
}
```

Response 中的 `tx_hash` 即为该交易上链的交易哈希，可在 ckb 浏览器对应查看； `uuid` 即为该交易在秘宝中对应的交易 `tx_uuid`，通过相应接口可查询交易状态。

## 3. 查询交易状态

API 文档：[`GET /api/v1/tx/token_transfers/{tx_uuid}`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/unsigned_tx_generators/get_tx_token_transfers__uuid_)

Options：

- `tx_uuid` -- `string, required`: 交易的 `tx_uuid`

请求示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
tx_uuid = '75fddac0-7cda-4d9f-a770-56ee8ab6489c'
endpoint = f'/api/v1/tx/token_transfers/{tx_uuid}'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=content)
```

返回示例：

```json
{
  "from_address": "a2406443-4fbc-4058-ace2-ea2de19bace3",
  "to_address": "ckt1qsfy5cxd0x0pl09xvsvkmert8alsajm38qfnmjh2fzfu2804kq47v67zaqf9v82ypv7maevz5h70va4eevpggc8gjyw",
  "tx_type": "issue",
  "on_chain_timestamp": 1625492143,
  "tx_state": "committed",
  "issuer_name": "issuer_name",
  "issuer_avatar_url": "https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1620901052284.gif",
  "class_bg_image_url": "https://oss.jinse.cc/production/c8eb25b0-457c-4ac0-98b8-4308ac465893.png",
  "class_name": "Test",
  "class_total": "5",
  "class_uuid": "c2b0c5fb-6145-485d-995e-dd265b17471d",
  "n_token_id": 1
}
```
