---
title: Multi-issuers
label: multi-issuers
---

在秘宝创作者平台注册帐号后，默认会生一个创作者对应的 issuer，该 issuer 的信息即为用户在秘宝创作者平台设置的公开信息。

Open API 允许一个帐号创建多个 issuers，不同 issuer 之间相互独立，即每个 issuer 有独立的 key/secret，可以单独设置独立的创作者信息，用于创作和发行秘宝。

对拥有 multi-issuers 权限的帐号，我们可以称该帐号对应的 API key 为 master_key，将由其创建的 issuer 对应的 API key 为 issuer_key。对于原有接口，只有 master_key 可以正常请求使用；master 拥有 issuer 的所有权限，issuer 仅可以通过指定 API 操作自己创作的秘宝。

注：如需使用该功能，需要单独申请 multi-Issuers 功能权限。用户可以发送邮件到 biz@nervina.io 进行申请，内容必须包含要申请开通 multi-issuers 权限的帐号邮箱地址。

## 1. Issuers 管理

Master_key 可以对其创建的所有 issuers 进行增删改查的管理操作，issuer_key 无此权限。

### 1.1 获取全部 issuers 列表

Master_key 可以查询该帐号下所有的 issuers 信息。

API 文档：[`GET /api/v1/issuers`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/issuers/get_issuers)

代码示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
endpoint = f'/api/v1/issuers'
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
  "issuers": [
    {
      "avatar_url": "https://images.pexels.com/photos/3396664/peels-photo-3396664.jpeg",
      "name": "issuer_name",
      "description": "issuer_description",
      "website": "",
      "email": "",
      "weibo": "",
      "uuid": "f0d044c2-9ddb-4406-87b3-b281fbb27a76"
    }
  ]
}
```

### 1.2 创建新的 issuer

Master_key 可以创建新的 issuer。

API 文档：[`POST /api/v1/issuers`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/issuers/post_issuers)

Options：

- `name` -- `string, required`: 新创建的 issuer name，最多 30 个字符；
- `avatar_url` -- `string, optional`：创作者头像图片链接，最多 255 个字符，必须以 `https://` 开头，以 png, jpg, jpeg, gif, webp, svg 这六种文件格式之一为后缀结尾；
- `website` -- `string, optional`：创作者官网地址，最多 200 个字符；
- `description` -- `string, optional`: 创作者简介，最多 200 个字符；
- `email` -- `string, optional`：创作者邮箱地址，最多 100 个字符；
- `weibo` -- `string, optional`：创作者社交媒体链接，最多 200 个字符；

请求示例：

```python
import requests

key = ''
secret = ''
method = 'POST'
endpoint = f'/api/v1/issuers'
content = '
{
    "avatar_url": "https://www.avatar.jpg",
    "name": "new issuer name",
    "website": "https://www.website.com",
    "description": "new issuer description",
    "email": "issuer@nervina.io",
    "weibo": "https://weibo.com/xxx"
}
'
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
  "avatar_url": "https://www.avatar.jpg",
  "name": "new issuer name",
  "description": "new issuer description",
  "website": "https://www.website.com",
  "email": "issuer@nervina.io",
  "weibo": "https://weibo.com/xxx",
  "uuid": "5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a",
  "api_token": {
    "access_key": "Nkx9gUnpaBwD7gCl",
    "secret": "7226c58ef55f5539fb0fe3afa24978c87581365763abc4f020dbf3a5a379b7de",
    "refresh_token": "53a74a524a769180bc4cf60e863d385ef29d93795cfb0ddbd86970f736baebda"
  }
}
```

返回信息中的 `uuid` 为该 issuer 对应的 `issuer_uuid`，`api_token.access_key` ， `api_token.secret` 为该 issuer 进行设计和发行秘宝时的 key/secret， `api_token.refresh_token` 为 issuer 更新 key-secret 时需要的参数（后边相关 API 会详细介绍）。

:::warning

`api_token` 相关信息仅在创建时返回一次，请谨慎保管。

:::

### 1.3 更新 issuer 信息

Master_key 可以更新已有 issuer 的相关信息。

API 文档：[`PUT /api/v1/issuers/{issuer_uuid}`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/issuers/put_issuers__uuid_)

Options：

- `name` -- `string, required`: issuer name，最多 30 个字符；
- `avatar_url` -- `string, optional`：创作者头像图片链接，最多 255 个字符，必须以 https:// 开头，以 png, jpg, jpeg, gif, webp, svg 这六种文件格式之一为后缀结尾；
- `website` -- `string, optional`：创作者官网地址，最多 200 个字符；
- `description` -- `string, optional`: 创作者简介，最多 200 个字符；
- `email` -- `string, optional`：创作者邮箱地址，最多 100 个字符；
- `weibo` -- `string, optional`：创作者社交媒体链接，最多 200 个字符；

请求示例：

```python
import requests

key = ''
secret = ''
method = 'PUT'
endpoint = f'/api/v1/issuers/5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a'
content = '
{
    "avatar_url": "https://www.avatar.jpg",
    "name": "update new issuer name",
    "website": "https://www.website.com",
    "description": "new issuer description",
    "email": "issuer@nervina.io",
    "weibo": "https://weibo.com/xxx"
}
'
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
  "avatar_url": "https://www.avatar.jpg",
  "name": "update new issuer name",
  "description": "new issuer description",
  "website": "https://www.website.com",
  "email": "issuer@nervina.io",
  "weibo": "https://weibo.com/xxx",
  "uuid": "5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a"
}
```

### 1.4 获取指定 issuer 信息

Master_key 可以获取指定 issuer 信息。

API 文档：[`GET /api/v1/issuers/{issuer_uuid}`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/issuers/get_issuers__uuid_)

请求示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
endpoint = f'/api/v1/issuers/5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a'
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

返回实例：

```json
{
  "issuer": {
    "avatar_url": "https://www.avatar.jpg",
    "name": "new issuer name",
    "description": "new issuer description",
    "website": "https://www.website.com",
    "email": "issuer@nervina.io",
    "weibo": "https://weibo.com/xxx",
    "uuid": "5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a"
  }
}
```

### 1.5 更新指定 issuer 的 key/secret

Master 可以更新所有 issuer 的 key/secret；issuer 可以更新自己的 key/secret。

API 文档：[`POST /api/v1/issuers/{issuer_uuid}/api_tokens`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/api_key/post_issuers__issuer_uuid__api_tokens)

Options:

- `refresh_token` -- `string, optional`: 使用 master 请求 refresh token 时，该参数可以忽略；使用 issuer 请求时，该参数为必须参数

请求示例：

```python
import requests

key = ''
secret = ''
method = 'POST'
endpoint = f'/api/v1/issuers/5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a/refresh_token'
content = '
{
  "refresh_token": "53a74a524a769180bc4cf60e863d385ef29d93795cfb0ddbd86970f736baebda"
}
'
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
  "api_token": {
    "access_key": "SgxjJTJZ3MDlFwny",
    "secret": "cc31c0e8fd263b116dfb9cbe3787458cd42cf3e054cdbe522b284c0b77a4d9c9",
    "refresh_token": "ba5dbcf681f006243e79aa7abaf820c003335fad9b90c4b1a76039a9b3de70d4"
  }
}
```

:::warning

返回中的 `access_key` , `secret` 和 `refresh_token` 为新的 key/secret ，仅返回一次，请妥善保管。

:::

## 2. Issuer 创作和发行秘宝

issuer 可以独立创作和发行秘宝。

### 2.1 创作秘宝

API 文档：[`POST /api/v1/issuers/{issuer_uuid}/token_classes`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/token_class/post_issuers__uuid__token_classes)

Options：

- `name` -- `string, required`: NFT 的名称，不能超过 30 个字符（一旦创建，不可修改）；
- `description` -- `string, required`: NFT 的简介，不能超过 200 个字符（一旦创建，不可修改）；
- `total` -- `string, required`: string 类型的非负整数，为 0 时表示 NFT 不限量，其他正整数表示 NFT 限量的数量（一旦创建，不可修改）；
- `renderer` -- `string, required`: NFT 的媒体信息，规则同 `POST /api/v1/token_classes`；

创建 token class 请求成功后，所创建的 token class 上链操作由创作者平台完成。Issuer 创作秘宝规则与 master 创作秘宝的规则一致，此处仅作创作图片类型 NFT 的示例。

代码示例：

```python
import json
import requests

key = ''
secret = ''
method = 'POST'
issuer_uuid = '620dc081-2790-4952-867f-756bf02981db'
endpoint = f'/api/v1/issuers/{issuer_uuid}/token_classes'
content = {
    'name': 'New Token Class Example',
    'description': 'Create Token Class by Open API',
    'total': '0',
    'renderer': 'https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg'
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

返回：

```json
{
  "name": "New Token Class Example",
  "description": "Create Token Class by Open API",
  "issued": "0",
  "renderer": "https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg",
  "uuid": "e6469650-6ac5-4477-a64b-2a97f4168356",
  "total": "0",
  "tags": []
}
```

返回中的 `uuid` 即为所创作秘宝的 `token class uuid`。

### 2.2 查询指定 issuer 创作的所有 token classes

相关文档：[`GET /api/v1/issuers/{issuer_uuid}/token_classes`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/token_class/get_issuers__uuid__token_classes)

代码示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
issuer_uuid = '5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a'
endpoint = f'/api/v1/issuers/{issuer_uuid}/token_classes'
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

### 2.3 修改指定 issuer 设计的秘宝（token class）

相关文档：[`PUT /issuers/{issuer_uuid}/token_classes/{token_class_uuid}`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/token_class/put_issuers__issuer_uuid__token_classes__token_class_uuid_)

秘宝设计完成后，仅 renderer 和 cover_image_url 可以修改，且 30 天内仅允许修改一次。

- `renderer` -- `string, required`: NFT 的媒体信息，规则同 `POST /api/v1/token_classes`；
- `cover_image_url` -- `string, optional`: NFT 封面信息，当 NFT 类型为视频或 3D 类型时必须传入；

修改秘宝 token class 会上链，上链操作由平台完成。

请求示例：

```python
import json
import requests

key = ''
secret = ''
method = 'PUT'
issuer_uuid = '5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a'
token_class_uuid = '43edf4ba-9c77-466e-807f-d35cb4465c6f'
endpoint = f'/api/v1/issuers/{issuer_uuid}/token_classes/{token_class_uuid}'
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

返回示例：

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

### 2.4 铸造并发行秘宝

API 文档：[`POST /api/v1/issuers/{issuer_uuid}/token_classes/{token_class_uuid}/tokens`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/tokens/post_issuers__issuer_uuid__token_classes__token_class_uuid__tokens)

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
issuer_uuid = '5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a'
token_class_uuid = '43edf4ba-9c77-466e-807f-d35cb4465c6f'
address = 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp'
endpoint = f'/api/v1/issuers/{issuer_uuid}/token_classes/{token_class_uuid}/tokens'
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

返回示例：

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

其中， `uuid` 为对应 NFT token 的 `token_uuid`

### 7.2.5 查询指定 issuer 创建的 token class 对应的全部 tokens

相关文档：[`GET /api/v1/issuers/{issuer_uuid}/token_classes/{token_class_uuid}/tokens`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/tokens/get_issuers__issuer_uuid__token_classes__token_class_uuid__tokens)

Options:

- `token_class_uuid` : 设计秘宝时返回的 `token_class_uuid`

请求示例：

```python
import json
import requests

key = ''
secret = ''
method = 'GET'
issuer_uuid = '5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a'
token_class_uuid = '43edf4ba-9c77-466e-807f-d35cb4465c6f'
address = 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp'
endpoint = f'/api/v1/issuers/{issuer_uuid}/token_classes/{token_class_uuid}/tokens'
content = ''
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
