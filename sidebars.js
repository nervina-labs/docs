module.exports = {
  docs: [
    {
      type: 'category',
      label: '介绍',
      items: [
        "about/what-is-new",
        "about/overview",
        "about/concepts",
        // "about/solution"
      ],
    },
    // {
    //   type: 'category',
    //   label: '使用文档',
    //   items: [
    //     "usage/how-to-create",
    //     "usage/how-to-distribute",
    //     "usage/how-to-transfer",
    //     "usage/addresses-collection",
    //     "usage/redeem",
    //     "usage/red-packet",
    //   ],
    // },
    {
      type: 'category',
      label: '开发者文档',
      items: [
        "develop/concepts",
        "develop/prepare",
        "develop/signature",
        {
          type: 'category',
          label: '最佳实践',
          items: [
            "develop/best-practice/token-class",
            "develop/best-practice/token",
            "develop/best-practice/holder",
            "develop/best-practice/transaction",
            "develop/best-practice/multi-issuers",
          ]
        },
      ],
    },
    // {
    //   type: 'category',
    //   label: '深入理解 NFT 合约',
    //   items: [
    //     "contract/cota-nft",
    //     "contract/m-nft",
    //   ],
    // },
    // "faq"

    // {
    //   type: 'category',
    //   label: 'Contract',
    //   items: [
    //     "docs_en/contract/cota-nft",
    //     "docs_en/contract/m-nft",
    //   ],
    // },
    // "docs_en/faq"
  ],
};
