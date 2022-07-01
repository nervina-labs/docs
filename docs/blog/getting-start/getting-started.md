---
title: 开发准备
label: CoTA
---

> 本指南将指导您如何安装 [cota-sdk-js](https://github.com/nervina-labs/cota-sdk-js) 。

---

### 前置环境准备

在开始进行开发前，需要有一些前置环境准备工作，请先确保您已部署了 **[Aggregator 相关服务](https://www.cotadev.io/docs/guides/aggregator)**

注：在使用 Testnet 来进行开发和测试时，除了可以自己部署 Aggregator 服务以外，也可以使用以下社区提供的公共 rpc 服务来进行开发和测试：

```
ckb testnet:
https://testnet.ckbapp.dev/rpc ---> ckb testnet node rpc
https://testnet.ckbapp.dev/indexer ---> ckb testnet indexer rpc

testnet aggregator rpc url：
https://cota.nervina.dev/aggregator ---> testnet cota aggregator rpc
https://cota.nervina.dev/registry-aggregator ---> testnet cota registry aggregator rpc
```

### 安装 SDK

添加 cota-sdk dependency 到您的项目中，可用以下任一方式添加：

- npm: `npm install @nervina-labs/cota-sdk`

- yarn: `yarn add @nervina-labs/cota-sdk`
