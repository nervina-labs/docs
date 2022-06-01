---
title: 持有人相关查询接口
label: holder
---

## 1. 根据 token_uuid 查询该 token 的持有人地址

API 文档：[`GET /api/v1/tokens/{token_uuid}/address`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/default/get_tokens__uuid__address)

Options:

- `token_uuid` -- `string, required`: 查询 token 的 token_uuid

请求示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
token_uuid = 'fd9b685b-a37f-45e5-81cf-0043433460b8'
endpoint = f'/api/v1/tokens/{token_uuid}/address'
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

返回：

```json
{
  "address": "ckt1qjda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xws7nx9v0ycll73vnzpsc0nvm3rh8jkc5g2a7xm59"
}
```

## 2. 查询持有人地址所持有的所有 token

API 文档：[`GET /api/v1/indexer/holder_tokens/{address}`](https://app.swaggerhub.com/apis/ShiningRay/NftSaasOpenAPI/0.0.1#/indexer/get_indexer_holder_tokens__address_)

Options:

- `address` -- `string, required`: 持有人的 ckb 地址

请求示例：

```python
import requests

key = ''
secret = ''
method = 'GET'
address = 'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp'
endpoint = f'/api/v1/indexer/holder_tokens/{address}'
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

返回：

```json
{
  "holder_address": "ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp",
  "meta": {
    "total_count": 9,
    "max_page": 1,
    "current_page": 1
  },
  "token_list": [
    {
      "token_uuid": "a46916b6-b180-4020-ab2b-59377fe3d9e9",
      "n_token_id": 1,
      "class_uuid": "e6469650-6ac5-4477-a64b-2a97f4168356",
      "class_name": "New Token Class Example",
      "class_bg_image_url": "https://examples.jpg",
      "class_description": "Create Token Class by Open API",
      "class_total": "0",
      "class_issued": "2",
      "is_class_banned": false,
      "tx_state": "committed",
      "issuer_name": "名字很长的创作者名字很长的创作者名很长的创作者名字很长的创",
      "issuer_avatar_url": "https://images.pexels.com/photos/3396664/peels-photo-3396664.jpeg",
      "issuer_uuid": "f0d044c2-9ddb-4406-87b3-b281fbb27a76",
      "is_issuer_banned": false,
      "from_address": "f0d044c2-9ddb-4406-87b3-b281fbb27a76",
      "to_address": "ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdxxqycw877rwy0uuwspsh9cteaf8kqp8nzjl0dxfp",
      "token_outpoint": {
        "tx_hash": "0x24ec444afe9d44e664214f659109d4ff852dc72c065f0f12dc921a65df6e4b13",
        "index": 2
      },
      "verified_info": {
        "is_verified": true,
        "verified_title": "知名Rapper,Hiphop文化推广者",
        "verified_source": "official"
      },
      "class_likes": 0
    }
  ]
}
```
