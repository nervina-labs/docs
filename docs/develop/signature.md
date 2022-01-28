---
title: 签名算法
label: signature
---

为了保证您的资产安全，在调用 Open API 接口时，请求的 `Header` 中需要将 `Authorization` 字段设置为对应的签名信息，表明这个请求已被正确授权。

## 1. 待签名字符串计算规则

```plain
Authorization = 'NFT ' + apiKey + ':' + Signature

Signature = base64(hmac-sha1(apiSecret,
              VERB + '\n'
              + FULLPATH + '\n'
              + Content-MD5 + '\n'
              + Content-Type + '\n'
              + Date))
```

- `apiKey` 即为您申请得到的对应账户的 API key；
- `apiSecret` 即为您申请得到的对应帐号的 secret；
- `VERB` 表示请求的 method，包括 `GET`、`POST`、`PUT` 等；
- `\n` 表示换行符；
- `FULLPATH` 表示请求的 endpoint，如果有 query-string，也需要包含在内；
- `Content-MD5` 表示请求内容数据的 MD5 值，对消息内容（不包括消息头）计算 MD5 值获得 128 比特位数字，然后对该数字进行 base64 编码即可得到。该值可用于消息合法性的检查（消息内容是否与发送时一致）；当正文为空时，Content-MD5 留空即可。详情可参看 [RFC2616 Content-MD5](https://www.ietf.org/rfc/rfc2616.txt)；
- `Content-Type` 表示请求内容的格式类型，如 `application/json` ，也可以为空；
- `Date` 表示请求的时间，必须为 GMT 格式，如 `Sun, 22 Nov 2015 08:16:38 GMT`；

Open API 请求的 `headers` 中， `Date` 、 `Content-Type` 和 `Authorization` 为必须包含的字段，且 `Date` 中的时间和 Open API 服务器的时间相差不能超过 10 分钟，否则 Open API 服务器将拒绝该请求，并返回 401 错误。

:::info

- 签名的字符串必须为 `UTF-8` 格式，含有中文字符的签名字符串必须先进行 `UTF-8` 编码，再进行后续计算；
- 签名的方法为 RFC 2014 中定义的 `HMAC-SHA1` 方法，其中 key 为 `apiSecret`；
- `Content-Type` 和 `Content-MD5` 可以为空，但不能省略；

:::

## 2. 代码示例

### Python 签名示例

Python 版本为 3.9.1。

```plain
# 请求
GET /api/v1/token_classes
Content-MD5: ''
Content-Type: 'application/json'
Date: Tue, 06 Jul 2021 00:00:34 GMT

# 待签名字符串根据规则计算为
'GET\n/api/v1/token_classes\n\napplication/json\nTue, 06 Jul 2021 00:00:34 GMT'
```

Python 签名代码如下：

```python
import base64
import hmac
import hashlib
from datetime import datetime

def get_signature(secret, method, endpoint, content, gmt, content_type='application/json'):

    if content:
        content_md5 = base64.b64encode(
            hashlib.md5(content.encode('utf-8')).digest()).decode('utf-8')
    else:
        content_md5 = ''

    msg = f'{method}\n{endpoint}\n{content_md5}\n{content_type}\n{gmt}'

    h = hmac.digest(secret.encode('utf-8'), msg.encode('utf-8'), hashlib.sha1)
    signature = base64.b64encode(h).decode('utf-8')

    return signature

key = '44CF9590006BF252F707'
secret = 'OtxrzxIsfpFjA7SwPzILwy8Bw21TLhquhboDYROV'
method = 'GET'
endpoint = '/api/v1/token_classes'
content = ''
content_type = 'application/json'
gmt = 'Tue, 06 Jul 2021 00:00:34 GMT'

signature = get_signature(secret, method, endpoint, content, gmt, content_type)    # SXc3VHXXbU08qzYdAm1RvwMWaUw=
auth = f'NFT {key}:{signature}'
print(auth)    # NFT 44CF9590006BF252F707:SXc3VHXXbU08qzYdAm1RvwMWaUw=
```

得到 `auth` 后，最终的请求为：

```plain
GET /api/v1/token_classes
Content-MD5: ''
Content-Type: 'application/json'
Date: Tue, 06 Jul 2021 00:00:34 GMT
Authorization: NFT 44CF9590006BF252F707:SXc3VHXXbU08qzYdAm1RvwMWaUw=
```

## 3. 常见错误

- 请求的 `Header` 中缺少 `Content-Type` 、 `Date` 或 `Authorization` ，返回 `Missing Content-Type/Date/Authorization in header`；
- 请求中使用了错误的 key，返回 `Cannot find access key`；
- 请求计算签名使用了错误的 secret 或者计算签名有误，返回 `Signature mismatch` ，并返回 `string_to_sign` ，为该请求用来计算签名的 message，方便排查计算签名遇到的问题；
- 请求 header 中的 `Authorization` 格式应为 `NFT key:signature` ，格式错误时返回 `Cannot find access key`；
- 请求中的时间与服务器时间相差超过 10 分钟，返回 `Time expired`；
