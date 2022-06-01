module.exports = {
  docs: [
    {
      type: "category",
      label: "秘宝",
      items: ["about/what-is-new", "about/overview", "about/concepts", "usage/manual", "about/solution", "about/claim"],
    },

    {
      type: "category",
      label: "OpenAPI",
      items: [
        "develop/openapi/concepts",
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
};
