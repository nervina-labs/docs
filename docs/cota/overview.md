---
title: Overview
label: CoTA
---

## CoTA Protocol

[[RFC] CoTA: A Compact Token Aggregator Standard for Extremely Low Cost NFTs and FTs](https://talk.nervos.org/t/rfc-cota-a-compact-token-aggregator-standard-for-extremely-low-cost-nfts-and-fts/6338)

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
- **Transfer:** To simplify, transfer combines the claim and withdraw into one operation. The receiver can claim the NFT from the mint and withdraw the same NFT to others in a transaction.
