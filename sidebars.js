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
        {
          type: 'category',
          label: 'OpenAPI',
          items: [
            "develop/openapi/prepare",
            "develop/openapi/signature",
            {
              type: 'category',
              label: '最佳实践',
              items: [
                "develop/openapi/best-practice/token-class",
                "develop/openapi/best-practice/token",
                "develop/openapi/best-practice/holder",
                "develop/openapi/best-practice/transaction",
                "develop/openapi/best-practice/multi-issuers",
              ]
            },
          ]
        },
        {
          type: 'category',
          label: 'CoTA',
          items: [
            "develop/cota/index",
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
