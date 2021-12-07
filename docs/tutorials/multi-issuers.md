---
sidebar_position: 5
---
# 发行人管理

   创作者默认对应一个 issuer，该 issuer 的信息即为用户在秘宝创作平台设置的公开信息。

Open API 允许一个帐号创建多个 issuer，不同 issuer 之间相互独立，即每个 issuer 有独立的 key-secret，可以单独设置创作者信息，以及设计和发行秘宝。

对拥有 multi-Issuers 权限的帐号，我们可以称该帐号对应的 API key 为 master_key，由其创建的 issuer 对应的 API key 为 issuer_key。对于原有接口，只有 master_key 可以正常请求使用；issuer_key 仅有权限进行设计秘宝、铸造和发行秘宝及其对应的查询请求。

注：如需使用该功能，需要单独申请 multi-Issuers 功能权限。用户可以发送邮件到 biz@nervina.io 进行申请，内容必须包含要申请开通 multi-Issuers 权限的帐号邮箱地址。


## Issuers 管理

master_key 可以对其创建的所有 issuers 进行管理，issuer_key 无此权限。

### 获取全部 issuers 列表

master_key 可以查询该帐号下所有的 issuer 信息。

API 文档：[GET /issuers](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/issuers/get_issuers)

代码示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
endpoint = f'/issuers'
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

返回示例：

```python
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

### 创建新的 issuer

master_key 可以创建新的 issuer。

API 文档：[POST /issuers](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/issuers/post_issuers)

必要参数：

* `name` : 新创建的 issuer name，最多 30 个字符
  可选参数：

* `avatar_url` ：创作者头像图片链接，最多 255 个字符，必须以 https:// 开头，以 png, jpg, jpeg, gif, webp, svg 这六种文件格式之一为后缀结尾
* `website` ：创作者官网地址，最多 200 个字符
* `description` : 创作者简介，最多 200 个字符
* `email` ：创作者邮箱地址，最多 100 个字符
* `weibo` ：创作者社交媒体链接，最多 200 个字符

代码示例：

```python
import requests

key = ''
secret = ''
method = 'POST'
endpoint = f'/issuers'
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

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers, data=content)
```

返回示例：

```python
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

返回信息中的  `uuid` 为该 issuer 对应的 uuid，`api_token.access_key` ， `api_token.secret` 即为该 issuer 进行设计和发行秘宝时的 key-secret， `api_token.refresh_token` 为 issuer 更新 key-secret 时需要的参数（后边相关 API 会详细介绍）。 
`api_token` 相关信息仅在创建时返回一次，请谨慎保管。

### 更新 issuer 信息

master_key 可以更新已有 issuer 的相关信息。

API 文档：[PUT /issuers/{issuer_uuid}](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/issuers/put_issuers__uuid_)

必要参数：

* `name` : issuer name，最多 30 个字符
  可选参数：

* `avatar_url` ：创作者头像图片链接，最多 255 个字符，必须以 https:// 开头，以 png, jpg, jpeg, gif, webp, svg 这六种文件格式之一为后缀结尾
* `website` ：创作者官网地址，最多 200 个字符
* `description` : 创作者简介，最多 200 个字符
* `email` ：创作者邮箱地址，最多 100 个字符
* `weibo` ：创作者社交媒体链接，最多 200 个字符

代码示例：

```python
import requests

key = ''
secret = ''
method = 'PUT'
endpoint = f'/issuers/5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a'
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

url = f'https://goldenlegend.staging.nervina.cn/api/v1{endpoint}'
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

### 获取指定 issuer 信息

master_key 可以获取指定 issuer 信息。

API 文档：[GET /issuers/{issuer_uuid}](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/issuers/get_issuers__uuid_)

代码实例：

```python
import requests

key = ''
secret = ''
method = 'GET'
endpoint = f'/issuers/5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a'
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

返回实例：

```python
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

### 更新指定 issuer 的 key/secret/refresh_token

master 可以更新所有 issuer 的 key-secret；issuer 可以更新自己的 key-secret。

API 文档：[POST /issuers/{issuer_uuid}/api_tokens](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/api_key/post_issuers__issuer_uuid__api_tokens)

参数：

*  `refresh_token` : 使用 master 请求 refresh token 时，该参数可以忽略；使用 issuer 请求时，该参数为必须参数

代码实例：

```python
import requests

key = ''
secret = ''
method = 'POST'
endpoint = f'/issuers/5f4ebad3-38a1-44d2-8e9d-0212a09f9c5a/refresh_token'
content = '
{
  "refresh_token": "53a74a524a769180bc4cf60e863d385ef29d93795cfb0ddbd86970f736baebda"
}
'
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

返回实例：

```json
{
    "api_token": {
        "access_key": "SgxjJTJZ3MDlFwny",
        "secret": "cc31c0e8fd263b116dfb9cbe3787458cd42cf3e054cdbe522b284c0b77a4d9c9",
        "refresh_token": "ba5dbcf681f006243e79aa7abaf820c003335fad9b90c4b1a76039a9b3de70d4"
    }
}
```

返回中的  `access_key` ,  `secret` 和  `refresh_token` 为新的 key-secret ，仅返回一次，请妥善保管。
