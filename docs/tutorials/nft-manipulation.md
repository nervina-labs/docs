---
sidebar_position: 3
---

# 设计秘宝、铸造和分发秘宝
   相关代码可以参考： [https://github.com/nervina-labs/nft_open_api_demo_python](https://github.com/nervina-labs/nft_open_api_demo_python)

## 设计秘宝

相关文档：[POST /](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/default/post_token_classes)[token_classes](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/default/post_token_classes)

设计秘宝必须包含以下字段：

* name: 秘宝的名称，不超过 30 个字符（一旦创建，不可修改）
* description: 秘宝的简介，不超过 200 个字符（一旦创建，不可修改）
* total: string 类型的非负整数，为 0 时，表示秘宝不限量；大于 0 时，表示秘宝限量的数量（一旦创建，不可修改）
* renderer: 秘宝的媒体信息，必须为以  `https://` 开头、媒体信息有效的 url，且不超过 255 字符（秘宝设计完成后，30 天内可修改一次 renderer）
  * renderer 为图片：支持格式为 png, jpg, jpeg, gif, webp 和 svg 6 种格式，必须以  `https://` 开头，且结尾为 `png | jpg | jpeg | gif | webp | svg`。
  * renderer 为音视频或 3D：支持格式为 mp3, wav, mp4, webm, glb 和 gltf 6 种格式，必须以  `https://` 开头，且结尾为  `mp3 | wav | mp4 | webm | glb | gltf`。当 renderer 为音视频或 3D 时，同时需要传入参数  `cover_image_url` 用于设置 NFT 封面，校验规则与图片格式的 renderer 一致。
    设计的秘宝 token class 会上链，上链操作由平台完成。

代码示例：

```python
import json
import requests

key = ''
secret = ''
method = 'POST'
endpoint = '/token_classes'
content = {
    'name': 'New Token Class Example',
    'description': 'Create Token Class by Open API',
    'total': '0',
    'renderer': 'https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg'
}
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=json.dumps(content))
```

返回：

```json
{
    'name': 'New Token Class Example', 
    'description': 'Create Token Class by Open API', 
    'issued': '0', 
    'renderer': 'https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg', 
    'uuid': 'e6469650-6ac5-4477-a64b-2a97f4168356',
    'total': '0', 
    'tags': []
}
```

其中， `uuid` 为平台生成的唯一标识 token class id

```python
# 如果创建音频或视频格式的秘宝，则 content 如下所示：
content = {
    'name': 'New Token Class Example',
    'description': 'Create Token Class by Open API',
    'total': '0',
    'renderer': 'https://oss.jinse.cc/production/583b109e-1fc3-42bd-937f-f4935ae80167.mp4',
    'cover_image_url': 'https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg'
}
```

* 在设计秘宝时提供可选参数`configure`，用于设置 NFT class cell 的 `configure`，金色传说平台默认设置为 `11000000`， 相关信息可参考：[https://talk.nervos.org/t/rfc-multi-purpose-nft-draft-spec/5434](https://talk.nervos.org/t/rfc-multi-purpose-nft-draft-spec/5434)。 `configure` 格式应为类似  `11000000` 的 8 位二进制字符串，否则会返回  `configure field format error` 

请求示例： 

```python
# 可选参数 configure 设置 NFT class cell 的 configure
content = {
    'name': 'New Token Class with Configure Example',
    'description': 'Create Token Class by Open API',
    'total': '0',
    'configure': '00000000',
    'renderer': 'https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg'
}
```

### 4.4 铸造并分发秘宝

相关文档：[POST /token_classes/{token_class_uuid}/tokens](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/default/post_token_classes__token_class_uuid__tokens)

查询字段：

* `token_class_uuid` : 设计秘宝时返回的 token class uuid
  请求字段：

* `addresses` : 一个由 ckb 地址组成的列表

代码示例：

```python
import json
import requests

key = ''
secret = ''
method = 'POST'
uuid = 'e6469650-6ac5-4477-a64b-2a97f4168356'
address = 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp'
endpoint = f'/token_classes/{uuid}/tokens'
content = {
    'addresses': [
        address,
        address
    ]
}
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=json.dumps(content))
```

返回：

```json
[
    {
        'uuid': 'e7c87177-2461-4ea1-8b8f-35d8b2ca34ea', 
        'oid': '3eefc8278f217311c88c446731b703d7', 
        'version': 0, 
        'characteristic': '0000000000000000', 
        'issuer_id': 1, 
        'token_class_id': 626, 
        'state': 'pending', 
        'configure': 192, 
        'n_issuer_id': '0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf', 
        'n_state': 0, 
        'created_at': '2021-07-06T01:57:48.140Z', 
        'updated_at': '2021-07-06T01:57:48.140Z'
    }, {
        'uuid': 'a46916b6-b180-4020-ab2b-59377fe3d9e9', 
        'oid': '3eefc8278f217311c88c446731b703d7', 
        'version': 0, 
        'characteristic': '0000000000000000', 
        'issuer_id': 1, 
        'token_class_id': 626, 
        'state': 'pending', 
        'configure': 192, 
        'n_issuer_id': '0xf90f9c38b0ea0815156bbc340c910d0a21ee57cf', 
        'n_state': 0, 
        'created_at': '2021-07-06T01:57:48.140Z', 
        'updated_at': '2021-07-06T01:57:48.140Z'
    }
]

```

其中，  `uuid` 是具体的 NFT token id


### 7.2 设计和发行秘宝相关接口

issuer 可以独立设计、更新秘宝。

#### 7.2.1 设计秘宝

相关文档：[POST /issuers/{issuer_uuid}/token_classes](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/token_class/post_issuers__uuid__token_classes)

设计秘宝必须包含以下字段：

* name: 秘宝的名称，不超过 30 个字符（一旦创建，不可修改）
* description: 秘宝的简介，不超过 200 个字符（一旦创建，不可修改）
* total: 非负整数，为 0 时，表示秘宝不限量；大于 0 时，表示秘宝限量的数量
* renderer: 秘宝的媒体信息，必须为以  `https://` 开头、媒体信息有效的 url，且不超过 255 字符（秘宝设计完成后，30 天内可修改一次 renderer）
  * renderer 为图片：支持格式为 png, jpg, jpeg, gif, webp 和 svg 6 种格式，必须以  `https://` 开头，且结尾为 `png | jpg | jpeg | gif | webp | svg`。
  * renderer 为音频或视频：支持格式为 mp3, wav, mp4 和 webm 4 种格式，必须以  `https://` 开头，且结尾为  `mp3 | wav | mp4 | webm`。当 renderer 为音视频时，同时需要传入参数  `cover_image_url` 用于设置 NFT 封面，校验规则与图片格式的 renderer 一致。
    设计的秘宝 token class 会上链，上链操作由平台完成。

代码示例：

```python
import json
import requests

key = ''
secret = ''
method = 'POST'
endpoint = '/token_classes/5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a/token_classes'
content = {
    'name': 'New Token Class Example',
    'description': 'Create Token Class by Open API',
    'total': '0',
    'renderer': 'https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg'
}
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=json.dumps(content))
```

返回：

```json
{
    'name': 'New Token Class Example', 
    'description': 'Create Token Class by Open API', 
    'issued': '0', 
    'renderer': 'https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg', 
    'uuid': 'e6469650-6ac5-4477-a64b-2a97f4168356', '
    total': '0', 
    'tags': []
}
```

其中， `uuid` 为平台生成的唯一标识 token class id

```python
# 如果创建音频或视频格式的秘宝，则 content 如下所示：
content = {
    'name': 'New Token Class Example',
    'description': 'Create Token Class by Open API',
    'total': '0',
    'renderer': 'https://oss.jinse.cc/production/583b109e-1fc3-42bd-937f-f4935ae80167.mp4',
    'cover_image_url': 'https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg'
}
```

* 在设计秘宝时提供可选参数`configure`，用于设置 NFT class cell 的 `configure`，金色传说平台默认设置为 `11000000`， 相关信息可参考：[https://talk.nervos.org/t/rfc-multi-purpose-nft-draft-spec/5434](https://talk.nervos.org/t/rfc-multi-purpose-nft-draft-spec/5434)。 `configure` 格式应为类似  `11000000` 的 8 位二进制字符串，否则会返回  `configure field format error` 

请求示例： 

```python
# 可选参数 configure 设置 NFT class cell 的 configure
content = {
    'name': 'New Token Class with Configure Example',
    'description': 'Create Token Class by Open API',
    'total': '0',
    'configure': '00000000',
    'renderer': 'https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg'
}
```

#### 7.2.2 查询指定 issuer 创作的所有 token classes

相关文档：[GET /issuers/{issuer_uuid}/token_classes](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/token_class/get_issuers__uuid__token_classes)

代码示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
endpoint = '/issuers/5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a/token_classes'
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
            "name": "issuerA-ikey-c001",
            "description": "first nft",
            "issued": "0",
            "renderer": "https://oss.jinse.cc/production/db8b6440-6e26-4a80-8dc7-cfdd022e0b6d.jpg",
            "cover_image_url": "",
            "uuid": "43edf4ba-9c77-466e-807f-d35cb4465c6f",
            "total": "1000",
            "is_banned": false,
            "verified_info": {
                "is_verified": null,
                "verified_title": "",
                "verified_source": ""
            }
        }
    ],
    "meta": {
        "total_count": 1,
        "max_page": 1,
        "current_page": 1
    }
}
```

#### 7.2.3 修改指定 issuer 设计的秘宝（token class）

相关文档：[PUT /issuers/{issuer_uuid}/token_classes/{token_class_uuid}](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/token_class/put_issuers__issuer_uuid__token_classes__token_class_uuid_)

秘宝设计完成后，仅 renderer 部分可以修改

* renderer: 秘宝的媒体信息，必须为以  `https://` 开头、媒体信息有效的 url，且不超过 255 字符（秘宝设计完成后，30 天内可修改一次 renderer）
  * renderer 为图片：支持格式为 png, jpg, jpeg, gif, webp 和 svg 6 种格式，必须以  `https://` 开头，且结尾为 `png | jpg | jpeg | gif | webp | svg`。
  * renderer 为音频或视频：支持格式为 mp3, wav, mp4 和 webm 4 种格式，必须以  `https://` 开头，且结尾为  `mp3 | wav | mp4 | webm`。当 renderer 为音视频时，同时需要传入参数  `cover_image_url` 用于设置 NFT 封面，校验规则与图片格式的 renderer 一致。
    修改秘宝 token class 会上链，上链操作由平台完成。

代码示例：

```python
import json
import requests

key = ''
secret = ''
method = 'PUT'
endpoint = 'issuers/5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a/token_classes/43edf4ba-9c77-466e-807f-d35cb4465c6f'
content = {
    'renderer': 'https://game-4m-assets.oss-cn-shanghai.aliyuncs.com/AdobeStock_95598553.jpeg'
}
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=json.dumps(content))
```

返回：

```json
{
    "name": "issuerA-ikey-c001",
    "description": "first nft",
    "issued": "0",
    "renderer": "https://game-4m-assets.oss-cn-shanghai.aliyuncs.com/AdobeStock_95598553.jpeg",
    "cover_image_url": null,
    "uuid": "43edf4ba-9c77-466e-807f-d35cb4465c6f",
    "total": "1000"
}
```

#### 7.2.4 铸造并发行秘宝

相关文档：[POST /issuers/{issuer_uuid}/token_classes/{token_class_uuid}/tokens](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/tokens/post_issuers__issuer_uuid__token_classes__token_class_uuid__tokens)

查询字段：

* `token_class_uuid` : 设计秘宝时返回的 token class uuid
  请求字段：

* `addresses` : 一个由 ckb 地址组成的列表
  代码示例：

```python
import json
import requests

key = ''
secret = ''
method = 'POST'
address = 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp'
endpoint = '5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a/token_classes/43edf4ba-9c77-466e-807f-d35cb4465c6f/tokens'
content = {
    'addresses': [
        address
    ]
}
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=json.dumps(content))
```

返回：

```json
[
    {
        "uuid": "27b03ca5-abbe-4c82-9416-c37c2462d630",
        "oid": "83d1ab0dd73c408ecf4d4ae7dd88172b",
        "version": 0,
        "characteristic": "0000000000000000",
        "issuer_id": 1760,
        "token_class_id": 2348,
        "state": "pending",
        "configure": 192,
        "n_issuer_id": "0xb69cb79760a0a1a187af8c3b94643776237d5899",
        "n_state": 0,
        "created_at": "2021-10-25T15:36:13.674+08:00",
        "updated_at": "2021-10-25T15:36:13.674+08:00"
    }
]
```

其中，  `uuid` 是具体的 NFT token id 

#### 7.2.5 获取指定 issuer 创建的 token class 对应的全部 tokens

相关文档：[GET /issuers/{issuer_uuid}/token_classes/{token_class_uuid}/tokens](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/tokens/get_issuers__issuer_uuid__token_classes__token_class_uuid__tokens)

查询字段：

* `token_class_uuid` : 设计秘宝时返回的 token class uuid

代码示例：

```python
import json
import requests

key = ''
secret = ''
method = 'GET'
address = 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp'
endpoint = '5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a/token_classes/43edf4ba-9c77-466e-807f-d35cb4465c6f/tokens'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=json.dumps(content))
```

返回：

```json
{
    "tokens": [
        {
            "name": "issuerA-ikey-c001",
            "description": "first nft",
            "issued": "1",
            "total": "1000",
            "bg_image_url": "https://game-4m-assets.oss-cn-shanghai.aliyuncs.com/AdobeStock_95598553.jpeg",
            "issuer_info": {
                "name": "update new name",
                "avatar_url": "",
                "uuid": "5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a",
                "issuer_follows": 0,
                "issuer_followed": false
            },
            "tx_state": "submitting",
            "class_uuid": "43edf4ba-9c77-466e-807f-d35cb4465c6f",
            "from_address": "5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a",
            "to_address": "ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp",
            "is_class_banned": false,
            "is_issuer_banned": false,
            "n_token_id": 0,
            "verified_info": {
                "is_verified": null,
                "verified_title": "",
                "verified_source": ""
            },
            "class_likes": 0,
            "class_liked": false,
            "uuid": "27b03ca5-abbe-4c82-9416-c37c2462d630",
            "created_at": "2021-10-25T15:36:13.674+08:00",
            "distribution_method": "send",
            "tx_hash": "0x89ed628e5fbe2e4585d486a61b531dc7cd479cdeb04b5ed187851af9290e9f82",
            "tx_uuid": "c4a9fe74-3f14-48d7-a154-ff013062626d",
            "renderer_type": "image",
            "renderer": "https://game-4m-assets.oss-cn-shanghai.aliyuncs.com/AdobeStock_95598553.jpeg",
            "class_card_back_content_exist": false,
            "class_card_back_content": null,
            "id": 21711,
            "is_redeemed": false
        }
    ],
    "meta": {
        "total_count": 1,
        "max_page": 1,
        "current_page": 1
    }
}
```
