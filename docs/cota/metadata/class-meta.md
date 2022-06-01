---
title: Class Metadata
label: CoTA
---

```YAML
title: CoTA NFT Class 的 Metadata 规范
type: object
properties:
  version:
    type: string
    description: 指定所用 Metadata 规范的版本
    optional: false

  name:
    type: string
    description: 指定 NFT Class 的名称
    optional: false

  symbol:
    type: string
    description: 指定 NFT Class 的缩写
    optional: true

  description:
    type: string
    description: 指定 NFT Class 的文字描述信息
    optional: true

  image:
    type: string
    description: 指定 NFT Class 对应的图片信息, 即图片 NFT 的原图/非图片 NFT 的封面. 媒体资源存储在 IPFS, 此处填入文件 CID 或`文件目录 CID/{{id}}`, 为 `文件目录 CID/{{id}}` 时, 应用层需将实际 id 代入索引.
    optional: false

  audio:
    type: string
    description: 指定音频 NFT Class 的音频文件, 媒体信息存储在 IPFS, 此处填入文件 CID 或`文件目录 CID/{{id}}`, 为 `文件目录 CID/{{id}}` 时, 应用层需将实际 id 代入索引.
    optional: true

  video:
    type: string
    description: 指定视频 NFT Class 的视频文件, 媒体信息存储在 IPFS, 此处填入文件 CID 或`文件目录 CID/{{id}}`, 为 `文件目录 CID/{{id}}` 时, 应用层需将实际 id 代入索引.
    optional: true

  model:
    type: string
    description: 指定模型 NFT Class 的模型文件, 模型文件存储在 IPFS, 此处填入文件 CID 或`文件目录 CID/{{id}}`, 为 `文件目录 CID/{{id}}` 时, 应用层需将实际 id 代入索引
    optional: true

  characteristic:
    type: array
    description: 针对 NFT characteristic 的元数据, 由 [name, length] 的元组构成, 其中 name 为属性名称, length 为 NFT characteristic 中的长度
    optional: false

  properties:
    type: object
    description: NFT Class 的链下自定义属性
    optional: true
    [property_name]:
      value:
        type: string
        description: 属性值
        optional: false

      max_value: string
        description: 属性最大范围值, format 为 ranking 时使用
        optional: true

      format:
        type: string | number | percentage | ranking | date
        description: 属性类型
        optional: false

  localization:
    type: object
    properties:
      uri:
        type: string
        description: 存储国际化信息的 uri, 包含 {locale} 占位符, 例如 url 为 `http://localhost:3000/i18n/{locale}.json`, 应用层的语言为 fr, 则实际请求 `http://localhost:3000/i18n/fr.json`, 返回对英语言版本的 metadata
        optional: false
      default:
        type: string
        description: 默认语言版本, 即秘宝的 renderer 对应的 metadata 语言版本
      locales:
        type: array
        description: 支持的语言版本, 采用 ISO 639-1 标准

    optional: true



# 在 metadata 中建议使用 cid, 在应用层面建议做 dnslink 支持
# 媒体链接中代入 id 处亦可替换成 locale, block_number, tx_hash, 来请求不同语言版本/时期的 NFT 表现
# date 的值为 Unix 时间戳
# 新增媒体格式可以顺着 image, audio, video, model 同级扩展下去, 允许包含多个媒体形成多媒体资源包
```

示例

```JSON
{
  "version": "0.0.1", // 版本号
  "name": "秘宝名称",  // 秘宝名称
  "symbol": "Mibao",  // 简化符号
  "description": "秘宝描述",  // 描述信息
  "image": "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/{id}", // 带有 token id 的图片链接
  "audio": "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/{id}_{locale}", // 带有 token id 和语言信息的音频链接
  "video": "https://mibao.net/public/video/{block_number}", // 带有区块高度的视频链接, 一般这种只能通过服务端处理, 比如返回视频的某个片段
  "model": "https://mibao.net/public/model/{tx_hash}", // 带有交易哈希的模型资源链接
  "characteristic": [
    [
      ["特点1", 1], // 取 cell data 中 characteristic[0] 为特征 1 的值
      ["特点2", 2], // 取 cell data 中 characteristic[1, 2] 为特征 2 的值
      ["特点3", 3], // 取 cell data 中 characteristic[3, 4, 5] 为特征 3 的值
    ]
  ],
  "properties": {
    "头衔": { // 头衔为 "首席挖坑家" 的链下属性
      "value": "首席挖坑家",
      "format": "string"
    },
    "力量": { // 力量为 20 的链下属性
      "value": "20",
      "format": "number"
    },
    "健康度": { // 健康度为 20% 的链下属性
      "value": "20",
      "format": "percentage"
    },
    "等级": { // 等级为 10/20 的链下属性
      "value": "10",
      "max_value": "20",
      "format": "ranking"
    },
    "生日": { // 生日为 1637838033 对应的时间
      "value": "1637838033",
      "format": "date"
    }
  },
  "localization": {
    "uri": "https://mibao.net/public/i18n/{locale}", // 国际化 Metadata 存储在 https://mibao.net/public/i18n/ 目录, 支持英语和法语
    "default": "zh",
    "locales": ["en", "fr"]
  }
}
```
