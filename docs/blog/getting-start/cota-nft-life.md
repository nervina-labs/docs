---
title: CoTA NFT 的一生
label: CoTA
---

> 本指南主要介绍 CoTA NFT 从被发行方定义到转让的主要步骤及代码参考。

```
为方便理解，本指南中做一些角色预设：
发行方：Alice
接收方：Bob
其他人：Tom
```

## 1. 注册(Registry) CoTA Cell

发行方 Alice 注册(registry) CoTA cell。

> 前提：需要持有一定的 CKB 用于注册 CoTA Cell + 找零，目前注册需要 150 CKB。

相关代码参考：https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/registry.ts


## 2. 定义(Define) CoTA NFT
由发行方 Alice 定义 CoTA NFT。

在如下所示相关代码中，如果发行数量参数(`issueAmount`)设置为 `0` ，则表示不限量:
```
let { rawTx, cotaId } = await generateDefineCotaTx(service, defineLock, issueAmount, '0x00', cotaInfo, FEE, isMainnet)
```

相关代码参考：https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/define.ts


## 3. 分发(Mint) CoTA NFT
由发行方 Alice 分发 CoTA NFT 给接收方 Bob。

> 此步骤对于接收方是否已注册 CoTA cell 没有限制。

相关代码参考：https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/mint.ts

## 4. 转让(Transfer) CoTA NFT

收到 CoTA NFT 后，接收方 Bob 可以转让该 CoTA NFT 给其他人 Tom。

> 前提：在转让之前，接收方 Bob 也需要先注册(registry) CoTA Cell，注册方式同本篇指南中的第 1 步。

相关代码参考：https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/transfer.ts
