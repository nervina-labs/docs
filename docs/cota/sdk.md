---
title: SDK
label: CoTA
---

# cota-sdk

Now we provide [cota-sdk-js](https://github.com/nervina-labs/cota-sdk-js) for developers to register cota cells and mint/transfer NFTs as soon as possible and we also provide all kinds of [examples](https://github.com/nervina-labs/cota-sdk-js/tree/develop/example) to quick start.

## Installation

```bash
$ npm i @nervina-labs/cota-sdk
# or
$ yarn add @nervina-labs/cota-sdk
```

## Prerequisites

CoTA SDK needs to run the services as blow:

- [CKB Node](https://docs.nervos.org/docs/basics/guides/testnet): Nervos CKB Node
- [CKB Indexer](https://github.com/nervosnetwork/ckb-indexer): Fetch live cells and transactions with filters
- [CoTA Syncer](https://github.com/nervina-labs/cota-nft-entries-syncer): Parse CoTA witness SMT data from CKB blockchain history transactions and save it to the mysql database
- [CoTA Registry Aggregator](https://github.com/nervina-labs/cota-registry-aggregator): Generate SMT info using the data from the database for registry and provide RPC APIs
- [CoTA Aggregator](https://github.com/nervina-labs/cota-aggregator): Generate SMT info using the data from the database for CoTA NFT actions and provide RPC APIs

> The above services are valid only when synced to the latest block and we strongly suggest to run the services in mainnet by yourself.

### Public ckb node url and ckb indexer url as blow can be used to develop and test

```
mainnet:
https://mainnet.ckbapp.dev/rpc       --->  ckb mainnet node rpc
https://mainnet.ckbapp.dev/indexer   --->  ckb mainnet indexer rpc

testnet:
https://testnet.ckbapp.dev/rpc       --->  ckb testnet node rpc
https://testnet.ckbapp.dev/indexer   --->  ckb testnet indexer rpc
```

### Public aggregator rpc url as blow can be used to develop and test

```
testnet:
https://cota.nervina.dev/aggregator           --->  cota aggregator rpc
https://cota.nervina.dev/registry-aggregator  --->  cota registry aggregator rpc
```

## Examples

- [aggregator example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/aggregator.ts): Fetch CoTA NFT data(include issuer/NFT class info) from Aggregator server
- [registry example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/registry.ts): Generate registering CoTA cells transaction
- [issuer example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/issuer.ts): Generate setting issuer information transaction
- [define example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/define.ts): Generate setting cota information and defining CoTA cells transaction
- [mint example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/mint.ts): Generate minting CoTA NFT transaction
- [claim example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/claim.ts): Generate claiming CoTA NFT transaction
- [withdraw example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/withdraw.ts): Generate withdrawing CoTA NFT transaction
- [transfer example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/transfer.ts): Generate transferring CoTA NFT transaction
- [update example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/update.ts): Generate updating CoTA NFT information transaction
- [claim&update example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/claim-update.ts): Generate claiming and updateing CoTA NFT transaction
- [transfer&update example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/transfer-update.ts): Generate transferring and updating CoTA NFT transaction
