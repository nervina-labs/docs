---
title: Aggregator
label: CoTA
---

## CoTA Registry Aggregator

Everyone should register only one cota cell before minting or transferring NFTs and his/her lock hash which is like an address will be recorded in the global registry merkel tree.

The latest registry merkel tree root hash is saved in the cell data of the global registry cell and all the origin registry information is saved in the transaction witnesses, everyone can collect origin registry information from the ckb node rpc.

The [cota-registry-aggregator](https://github.com/nervina-labs/cota-registry-aggregator) collects all the origin registry information from the off-chain database and generates SMT entries(root/proof/origin leaves to be verified) for registrants through [RPC APIs](https://github.com/nervina-labs/cota-registry-aggregator#apis).

- [GitHub](https://github.com/nervina-labs/cota-registry-aggregator)
- [RPC APIs](https://github.com/nervina-labs/cota-registry-aggregator#apis)

## CoTA Aggregator

Everyone has only one cota cell to mint or transfer NFTs, and all the NFT information(not all origin information) will be stored in the someone's cota merkel tree, and the latest cota merkel tree root hash is stored in his/her cota cell data.

When someone want to mint or transfer NFT, the merkel tree leaves will be updated and the latest root hash will be set in the cota cell data. For the cota smart contract, the important thing is to verify the merkel proof of mint and transfer transactions.

The origin cota information is saved in transaction witnesses and everyone can collect the information from the ckb node.

The [cota-aggregator](https://github.com/nervina-labs/cota-aggregator) collects all the origin cota information from the off-chain database synced from ckb node and generates SMT entries(root/proof/origin leaves to be verified) for registrants through [RPC APIs](https://github.com/nervina-labs/cota-aggregator#apis).

- [GitHub](https://github.com/nervina-labs/cota-aggregator)
- [RPC APIs](https://github.com/nervina-labs/cota-aggregator#apis)

## Public Aggregator RPC URLs

The testnet aggregator RPC urls are provided as below and everyone can call the RPC APIs to build ckb transaction to register cota cells and mint or transfer NFTs to others.

```
# cota registry aggregator rpc
https://cota.nervina.dev/registry-aggregator

# cota aggregator rpc
https://cota.nervina.dev/aggregator
```

## Deployment

If you want to deploy the aggregators by youself, the [quick-deployment docs](./quick-deploy.md) may be can help you.

## How to Use

[cota-sdk](https://github.com/nervina-labs/cota-sdk-js) is helpful to call aggregator RPC and it also can help to build ckb transactions to register cota cells and mint/transfer NFTs.

We recommend you to use sdk to regsiter cota cells and mint/transfer NFTs and it can help you build your Dapp as soon as possible.
