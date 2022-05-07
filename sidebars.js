module.exports = {
  docs: [
    {
      type: "category",
      label: "介绍",
      items: [
        "about/what-is-new",
        "about/overview",
        "about/concepts"
      ],
    },
    {
      type: 'category',
      label: '使用者文档',
      items: [
        "usage/manual",
        "about/solution",
      ],
    },

    {
      type: "category",
      label: "开发者文档",
      items: [
        "develop/concepts",
        {
          type: "category",
          label: "OpenAPI",
          items: [
            "develop/openapi/prepare",
            "develop/openapi/signature",
            {
              type: "category",
              label: "最佳实践",
              items: [
                "develop/openapi/best-practice/token-class",
                "develop/openapi/best-practice/token",
                "develop/openapi/best-practice/holder",
                "develop/openapi/best-practice/transaction",
                "develop/openapi/best-practice/multi-issuers",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "CoTA",
          items: [
            "develop/cota/overview",
            "develop/cota/intro",
            "develop/cota/design",
            "develop/cota/script-rule",
            "develop/cota/deployment",
            "develop/cota/error-code",
            {
              type: "category",
              label: "Aggregator",
              items: ["develop/cota/aggregator/cota", "develop/cota/aggregator/registry", "develop/cota/aggregator/quick-deploy"],
            },
            {
              type: "category",
              label: "Metadata",
              items: ["develop/cota/metadata/issuer-meta", "develop/cota/metadata/class-meta"],
            },
            {
              type: "category",
              label: "开发指南",
              items: ["develop/cota/gettingstart/getting-started", "develop/cota/gettingstart/cota-nft-life", "develop/cota/gettingstart/qa"],
            },
          ],
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
