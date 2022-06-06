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
      items: ["cota/overview", "cota/aggregator", "cota/quick-deploy", "cota/error-code"],
    },
    {
      type: "category",
      label: "Blog",
      items: [
        "blog/cota",
        {
          type: "category",
          label: "CoTA 开发指南",
          items: ["blog/getting-start/getting-started", "blog/getting-start/cota-nft-life", "blog/getting-start/qa"],
        },
      ],
    },
  ],
};
