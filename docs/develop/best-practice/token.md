---
title: 铸造分发和查询 NFT token
label: token
---

## 1. 铸造并分发 NFT token

:::info

在 Open API 里，铸造和分发 NFT token 的操作在同一个 API 请求中完成。

:::

API 文档：[`POST /api/v1/token_classes/{token_class_uuid}/tokens`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/default/post_token_classes__token_class_uuid__tokens)

Options:

- `token_class_uuid` -- `string, required`: 将被铸造和分发的 NFT token 对应的 token class，`token_class_uuid` 在创作秘宝时返回；
- `addresses` -- `string, required`: token 分发的目标地址，每个 address 分发一个 token, 如过需要将多个 token 分发到同一地址，则需要填入对应数量的个 address；
- `characteristic` -- `string, optional`: 用于设置 token 的 `characteristic` 字段，单个请求中的所有 token 的 `characteristic` 值一致，默认为 `0000000000000000`;

请求示例：

```python
import json
import requests

key = ''
secret = ''
method = 'POST'
token_class_uuid = 'e6469650-6ac5-4477-a64b-2a97f4168356'
address = 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp'
endpoint = f'/api/v1/token_classes/{token_class_uuid}/tokens'
content = {
    'addresses': [
        address,
        address
    ]
}
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=json.dumps(content))
```

返回示例：

```json
[
  {
    "uuid": "e7c87177-2461-4ea1-8b8f-35d8b2ca34ea",
    "oid": "3eefc8278f217311c88c446731b703d7",
    "version": 0,
    "characteristic": "0000000000000000",
    "issuer_id": 1,
    "token_class_id": 626,
    "state": "pending",
    "configure": 192,
    "n_issuer_id": "0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf",
    "n_state": 0,
    "created_at": "2021-07-06T01:57:48.140Z",
    "updated_at": "2021-07-06T01:57:48.140Z"
  },
  {
    "uuid": "a46916b6-b180-4020-ab2b-59377fe3d9e9",
    "oid": "3eefc8278f217311c88c446731b703d7",
    "version": 0,
    "characteristic": "0000000000000000",
    "issuer_id": 1,
    "token_class_id": 626,
    "state": "pending",
    "configure": 192,
    "n_issuer_id": "0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf",
    "n_state": 0,
    "created_at": "2021-07-06T01:57:48.140Z",
    "updated_at": "2021-07-06T01:57:48.140Z"
  }
]
```

Response 中的 `uuid` 是每个 NFT token 对应的 uuid。

#### 设置 token 的 `characteristic` 字段

在铸造并分发秘宝时可以通过传入可选参数 `characteristic` 来为 token 设置 `characteristic`。Token 默认的 `characteristic` 为 `0000000000000000`。

`characteristic` 参数格式应为类似 `'0123456789abcdef'` 的十六位十六进制字符串，否则会返回 `the characteristic of token is invalid` 错误。如果在一次请求中分发了多个 token，则每个 token 的 `characteristic` 均为传入参数设置的值。

更多关于 `characteristic` 的相关信息可以参考：https://talk.nervos.org/t/rfc-multi-purpose-nft-draft-spec/5434 。

请求示例：

```python
content = {
    'addresses': [
        address,
        address
    ],
    'characteristic': '0123456789abcdef'
}

requests.request(method, url, headers=headers, data=json.dumps(content))
```

每个 token 的 `characteristic` 可以在分发的 response 中或 token 相关查询接口的返回中获取。

## 2. 查询 NFT token

### 2.1 通过 token_uuid 查询 token

API 文档：[`GET /api/v1/token/{token__uuid}`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/default/get_tokens__uuid_)

Options:

- `token_uuid` -- `string, required`: 每个 token 对应的 token_uuid，在铸造并分发时会返回对应的 `token_uuid`

请求示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
token_uuid = '992179fc-515e-42d7-b731-79ae23c92f6c'
endpoint = f'/api/v1/tokens/{token_uuid}'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers)
```

返回示例：

```json
{
  "name": "First NFT 009😄",
  "description": "first nft 009\nasdfasdfas",
  "issued": "6",
  "total": "11",
  "bg_image_url": "https://img.ggg.com/xxxxxx.jpg",
  "issuer_info": {
    "name": "Alice",
    "avatar_url": null,
    "uuid": "6c7d8931-d3ef-4fbb-ae70-0db1c9353f81"
  },
  "tx_state": "committed",
  "class_uuid": "6bf5ae4f-c941-460a-bdc7-1e67115ee740",
  "from_address": "6c7d8931-d3ef-4fbb-ae70-0db1c9353f81",
  "to_address": "ckt1qyqt8lh56d05m9ylnme0rks5phx75pk7ppjqkjmndc",
  "is_class_banned": false,
  "is_issuer_banned": false,
  "n_token_id": 5,
  "verified_info": {
    "is_verified": null,
    "verified_title": "",
    "verified_source": ""
  },
  "class_likes": 0,
  "class_liked": false,
  "uuid": "992179fc-515e-42d7-b731-79ae23c92f6c",
  "created_at": "2021-07-22T08:46:22.589Z",
  "distribution_method": "send",
  "tx_hash": "0x01c308910bc4840c1cde69d15365a9f3b8c4756b955255843c5c7d5046b27f47",
  "tx_uuid": "71e5d500-f0b1-4d47-8206-54ec09a09897"
}
```

### 2.2 根据 `token_class_uuid` 查询对应的所有 token

API 文档：[`GET /api/v1/token_classes/{token_class_uuid}/tokens`](https://app.swaggerhub.com/apis/ginkgo985/openapi/0.0.1#/tokens/get_token_classes__token_class_uuid__tokens)

Options:

- `holder_address` -- `string, optional`: 查询某个地址是否持有该 token class 对应的 token，如果有，则返回该地址持有的所有属于这个 token class 对应的 token；否则返回空；
- `limit` -- `number, optional`: 单次查询返回的 token 数量，默认为 15，最大为 20；
- `page` -- `number, optional`: 查询的起始位置，默认为 0；

请求示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
token_class_uuid = '8e558035-a5d6-4722-a27b-18f705c09c29'
endpoint = f'/api/v1/indexer/token_classes/{token_class_uuid}/tokens'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers)
```

返回示例：

```json
{
  "tokens": [
    {
      "name": "WEBP",
      "description": "",
      "issued": "1",
      "total": "0",
      "bg_image_url": "https://oss.jinse.cc/production/6e839348-95ea-4e8c-b309-a7b9cf184da2.webp?tid=0",
      "issuer_info": {
        "name": "名字很长的创作者名字很长的创作者名很长的创作者名字很长的创",
        "avatar_url": "",
        "uuid": "f0d044c2-9ddb-4406-87b3-b281fbb27a76",
        "issuer_follows": 3,
        "issuer_followed": false
      },
      "tx_state": "committed",
      "class_uuid": "8e558035-a5d6-4722-a27b-18f705c09c29",
      "from_address": "f0d044c2-9ddb-4406-87b3-b281fbb27a76",
      "to_address": "ckt1qsfy5cxd0x0pl09xvsvkmert8alsajm38qfnmjh2fzfu2804kq47v8j0qjulvfk56l2wtnc6merump3ydfz2ytk0ruz",
      "is_class_banned": false,
      "n_token_id": 0,
      "verified_info": {
        "is_verified": true,
        "verified_title": "我是第一个被官方认证的",
        "verified_source": "official"
      },
      "uuid": "aca48571-8ea2-43c3-9ea6-a768d997544c",
      "created_at": "2021-09-13T06:34:28.346Z",
      "distribution_method": "send",
      "tx_hash": "0xae39ce28f3756f887685acace5f5c4eed5ffd5e0227dcd3e7df70fdc7f660481",
      "tx_uuid": "7f2d1e2f-1807-41d9-b41f-c6ff7a325628",
      "renderer_type": "image",
      "renderer": "https://oss.jinse.cc/production/6e839348-95ea-4e8c-b309-a7b9cf184da2.webp?tid=0"
    }
  ],
  "meta": {
    "total_count": 1,
    "max_page": 1,
    "current_page": 1
  }
}
```

#### 2.2.1 通过 holder_address 参数过滤持有人

请求示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
token_class_uuid = '8e558035-a5d6-4722-a27b-18f705c09c29'
endpoint = f'/api/v1/indexer/token_classes/{token_class_uuid}/tokens'
content = ''
content_type = 'application/json'
holder_address = 'ckt1qsfy5cxd0x0pl09xvsvkmert8alsajm38qfnmjh2fzfu2804kq47v8j0qjulvfk56l2wtnc6merump3ydfz2ytk0ruz'

url = f'https://goldenlegend.staging.nervina.cn{endpoint}?holder_address={}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers)
```

#### 2.2.2 分页查询

请求示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
token_class_uuid = '8e558035-a5d6-4722-a27b-18f705c09c29
endpoint = f'/api/v1/indexer/token_classes/{token_class_uuid}/tokens'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn{endpoint}?limit=10&page=7'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers)
```

### 2.3 通过 nft_type_args 查询 token

API 文档： [`GET /api/v1/indexer/tokens/{nft_type_args}`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/indexer/get_indexer_tokens__nft_type_args_)

除了 uuid 外，每个 token 在链上具有唯一标识 nft_type_args，我们通过 nft_type_args 可以查询到对应的 token。

Options：

- `nft_type_args` -- `string, required`: token 对应的 CKB cell 的 type script 的 args 值

请求示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
nft_type_args = '0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf0000002900000000'
endpoint = f'/api/v1/indexer/tokens/{nft_type_args}'
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
    'token': {
        'id': 3271,
        'uuid': 'db144551-e65f-4dc4-9037-fc017734ef7b',
        'issuer_id': 1,
        'token_class_id': 620,
        'n_issuer_id': '0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf',
        'n_token_id': 0,
        'version': 0,
        'configure': 192,
        'characteristic': '0000000000000000',
        'n_state': 0,
        'state': 'committed',
        'created_at': '2021-07-05T11:40:02.071Z',
        'updated_at': '2021-07-05T11:40:02.130Z',
        'oid': '84cbe247c0792718523fecec799b662b',
        'is_committed': True,
        'verified_info': {
            'is_verified': true,
            'verified_title': '知名Rapper,Hiphop文化推广者',
            'verified_source': 'official'
        },
    },
    'cell': {
        'block_number': 2024829,
        'out_point': {
            'tx_hash': '0x511af426c9117d5040c05e95538ba3525d806d97f74a0688cbb835023dd30c7e',
            'index': 1
        },
        'output': {
            'capacity': 13400000000,
            'lock': {
                'code_hash': '0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63',
                'args': '0x9b67065717f46e887d8b9647571db949beec9933',
                'hash_type': 'type'
            },
            'type': {
                'code_hash': '0xb1837b5ad01a88558731953062d1f5cb547adf89ece01e8934a9f0aeed2d959f',
                'args': '0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf0000002900000000',
                'hash_type': 'type'
            }
        },
    'output_data': '0x000000000000000000c000',
    'tx_index': 1
    }
}
```
