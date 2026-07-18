import type { ZudokuConfig } from "zudoku";

const config: ZudokuConfig = {
  site: {
    title: "Karma Common API",
    logo: {
      src: { light: "/karma-logo-light.svg", dark: "/karma-logo-dark.svg" },
      alt: "Karma",
      width: "110px",
    },
  },

  metadata: {
    title: "Karma Common API Documentation",
    description: "API documentation for the Karma platform",
    favicon: "https://karma.life/favicon.ico",
  },

  // Mirrors karma.life design tokens exactly (oklch values from their CSS,
  // converted to HSL). Light mode is monochrome black/white. Dark mode adds the
  // brand violet (oklch(60% 0.2 280) ≈ #6E69F3 ≈ hsl(242 85% 68%)).
  theme: {
    // Inject a Lucide webhook icon before any operation header / sidebar entry
    // whose slug starts with `webhook-`. The slug comes from the "Webhook: ..."
    // summary prefix applied in zudoku.build.ts. Using mask-image so the icon
    // picks up `currentColor` from the surrounding text (adapts to theme +
    // selected/hover state automatically).
    customCss: `
      h2[id^="webhook-"]::before,
      a[data-anchor^="webhook-"] .truncate::before {
        content: "";
        display: inline-block;
        width: 1em;
        height: 1em;
        margin-right: 0.35em;
        vertical-align: -0.18em;
        background-color: currentColor;
        -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2'/><path d='m6 17 3.13-5.78c.53-.97.43-2.22-.26-3.07A4 4 0 0 1 17 6c.34.4.6.85.78 1.34'/><path d='m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8 4 4 0 0 1-1.93-.5'/></svg>");
        mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2'/><path d='m6 17 3.13-5.78c.53-.97.43-2.22-.26-3.07A4 4 0 0 1 17 6c.34.4.6.85.78 1.34'/><path d='m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8 4 4 0 0 1-1.93-.5'/></svg>");
        -webkit-mask-size: contain;
        mask-size: contain;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-position: center;
        mask-position: center;
      }
    `,
    light: {
      background: "0 0% 100%",
      foreground: "0 0% 4%",
      card: "0 0% 100%",
      cardForeground: "0 0% 4%",
      popover: "0 0% 100%",
      popoverForeground: "0 0% 4%",
      primary: "258 90% 66%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 96%",
      secondaryForeground: "0 0% 9%",
      muted: "0 0% 96%",
      mutedForeground: "0 0% 45%",
      accent: "0 0% 96%",
      accentForeground: "0 0% 9%",
      destructive: "357 100% 45%",
      destructiveForeground: "0 0% 98%",
      border: "0 0% 90%",
      input: "0 0% 90%",
      ring: "258 90% 66%",
      radius: "0.625rem",
    },
    dark: {
      background: "0 0% 7%",
      foreground: "0 0% 96%",
      card: "0 0% 9%",
      cardForeground: "0 0% 96%",
      popover: "0 0% 11%",
      popoverForeground: "0 0% 96%",
      primary: "252 95% 76%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 14%",
      secondaryForeground: "0 0% 96%",
      muted: "0 0% 11%",
      mutedForeground: "0 0% 62%",
      accent: "0 0% 16%",
      accentForeground: "0 0% 96%",
      destructive: "358 75% 62%",
      destructiveForeground: "0 0% 98%",
      border: "0 0% 18%",
      input: "0 0% 14%",
      ring: "252 95% 76%",
      radius: "0.625rem",
    },
  },

  apis: {
    type: "file",
    path: "api",
    input: [
      {
        path: "latest",
        label: "Latest",
        input: "./public/latest/openapi.json",
      },
      {
        path: "v20260131-1317-1",
        label: "v20260131-1317-1",
        input: "./public/versions/v20260131-1317-1/openapi.json",
      },
      {
        path: "v20260131",
        label: "v20260131",
        input: "./public/versions/v20260131/openapi.json",
      },
      {
        path: "v1",
        label: "v1",
        input: "./public/versions/v1/openapi.json",
      },
    ],
  },

  defaults: {
    apis: {
      examplesLanguage: "shell",
      showVersionSelect: "always",
      expandAllTags: false,
      schemaDownload: { enabled: true },
    },
  },

  navigation: [
    {
      type: "category",
      label: "Getting Started",
      items: ["introduction"],
    },
    {
      type: "link",
      to: "/api/latest",
      label: "API Reference",
    },
    {
      type: "category",
      label: "Examples",
      items: [
        "examples/place-an-order",
        "examples/nightly-sales-data",
        "examples/sales-data-model",
        "examples/inventory-sync",
        "examples/item-metadata",
        "examples/location-metadata",
        "examples/push-surplus-from-pos",
        "examples/realtime-webhooks",
      ],
    },
    {
      type: "doc",
      file: "changelog",
      label: "Changelog",
    },
  ],

  docs: {
    files: "/pages/**/*.{md,mdx}",
  },

  redirects: [{ from: "/", to: "/introduction" }],

  search: {
    type: "pagefind",
  },
};

export default config;
