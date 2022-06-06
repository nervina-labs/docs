---
title: 创作和查询 NFT token class
label: token-class
---

## 1. 创作秘宝 （NFT token class）

一个 NFT 必须先被创作（即创建 `token_class`），才能进一步被铸造和分发出来。因此创建 `token class` 是所有操作的第一步。

创作秘宝的 API 及其文档为： [`POST /api/v1/token_classes`](https://app.swaggerhub.com/apis/ginkgo985/openapi/0.0.1#/token_class/post_token_classes)。

Options：

- `name` -- `string, required`: NFT 的名称，不能超过 30 个字符（一旦创建，不可修改）；
- `description` -- `string, required`: NFT 的简介，不能超过 200 个字符（一旦创建，不可修改）；
- `total` -- `string, required`: string 类型的非负整数，为 0 时表示 NFT 不限量，其他正整数表示 NFT 限量的数量（一旦创建，不可修改）；
- `renderer` -- `string, required`: NFT 的媒体信息，必须是以 `https://` 开头、以具体支持的格式后缀为结尾、媒体内容有效的 url，长度不能超过 255 个字符（NFT 创作成功后，30 天内仅允许修改一次）。媒体内容支持以下几种类型格式：
  - 图片：支持格式包括 `png`, `jpg`, `jpeg`, `gif`, `webp` 和 `svg` 六种；
  - 视频：支持格式包括 `mp4` 和 `webm` 两种；
  - 3D：支持格式包括 `glb`, `gltf` 和 `usdz` 三种；
  - 音频格式后续具体介绍；

创建 token class 请求成功后，所创建的 token class 上链操作由创作者平台完成。

### 1.1 创作图片类型秘宝

请求代码示例：

```python
import json
import requests

key = ''
secret = ''
method = 'POST'
endpoint = '/api/v1/token_classes'
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

返回示例：

```json
{
  "name": "New Token Class Example",
  "description": "Create Token Class by Open API",
  "issued": "0",
  "renderer": "https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg",
  "cover_image_url": null,
  "uuid": "bd8dc228-b5e7-42c6-b89d-4696130a838e",
  "total": "0",
  "renderer_type": "image",
  "album": null
}
```

返回中的 `uuid` 即为所创作秘宝的 `token class uuid`。

### 1.2 创作视频或 3D 类型秘宝

创作音频或 3D 类型秘宝时，除了上述参数外，还需要传入 `cover_image_url` 用于设置 NFT 的封面，`cover_image_url` 支持 `png`, `jpg`, `jpeg`, `gif`, `webp` 和 `svg` 六种，校验规则与图片类型 `renderer` 一致。

请求 content 示例：

```python
content = {
    'name': 'New Token Class Example',
    'description': 'Create Token Class by Open API',
    'total': '0',
    'renderer': 'https://oss.jinse.cc/production/583b109e-1fc3-42bd-937f-f4935ae80167.mp4',
    'cover_image_url': 'https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg'
}
```

返回示例：

```json
{
  "name": "New Token Class Example",
  "description": "Create Token Class by Open API",
  "issued": "0",
  "renderer": "https://oss.jinse.cc/production/583b109e-1fc3-42bd-937f-f4935ae80167.mp4",
  "cover_image_url": "https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg",
  "uuid": "1e1b3e08-ec07-4c33-8fa4-d9b01acc1a72",
  "total": "0",
  "renderer_type": "video",
  "album": null
}
```

### 1.3 创作音频类型秘宝

秘宝创作者平台支持以专辑的形式创作音频类型秘宝，每个音频类型秘宝最多支持上传 10 首单曲。同时，创作者可以设置仅持有人可以播放或所有人都可以播放音频。

创建音频类型秘宝，除了上述参数外，规则如下：

- `renderer`: 音频类型的 `renderer` 必须为图片类型格式，显示为封面图片，其作用与视频类型或 3D 类型的 `cover_image_url` 一致；
- `album_attributes`: 用于设置音频内容的 `json object`，包括：
  - `album_attributes.is_private`: `true` 表示仅持有人可以播放音频内容； `false` 表示所有人可以播放音频内容；
  - `album_attributes.audios_attributes`: json array，用于设置音频内容，最多支持设置 10 个音频文件，音频仅支持 mp3 格式；

请求 content 示例：

```python
content = {
    'name': 'New Album NFT Example',
    'description': 'Album NFT',
    'total': '0',
    'renderer': 'https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg'
    'album_attributes': {
        'is_private': True,
        'audios_attributes': [
            {
                'name': 'First song',
                'audio_url': 'https://oss.jinse.cc/production/d5d35015-0bcf-46c1-bce5-ff3288e2cf6b.mp3'
            },
            {
                'name': 'Second song',
                'audio_url': 'https://oss.jinse.cc/production/d5d35015-0bcf-46c1-bce5-ff3288e2cf6b.mp3'
            }
        ]
    }
}
```

返回示例：

```json
{
  "name": "New Album NFT Example",
  "description": "Album NFT",
  "issued": "0",
  "renderer": "https://oss.jinse.cc/production/7ea62f75-bec0-4cdc-b81a-d59d7f40ace1.jpg",
  "cover_image_url": null,
  "uuid": "99d58b7c-23b1-4efd-8582-9539d01deaf8",
  "total": "0",
  "renderer_type": "audio",
  "album": {
    "is_private": true,
    "audios": [
      {
        "name": "First song",
        "audio_url": "https://oss.jinse.cc/production/d5d35015-0bcf-46c1-bce5-ff3288e2cf6b.mp3"
      },
      {
        "name": "Second song",
        "audio_url": "https://oss.jinse.cc/production/d5d35015-0bcf-46c1-bce5-ff3288e2cf6b.mp3"
      }
    ]
  }
}
```

:::info

已创建 token class 中的 `renderer`, `cover_image_url` 和 `album_attributes` 可以在后续进行修改，但 30 天内仅支持修改一次。

:::

## 2. 修改秘宝 （token class）

秘宝设计完成后，仅 renderer 和 cover_image_url 可以修改，且 30 天内仅允许修改一次。

API 文档： [`PUT /token_classes/{token_class_uuid}`](https://app.swaggerhub.com/apis/ginkgo985/openapi/0.0.1#/token_class/put_token_classes__uuid__)

Options:

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
token_class_uuid = '43edf4ba-9c77-466e-807f-d35cb4465c6f'
endpoint = f'/api/v1/token_classes/{token_class_uuid}'
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

## 3. 查询秘宝（token class）

Open API 可以查询当前帐号创作的所有 token class，或者通过 token_class_uuid 查询指定 token class.

### 3.1 查询当前帐号创作的所有 token classes

API 文档：[`GET /api/v1/token_classes`](https://app.swaggerhub.com/apis/ginkgo985/openapi/0.0.1#/token_class/get_token_classes)

Options:

- `count` -- `number, optional`: 一次返回的 token classes 数量，默认为 15，最大为 100；
- `cursor` -- `number, optional`: 查询的起始位置，默认为 0；

请求示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
endpoint = '/api/v1/token_classes'
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

查询当前帐号创作的全部秘宝支持通过 `count` 和 `cursor` 进行分页查询，带分页查询参数的请求示例如下：

```python
import requests

key = ''
secret = ''
method = 'GET'
endpoint = '/api/v1/token_classes'
content = ''
content_type = 'application/json'

url = f'https://goldenlegend.staging.nervina.cn{endpoint}?count=10&cursor=200'
signature, gmt = get_signature_and_gmt(secret, method, endpoint, content, content_type)
headers = {
    'Content-Type': content_type,
    'Date': gmt,
    'Authorization': f'NFT {key}:{signature}'
}

requests.request(method, url, headers=headers)
```

### 3.2 根据指定 token_class_uuid 查询 token class

API 文档：[`GET /api/v1/token_classes/{token_class_uuid}`](https://app.swaggerhub.com/apis/ginkgo985/openapi/0.0.1#/token_class/get_token_classes__uuid__)

Options:

- `token_class_uuid` -- `string, required`: 需要查询的 token class 的 uuid, token_class_uuid 在创建 token_class 的返回中会返回；

请求示例：

```python
import requests
key = ''
secret = ''
method = 'GET'
token_class_uuid = '7b1eb753-77a8-46ec-ad8a-d78bc204b8d3'
endpoint = f'/api/v1/token_classes/{token_class_uuid}'
content = ''
content_type = 'application/json'
url = f'https://goldenlegend.staging.nervina.cn{endpoint}'

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
