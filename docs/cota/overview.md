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

As an issuer, Alice can define an NFT collection and then mint NFTs to others. As a receiver, Bob can get the NFTs from Alice and claim the NFTs to his own SMT and withdraw to others after claiming.

## CoTA NFT Flow

```
                        Register CoTA cells firstly
1. Alice & Bob & Tom ----------------------------------> Alice CoTA cell & Bob CoTA cell & Tom CoTA cell

            Define CoTA NFT                             Mint CoTA NFT A1 to receivers
2. Alice -----------------------> NFT collection A -----------------------------------> Receivers (Bob)

                    Claim NFT A1                                  Withdraw NFT A1 to Tom
       Action1 |-------------------------> Bob hold NFT A1 now ----------------------------------> Bob doesn't hold NFT A1 now
      |
      |             Transfer NFT A1 to Tom
3. Bob Action2 |-----------------------------------> Bob doesn't hold NFT A1 now
      |
      |         Claim and Update NFT A1 information
       Action3 |-----------------------------------> Bob hold CoTA NFT A1 with new information

                    Claim NFT A1                                 Withdraw NFT A1 to other receivers
        Action1 |-------------------------> Tom hold NFT A1 now ----------------------------------> Tom doesn't hold NFT A1 now
       |
4. Tom |
       |          Transfer NFT A1 to other receivers
        Action2 |-----------------------------------> Tom doesn't hold NFT A1 now

```

- **Registry:** Every address should be registered firstly
- **Define:** The issuer can define a collection NFTs with total/name/description/image etc.
- **Mint:** The issuer mint the defined NFTs to the receivers (withdraw to the receivers actually)
- **Claim:** The receiver can claim the NFT from the mint, and now the receiver hold the NFT
- **Update:** The holder of the NFT(the NFT must be claimed) can update the information (characteristic/state etc.)
- **Withdraw:** The holder of the NFT can withdraw the NFT to any other CKB address
- **Transfer:** To simplify, transfer combines the claim and withdrawal into one operation. The receiver can claim the NFT from the mint and withdraw the same NFT to others in a transaction.

## Quick Start

You can use [cota-sdk](./sdk.md) to register, define, mint, claim, withdraw and transfer and examples have been provided in SDK.
