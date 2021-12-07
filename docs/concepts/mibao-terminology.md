---
sidebar_position: 5
---

# 秘宝相关术语


## 3. 术语说明

* `token_class` : 可以理解为秘宝的模具，包含秘宝的基本信息，将会在链上存储；一个秘宝必须先被设计出秘宝模具，通过秘宝模具才能进行铸造和分发。
* `uuid` : 为了方便使用而被创建出来的一种 id，其中包括：
  * `token_class_uuid` : 关联到对应的  `token_class` 
  * `token_uuid` : 关联到具体的 NFT Token
  * `tx_uuid` : 关联分发和转让的交易
* `address` : ckb 地址
* `nft_type_args` : NFT Token Cell 的 Type Script 中的  `args` 字段
