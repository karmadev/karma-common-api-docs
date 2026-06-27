import{t as e}from"./jsx-runtime-BcqRK4R-.js";import{n as t}from"./lib-C2cyKK4t.js";var n=e(),r=`The Karma Common API is a centralized REST API for the Karma restaurant platform, providing secure access to core resources including inventory, orders, schedules, webhooks, and more.`,i=[{depth:2,text:`Features`,id:`features`},{depth:2,text:`Quick Start`,id:`quick-start`},{depth:2,text:`API Environments`,id:`api-environments`},{depth:2,text:`Authentication`,id:`authentication`},{depth:2,text:`Rate Limiting`,id:`rate-limiting`},{depth:2,text:`Specification Downloads`,id:`specification-downloads`},{depth:2,text:`Support`,id:`support`}],a={title:`Karma Common API`,description:`Public REST API for the Karma restaurant platform`,lastModifiedTime:`2026-06-27T13:26:25.000Z`},o=`pages/introduction.mdx`;function s(e){let r={a:`a`,code:`code`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,span:`span`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...t(),...e.components},{CodeTabPanel:i,CodeTabs:a}=r;return i||l(`CodeTabPanel`,!0),a||l(`CodeTabs`,!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.p,{children:`The Karma Common API is a centralized REST API for the Karma restaurant platform, providing secure access to core resources including inventory, orders, schedules, webhooks, and more.`}),`
`,(0,n.jsx)(r.h2,{id:`features`,children:`Features`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`API Key Authentication`}),` — Simple, long-lived access with bcrypt-hashed keys`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Comprehensive Access Control`}),` — Fine-grained permissions for all resources`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Rate Limiting`}),` — Automatic rate limiting based on your API key tier`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Webhook Support`}),` — Real-time event notifications via webhooks`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Standard REST`}),` — Works with any HTTP client: `,(0,n.jsx)(r.code,{inline:`true`,children:`fetch`}),`, `,(0,n.jsx)(r.code,{inline:`true`,children:`curl`}),`, Postman, or your language of choice`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`TypeScript SDK`}),` — Official SDK for common integration tasks`]}),`
`]}),`
`,(0,n.jsx)(r.h2,{id:`quick-start`,children:`Quick Start`}),`
`,(0,n.jsx)(r.p,{children:`Install the SDK (optional) or call the API directly:`}),`
`,(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-bash shiki shiki-themes github-light github-dark`,inline:`false`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,children:(0,n.jsxs)(r.span,{className:`line`,children:[(0,n.jsx)(r.span,{style:{"--shiki-light":`#6F42C1`,"--shiki-dark":`#B392F0`},children:`npm`}),(0,n.jsx)(r.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` install`}),(0,n.jsx)(r.span,{style:{"--shiki-light":`#032F62`,"--shiki-dark":`#9ECBFF`},children:` @karmalicious/karma-api-js`})]})})})}),`
`,(0,n.jsxs)(a,{children:[(0,n.jsx)(i,{language:`typescript`,meta:`SDK`,code:`import { createKarmaClient } from "@karmalicious/karma-api-js";

const client = createKarmaClient({
  apiKey: "karma_live_your_api_key_here",
  locationId: 1234,
});

// Push surplus from your POS
await client.surplus.add({
  item: { externalId: "sku-pasta", title: "Pasta Bolognese", basePriceCents: 12900 },
  quantity: 5,
  discountPercentage: 50,
  date: "2024-12-20",
});`}),(0,n.jsx)(i,{language:`bash`,meta:`curl`,code:`curl "https://common-api.karma.life/api/v1/inventory?locationId=100&limit=50" \\
  -H "X-API-Key: karma_live_your_api_key_here"`}),(0,n.jsx)(i,{language:`typescript`,meta:`fetch`,code:`const response = await fetch(
  "https://common-api.karma.life/api/v1/inventory?locationId=100&limit=50",
  { headers: { "X-API-Key": "karma_live_your_api_key_here" } }
);
const { data } = await response.json();`})]}),`
`,(0,n.jsxs)(r.p,{children:[`SDK on npm: `,(0,n.jsx)(r.a,{href:`https://www.npmjs.com/package/@karmalicious/karma-api-js`,children:`@karmalicious/karma-api-js`}),`.`]}),`
`,(0,n.jsx)(r.h2,{id:`api-environments`,children:`API Environments`}),`
`,(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.th,{children:`Environment`}),(0,n.jsx)(r.th,{children:`Base URL`})]})}),(0,n.jsxs)(r.tbody,{children:[(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:`Production`}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`https://common-api.karma.life`})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:`Beta`}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`https://common-api.beta.karma.life`})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:`Development`}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`https://common-api.development.karma.life`})})]})]})]}),`
`,(0,n.jsx)(r.h2,{id:`authentication`,children:`Authentication`}),`
`,(0,n.jsxs)(r.p,{children:[`All endpoints require an API key in the `,(0,n.jsx)(r.code,{inline:`true`,children:`X-API-Key`}),` header:`]}),`
`,(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text shiki shiki-themes github-light github-dark`,inline:`false`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,children:(0,n.jsx)(r.span,{className:`line`,children:(0,n.jsx)(r.span,{children:`X-API-Key: karma_live_your_api_key_here`})})})})}),`
`,(0,n.jsx)(r.p,{children:`API keys can be managed through the Karma Merchant Dashboard.`}),`
`,(0,n.jsx)(r.h2,{id:`rate-limiting`,children:`Rate Limiting`}),`
`,(0,n.jsx)(r.p,{children:`Rate limits are applied per API key based on your subscription tier:`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Standard`}),` — 1,000 requests/hour`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Premium`}),` — 10,000 requests/hour`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Unlimited`}),` — 100,000 requests/hour`]}),`
`]}),`
`,(0,n.jsx)(r.p,{children:`Rate limit headers are included in all responses:`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{inline:`true`,children:`X-RateLimit-Limit`}),` — Total requests allowed`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{inline:`true`,children:`X-RateLimit-Remaining`}),` — Requests remaining`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.code,{inline:`true`,children:`X-RateLimit-Reset`}),` — Unix timestamp when limit resets`]}),`
`]}),`
`,(0,n.jsx)(r.h2,{id:`specification-downloads`,children:`Specification Downloads`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[`JSON — `,(0,n.jsx)(r.a,{href:`/latest/openapi.json`,children:(0,n.jsx)(r.code,{inline:`true`,children:`/latest/openapi.json`})})]}),`
`,(0,n.jsxs)(r.li,{children:[`YAML — `,(0,n.jsx)(r.a,{href:`/latest/openapi.yaml`,children:(0,n.jsx)(r.code,{inline:`true`,children:`/latest/openapi.yaml`})})]}),`
`,(0,n.jsxs)(r.li,{children:[`All versions — `,(0,n.jsx)(r.a,{href:`/versions/manifest.json`,children:(0,n.jsx)(r.code,{inline:`true`,children:`/versions/manifest.json`})})]}),`
`]}),`
`,(0,n.jsx)(r.h2,{id:`support`,children:`Support`}),`
`,(0,n.jsxs)(r.p,{children:[`For API support, contact `,(0,n.jsx)(r.a,{href:`mailto:hello@karma.life`,children:`hello@karma.life`}),`.`]})]})}function c(e={}){let{wrapper:r}={...t(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(s,{...e})}):s(e)}function l(e,t){throw Error(`Expected `+(t?`component`:`object`)+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}export{o as __filepath,c as default,r as excerpt,a as frontmatter,i as tableOfContents};
//# sourceMappingURL=introduction-C134KHAf.js.map