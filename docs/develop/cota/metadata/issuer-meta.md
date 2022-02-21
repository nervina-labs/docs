---
title: Issuer Metadata
label: CoTA
---

```YAML
title: CoTA issuer 的 Metadata 规范
type: object
properties:
  version:
    type: string
    description: 指定所用 Metadata 规范的版本
    optional: false

  name:
    type: string
    description: issuer 名称
    optional: false

  avatar:
    type: string
    description: issuer 头像
    optional: true

  description:
    type: string
    description: issuer 简介
    optional: true

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
```
