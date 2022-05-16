---
title: 常见问题 Q&A
label: CoTA
---

> 这篇 Q&A 主要对一些常见问题做一些解答。

## 1. 如何获取 CotaID
在发行方定义(Define) CoTA NFT 的时候，会返回 CoTAID。
详情见：[定义(Define) CoTA NFT](./cota-nft-life#2-定义define-cota-nft)


## 2. 如何定义不限量的 CoTA NFT
在发行方定义(define) CoTA NFT 的时候，在如下所示相关代码中，如果发行数量参数 `issueAmount` 设置为 `0` ，则表示不限量：
```
let { rawTx, cotaId } = await generateDefineCotaTx(service, defineLock, issueAmount, '0x00', cotaInfo, FEE, isMainnet)
```


## 3. 如何查询 CoTA NFT

### 3.1 查询发行方已分发过的所有 CoTA NFT
相关 JSONRPC 接口： [get_mint_cota_nft](https://developer.mibao.net/docs/develop/cota/aggregator/cota#get_mint_cota_nft)

相关代码参考：
```
const getMintCotaNft = await service.aggregator.getMintCotaNft({
    lockScript: serializeScript(addressToScript(TEST_ADDRESS)),
    page: "0",
    pageSize: "100",
    cotaId: COTAID
})
```

### 3.2 查询接收者的 CoTA NFT
 
#### 3.2.1  withdraw 状态

- 发生场景：
  - 发行方 `mint` 给接收方后
  - 发送者 `transfer` 或者 `withdraw` 给接收方后

- 相关操作：
  - 可以直接 `transfer` 给别人
  - 也可以先 `claim` 后 `withdraw` 给别人，最终效果同 `transfer`

- 相关 JSONRPC 接口： [get_withdraw_cota_nft](https://developer.mibao.net/docs/develop/cota/aggregator/cota#get_withdraw_cota_nft)

- 相关代码参考：
   ```
   const cotaNFTs = await service.aggregator.getWithdrawCotaNft({
        lockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
        page: 0,
        pageSize: 3,
        cotaId: COTAID, 
    })
   ```

#### 3.2.2 claim 操作

- 接收方在对 `withdraw` 状态的 CoTA NFT 进行了 `claim` 操作后，会变成 `hold` 状态，此时通过 RPC `is_claimed` 检查该 NFT 会返回为 `true`

- 检查某 NFT 是否已被 claim：
  - 相关 JSONRPC 接口： [is_claimed](https://developer.mibao.net/docs/develop/cota/aggregator/cota#is_claimed)
  - 相关代码参考：
    ```
    const isClaimed = await service.aggregator.isClaimed({
        lockScript:
        '0x490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000dc70f33de86fdf381b4fc5bf092bb23d02774801',
        cotaId: COTAID,
        tokenIndex: '0x00000000',
    })
    ```

#### 3.2.3 hold 状态
- 发生场景：
  - 接收者 `claim` 了 `withdraw` 状态的 CoTA NFT 后
- 相关操作：
  - 可以直接 `withdraw` 给别人
  - 不能进行 `transfer` 操作
- 相关 JSONRPC 接口： [get_hold_cota_nft](https://developer.mibao.net/docs/develop/cota/aggregator/cota#get_hold_cota_nft)

- 相关代码参考：
  ```
  const cotaNFTs = await service.aggregator.getHoldCotaNft({
        lockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
        page: 0,
        pageSize: 3,
        cotaId: COTAID, 
    })
  ```


## 4. 关于 withdraw & claim
- `transfer` 操作已经包含了 `withdraw` & `claim` 两步操作
- `withdraw` 操作参考代码：https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/withdraw.ts
- `claim` 操作参考代码：https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/claim.ts

## 5. cota-sdk 报错：Cota cell doesn't exist
 
遇到这个报错可能有以下原因：

- ckb-indexer 没有同步到最新区块高度（判定最新区块高度，可以查看 ckb-indexer 的日志，观察最新日志中的区块高度是否跟 ckb explorer 上的最新区块高度一致）
- cota-sdk 与 cota-aggregator 不是同一个网络（主网和测试网），查看网络的方式：cota-sdk example isMainnet / cota-aggregator env is_mainnet

## 6. aggregator 报错：RocksDB open error: IO error: While lock file: ./store.db/LOCK: Resource temporarily unavalilable

遇到这个报错的原因和处理的方式：
- 将 cota-aggregator 与 cota-registry-aggregator 隔离部署，至少放置在不同的目录下分开部署，否则两者的 rocks db 文件会冲突
- 删掉根目录下的 store.db 文件，重新启动 aggregator