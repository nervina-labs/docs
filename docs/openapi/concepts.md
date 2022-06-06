---
title: 基本概念
label: api-concepts
---

本文将统一说明 Open API 中的一些基本概念，这将有助于您后续的探索和使用。

- `issuer`: 创作者，即当前调用 Open API 进行操作的秘宝创作者平台帐号；
- `token_class`: 存储在链上，可以理解为铸造 NFT 的模具，包含 NFT 的基本信息。一个 NFT 必须先创作出 `token_class` 才能被铸造和分发出来；
- `uuid`: 秘宝平台为了方便使用而被创建出来的一种具有唯一标识性的 id，其中包括：
  - `issuer_uuid`: 创作者对应的 `uuid`;
  - `token_class_uuid`: `token_class` 对应的 `uuid`；
  - `token_uuid`: NFT 对应的 `uuid`；
  - `tx_uuid`: 所有 NFT 相关交易对应的 `uuid`；
- `address`: 收藏者的 ckb 地址，主网和测试网的地址分别以 `ckb` 和 `ckt` 开头；
- `nft_type_args`: NFT 的链上数据，具体为 NFT token cell 中 Type Script 的 `args` 字段内容；
