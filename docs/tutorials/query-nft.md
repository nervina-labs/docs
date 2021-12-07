---
sidebar_position: 2
---

# 查询秘宝


##  查询 token class

相关文档：[GET /token_classes/{uuid}](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/default/get_token_classes__uuid__)

查询字段：

* `uuid` : 在创建 token class 时返回的 uuid

代码示例：

```python
import requests
key = ''
secret = ''
method = 'GET'
uuid = '7b1eb753-77a8-46ec-ad8a-d78bc204b8d3'
endpoint = f'/token_classes/{uuid}'
content = ''
content_type = 'application/json'
url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'

signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {    
    'Content-Type': content_type,    
    'Date': gmt,    
    'Authorization': f'NFT {key}:{signature}'}

requests.request(method, url, headers=headers)
```

返回：

```json
{
  "name": "New token class",
  "description": "New token class description",
  "issued": "0",
  "renderer": "https://oss.jinse.cc/production/8ee71e29-3b10-4d15-b68c-380c7840c653.jpeg",
  "uuid": "7b1eb753-77a8-46ec-ad8a-d78bc204b8d3",
  "total": "0",
  "verified_info": {
    "is_verified": true,
    "verified_title": "金色传说官方认证",
    "verified_source": "official"
  },
  "tags": []
}

```

##  查询创作平台账户下所有的 token class

相关文档：[GET /token_classes](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/default/get_token_classes)

代码示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
endpoint = '/token_classes'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers)
```

返回：

```json
{
  "token_classes": [
    {
      "name": "New token class",
      "description": "New token class description",
      "issued": "0",
      "renderer": "https://oss.jinse.cc/production/8ee71e29-3b10-4d15-b68c-380c7840c653.jpeg",
      "uuid": "7b1eb753-77a8-46ec-ad8a-d78bc204b8d3",
      "total": "0",
      "is_banned": false,
      "verified_info": {
        "is_verified": true,
        "verified_title": "金色传说官方认证",
        "verified_source": "official"
      },
      "tags": []
    },
    ...
  ],
  "meta": {
    "next_cursor": "1314",
    "has_banned_items": true
  }
}

```



## 查询 NFT token

相关文档：[GET /tokens/{token_uuid}](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/default/get_tokens__uuid_)

查询参数：

* `token_uuid` : 铸造并分发秘宝时返回的 token uuid

代码示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
token_uuid = '992179fc-515e-42d7-b731-79ae23c92f6c'
endpoint = f'/tokens/{token_uuid}'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers)
```

返回：

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

## 根据 token id 查询持有者地址

相关文档：[GET /tokens/{token_uuid}/address](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/default/get_tokens__uuid__address)

查询参数：

* `token_uuid` : 铸造并分发后返回的 token uuid

代码示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
token_uuid = 'fd9b685b-a37f-45e5-81cf-0043433460b8'
endpoint = f'/tokens/{token_uuid}/address'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=content)
```

返回：

```json
{
    'address': 'ckt1qjda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xws7nx9v0ycll73vnzpsc0nvm3rh8jkc5g2a7xm59'
}
```

## NFT 持有者相关查询

### 查询地址所持有的 NFT

相关文档：[GET /indexer/holder_tokens/{address}](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/indexer/get_indexer_holder_tokens__address_)

查询参数：

* `address` : 要查询的 ckb 地址

代码示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
address = 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp'
endpoint = f'/indexer/holder_tokens/{address}'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=content)
```

返回：

```json
{
    'holder_address': 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp',
    'meta': {
        'total_count': 9,
        'max_page': 1,
        'current_page': 1
    },
    'token_list': [
        {
            'token_uuid': 'a46916b6-b180-4020-ab2b-59377fe3d9e9',
            'n_token_id': 1,
            'class_uuid': 'e6469650-6ac5-4477-a64b-2a97f4168356',
            'class_name': 'New Token Class Example',
            'class_bg_image_url': 'https://examples.jpg',
            'class_description': 'Create Token Class by Open API',
            'class_total': '0',
            'class_issued': '2',
            'is_class_banned': false,
            'tx_state': 'committed',
            'issuer_name': '名字很长的创作者名字很长的创作者名很长的创作者名字很长的创',
            'issuer_avatar_url': 'https://images.pexels.com/photos/3396664/peels-photo-3396664.jpeg',
            'issuer_uuid': 'f0d044c2-9ddb-4406-87b3-b281fbb27a76',
            'is_issuer_banned': false,
            'from_address': 'f0d044c2-9ddb-4406-87b3-b281fbb27a76',
            'to_address': 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp',
            'token_outpoint': {
                'tx_hash': '0x24ec444afe9d44e664214f659109d4ff852dc72c065f0f12dc921a65df6e4b13',
                'index': 2
            },
            'verified_info': {
                'is_verified': true,
                'verified_title': '知名Rapper,Hiphop文化推广者',
                'verified_source': 'official'
            },
            'class_likes': 0
        }
    ]
}
```

### 查询 NFT type args 对应的 token

相关文档：[GET /indexer/tokens/{nft_type_args}](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/indexer/get_indexer_tokens__nft_type_args_)

查询参数：

* `nft_type_args` : 在对应的 CKB Cell 的 Type Script 中的 args

代码示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
nft_type_args = '0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf0000002900000000'
endpoint = f'/indexer/tokens/{nft_type_args}'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=content)
```

返回：

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



### 查询 token class 对应的 token

相关文档：GET /indexer/token_classes/{token_class_uuid}/tokens

查询参数：

*  `holder_address` : 查询某个地址是否持有该 token class 中的 token
*  `limit` : 可选参数，分页参数，单次查询返回 token 列表的数量，最大为 20，
*  `page` : 可选参数，分页参数，指定查询返回的 token 范围
 
代码实例：

```python
import requests

key = ''
secret = ''
method = 'GET'
endpoint = '/indexer/token_classes/8e558035-a5d6-4722-a27b-18f705c09c29/tokens'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers)
```

返回：

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
