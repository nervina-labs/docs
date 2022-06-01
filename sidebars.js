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
        "openapi/concepts",
        "openapi/prepare",
        "openapi/signature",
        {
          type: "category",
          label: "最佳实践",
          items: [
            "openapi/best-practice/token-class",
            "openapi/best-practice/token",
            "openapi/best-practice/holder",
            "openapi/best-practice/transaction",
            "openapi/best-practice/multi-issuers",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "CoTA",
      items: [
        "cota/overview",
        "cota/intro",
        "cota/design",
        "cota/script-rule",
        "cota/deployment",
        "cota/error-code",
        {
          type: "category",
          label: "Aggregator",
          items: ["cota/aggregator/cota", "cota/aggregator/registry", "cota/aggregator/quick-deploy"],
        },
        {
          type: "category",
          label: "Metadata",
          items: ["cota/metadata/issuer-meta", "cota/metadata/class-meta"],
        },
        {
          type: "category",
          label: "开发指南",
          items: ["cota/gettingstart/getting-started", "cota/gettingstart/cota-nft-life", "cota/gettingstart/qa"],
        },
      ],
    },
  ],
};
