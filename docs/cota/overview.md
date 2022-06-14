---
title: Overview
label: CoTA
---

## CoTA RFC

[[RFC] CoTA: A Compact Token Aggregator Standard for Extremely Low Cost NFTs and FTs](https://talk.nervos.org/t/rfc-cota-a-compact-token-aggregator-standard-for-extremely-low-cost-nfts-and-fts/6338)

## CoTA Protocol

CoTA protocol uses [SMT](https://github.com/nervosnetwork/sparse-merkle-tree) to manage users' NFT assets, and all the NFT information of someone will be folded into SMT and the SMT root hash will be saved into blockchain to reduce the on-chain data size and everyone should be registered to get only one CoTA cell firstly.

The transfer contains two steps: sender withdrawal and receiver claim. Withdrawal means sender losing the ownership of an NFT and the hold leaf will be removed from his/her SMT. Claim means the receiver getting the ownership of an NFT and the hold leaf will be added to his/her SMT.

The CoTA SMT includes four kinds of leaves: define, hold, withdraw and claim.

- The define leaf provides a template to define the NFT collection information, including total, name, description and image url, etc. Minting NFTs will be possible after defining and the minted NFTs will be share the same collection information and they are distinguished by different token indexes.
- The hold leaf means owning an NFT and you can update the NFT information or transfer the NFT to others. When an NFT is transferred to others, the hold leaf of the NFT will be removed.
- The withdraw leaf means losing the ownership of an NFT and the withdraw leaf value contains the current real owner of the NFT and the withdraw leaf will not be removed once created.
- The claim leaf means once owning an NFT and the claim leaf will not be removed once created. When an NFT has been withdrew from someone, the hold leaves will contain the NFT after claiming.

When we say you own an NFT, it means either your hold leaves contain the NFT, or a sender's withdrawal leaf has your address as the destination address and you have not claimed the NFT to your SMT.

As an issuer, Alice can define an NFT collection and then mint NFTs to others. As a receiver, Bob can get the NFTs from Alice and claim the NFTs to his own SMT and withdraw to Tom after claiming. Now Tom owns the NFTs from Bob, but his SMT doesn't have the NFTs before claiming.

## Quick Start

You can use [cota-sdk](./sdk.md) to register, define, mint, claim, withdraw and transfer and examples have been provided in SDK.

### Register to Create CoTA Cell

You know, everyone must register only one cota cell before starting cota-related operations. You can register cota cell with the [registry example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/registry.ts). When the registry transaction is in the blockchain, your lock hash will be a leaf of the global registry SMT and you will have a cota cell with your own lock script that means just only you can spend the cota cell to complete minting or transferring operations.

```
ckb address <==> lock script ==> lock hash
```

The ckb address, lock script and lock hash all can be as account address for someone who owns the private key and using lock hash as leaf node of the global registry SMT is to reduce complexity.

### To be an Issuer

If you are an issuer who want to mint NFTs to others, you can create issuer information to the blockchain with the [issuer example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/issuer.ts). You can type issuer information with [IssuerInfo](https://github.com/nervina-labs/cota-sdk-js/blob/develop/src/types/service.ts#L14) data type who defines the issuer detail fields. The issuer information will be saved into Witnesses of the ckb transaction in the blockchain to reduce capacity usage and can be read from the blockchain by anyone.

```TypeScript
interface IssuerInfo {
  name: string
  description?: string
  avatar?: string
}
```

### Define an NFT Collection

As an issuer, you can define an NFT collection with the [define example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/define.ts) and you can type the NFT collection information with [CotaInfo](https://github.com/nervina-labs/cota-sdk-js/blob/develop/src/types/service.ts#L20) data type who defines the collection detail fields. You will get the unique `cota_id` from the define transaction and all the NFTs of the collection will share the same collection information and the `cota_id`.

```TypeScript
interface CotaInfo {
  name: string
  image: string
  description?: string
  audio?: string
  video?: string
  model?: string
  characteristic?: [string, number][]
  properties?: string
}
```

### Mint NFTs

After defining an NFT collection, you can mint NFTs to others with the [mint example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/mint.ts). All the minted NFTs will share the same collection information and `cota_id`, type are distinguished by different token indexes. And you can also set different values of NFT fields(state and characteristic) to implement different properties for every NFT.

### Claim NFTs

If you have NFTs minted by an issuer, you can claim NFTs with the [claim example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/claim.ts). Claiming means adding the NFTs to your own SMT and you can update the NFTs information or withdraw to others after claiming.

### Update NFTs information

You can update the NFTs information(state and characteristic) with the [update example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/update.ts) after claiming.

### Claim and Update NFTs

You can claim NFTs and update the NFTs information(state and characteristic) in one operation with the [claim-update example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/claim-update.ts).

### Withdraw NFTs

You can withdraw NFTs to others with the [withdraw example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/withdraw.ts). Withdrawal means losing the ownership of the NFTs and the receiver can claim the NFTs at any time.

### Transfer NFTs

If you want to withdraw the NFTs to others before claiming, you can implement the operation with [transfer example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/transfer.ts). The transfer melts the claim and withdrawal into one operation to make the transfer more simple.

### Transfer and Update NFTs

You can claim NFTs, update the NFTs information(state and characteristic) and withdraw the NFTs to others in one operation with the [transfer-update example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/transfer-update.ts).
