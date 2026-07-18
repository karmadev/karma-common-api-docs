import{t as e}from"./jsx-runtime-BcqRK4R-.js";import{n as t}from"./lib-C2cyKK4t.js";var n=e(),r=`This guide explains how to interpret the purchase and line-item data returned by
GET /api/v1/purchases, so an accounting, inventory, or
BI integration reads the numbers the same way Karma does. It complements the field
descriptions on the endpoint itself.`,i=[{depth:2,text:`The shape`,id:`the-shape`},{depth:2,text:`Which purchases are sales?`,id:`which-purchases-are-sales`},{depth:2,text:`Which line items are products?`,id:`which-line-items-are-products`},{depth:2,text:`Prices, quantity, and VAT`,id:`prices-quantity-and-vat`},{depth:2,text:`Modifiers and bundles`,id:`modifiers-and-bundles`},{depth:2,text:`Matching a sale line to your own product catalogue`,id:`matching-a-sale-line-to-your-own-product-catalogue`},{depth:2,text:`Refunds`,id:`refunds`},{depth:2,text:`Timing: when is a sale final?`,id:`timing-when-is-a-sale-final`}],a={title:`Sales Data Model & Semantics`,description:`How to read purchases and line items correctly — which rows are sales, which cents field is authoritative, VAT, discounts, modifiers, refunds, and matching lines to your own catalogue.`,lastModifiedTime:`2026-07-16T08:00:27.000Z`},o=`pages/examples/sales-data-model.mdx`;function s(e){let r={a:`a`,blockquote:`blockquote`,code:`code`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,span:`span`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...t(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(r.p,{children:[`This guide explains how to interpret the purchase and line-item data returned by
`,(0,n.jsx)(r.a,{href:`/api/latest#tag/Purchases`,children:(0,n.jsx)(r.code,{inline:`true`,children:`GET /api/v1/purchases`})}),`, so an accounting, inventory, or
BI integration reads the numbers the same way Karma does. It complements the field
descriptions on the endpoint itself.`]}),`
`,(0,n.jsx)(r.h2,{id:`the-shape`,children:`The shape`}),`
`,(0,n.jsxs)(r.p,{children:[`A `,(0,n.jsx)(r.strong,{children:`purchase`}),` is one payment. It has a `,(0,n.jsx)(r.code,{inline:`true`,children:`status`}),`, an `,(0,n.jsx)(r.code,{inline:`true`,children:`amount`}),` (total, in cents), a
`,(0,n.jsx)(r.code,{inline:`true`,children:`currency`}),`, timestamps, and a list of `,(0,n.jsx)(r.strong,{children:`line items`}),`. Each line item is one thing on the
receipt — a product, a tip, or an amount paid toward a split bill.`]}),`
`,(0,n.jsxs)(r.p,{children:[`All money is in `,(0,n.jsx)(r.strong,{children:`integer minor units`}),` (öre/cents), and all prices are `,(0,n.jsx)(r.strong,{children:`VAT-inclusive`}),`.`]}),`
`,(0,n.jsx)(r.h2,{id:`which-purchases-are-sales`,children:`Which purchases are sales?`}),`
`,(0,n.jsx)(r.p,{children:`Treat a purchase as a finalized sale only when:`}),`
`,(0,n.jsx)(n.Fragment,{children:(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:`language-text shiki shiki-themes github-light github-dark`,inline:`false`,style:{"--shiki-light":`#24292e`,"--shiki-dark":`#e1e4e8`,"--shiki-light-bg":`#fff`,"--shiki-dark-bg":`#24292e`},tabIndex:`0`,children:(0,n.jsx)(r.span,{className:`line`,children:(0,n.jsx)(r.span,{children:`status === "confirmed"`})})})})}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{inline:`true`,children:`pending`}),` is in-flight, and `,(0,n.jsx)(r.code,{inline:`true`,children:`canceled`}),` / `,(0,n.jsx)(r.code,{inline:`true`,children:`failed`}),` never took payment. Filter server-side
with the `,(0,n.jsx)(r.code,{inline:`true`,children:`status`}),` query parameter.`]}),`
`,(0,n.jsx)(r.h2,{id:`which-line-items-are-products`,children:`Which line items are products?`}),`
`,(0,n.jsxs)(r.p,{children:[`Line items have a `,(0,n.jsx)(r.code,{inline:`true`,children:`type`}),`:`]}),`
`,(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.th,{children:(0,n.jsx)(r.code,{inline:`true`,children:`type`})}),(0,n.jsx)(r.th,{children:`Meaning`}),(0,n.jsx)(r.th,{children:`Include in a product-sales export?`})]})}),(0,n.jsxs)(r.tbody,{children:[(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`product`})}),(0,n.jsx)(r.td,{children:`A sellable catalogue item`}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.strong,{children:`Yes`})})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`tip`})}),(0,n.jsx)(r.td,{children:`A gratuity line`}),(0,n.jsx)(r.td,{children:`No`})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`amount`})}),(0,n.jsx)(r.td,{children:`An abstract amount paid toward a split/partial bill`}),(0,n.jsx)(r.td,{children:`No`})]})]})]}),`
`,(0,n.jsxs)(r.p,{children:[`Discounts are `,(0,n.jsx)(r.strong,{children:`not`}),` separate line items — they are a field on the product line (see
below).`]}),`
`,(0,n.jsx)(r.h2,{id:`prices-quantity-and-vat`,children:`Prices, quantity, and VAT`}),`
`,(0,n.jsx)(r.p,{children:`Read these fields per line item:`}),`
`,(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.th,{children:`Field`}),(0,n.jsx)(r.th,{children:`What it is`})]})}),(0,n.jsxs)(r.tbody,{children:[(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`finalAmountCents`})}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.strong,{children:`Authoritative per-unit price`}),`, VAT-inclusive, `,(0,n.jsx)(r.strong,{children:`after`}),` discount.`]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`totalAmountCents`})}),(0,n.jsxs)(r.td,{children:[`Line total = `,(0,n.jsx)(r.code,{inline:`true`,children:`finalAmountCents × quantity`}),`. `,(0,n.jsx)(r.strong,{children:`May be null/0 on some legacy purchases`}),` — if you need a guaranteed line total, compute `,(0,n.jsx)(r.code,{inline:`true`,children:`finalAmountCents × quantity`}),` yourself.`]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`appliedTotalDiscountAmountCents`})}),(0,n.jsxs)(r.td,{children:[`Discount on this line, a positive number, `,(0,n.jsx)(r.strong,{children:`already subtracted`}),` from the amounts above. Gross before discount = `,(0,n.jsx)(r.code,{inline:`true`,children:`totalAmountCents + appliedTotalDiscountAmountCents`}),`.`]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`quantity`})}),(0,n.jsx)(r.td,{children:`Whole-unit count.`})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`quantityCents`})}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{inline:`true`,children:`quantity × 100`}),` — divide by 100 for fractional/weight-based items.`]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`vatRateBasisPoints`})}),(0,n.jsxs)(r.td,{children:[`VAT rate in basis points; `,(0,n.jsx)(r.code,{inline:`true`,children:`÷ 100`}),` for the percentage (`,(0,n.jsx)(r.code,{inline:`true`,children:`1200`}),` → 12%, `,(0,n.jsx)(r.code,{inline:`true`,children:`2500`}),` → 25%).`]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`vatAmountCents`})}),(0,n.jsxs)(r.td,{children:[`VAT `,(0,n.jsx)(r.strong,{children:`per unit`}),` (already contained in `,(0,n.jsx)(r.code,{inline:`true`,children:`finalAmountCents`}),`).`]})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{inline:`true`,children:`totalVatAmountCents`})}),(0,n.jsxs)(r.td,{children:[`VAT for the whole line = `,(0,n.jsx)(r.code,{inline:`true`,children:`vatAmountCents × quantity`}),`.`]})]})]})]}),`
`,(0,n.jsxs)(r.blockquote,{children:[`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsxs)(r.strong,{children:[`Don't rely on `,(0,n.jsx)(r.code,{inline:`true`,children:`pre_discount_value_cents`}),` or `,(0,n.jsx)(r.code,{inline:`true`,children:`total_with_modifications_cents`}),`.`]}),` The
former no longer exists; the latter is rarely populated. `,(0,n.jsx)(r.code,{inline:`true`,children:`finalAmountCents`}),` +
`,(0,n.jsx)(r.code,{inline:`true`,children:`appliedTotalDiscountAmountCents`}),` are the fields to build on.`]}),`
`]}),`
`,(0,n.jsx)(r.h2,{id:`modifiers-and-bundles`,children:`Modifiers and bundles`}),`
`,(0,n.jsx)(r.p,{children:`Modifiers show up two ways:`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`Inline`}),`, in `,(0,n.jsx)(r.code,{inline:`true`,children:`appliedModifications`}),` — an array like
`,(0,n.jsx)(r.code,{inline:`true`,children:`[{ title, priceAdjustmentCents, variantRef? }]`}),`. Discounts and vouchers appear here as
negative `,(0,n.jsx)(r.code,{inline:`true`,children:`priceAdjustmentCents`}),`. These entries `,(0,n.jsx)(r.strong,{children:`do not`}),` carry an article number.`]}),`
`,(0,n.jsxs)(r.li,{children:[(0,n.jsx)(r.strong,{children:`As child line items`}),`, when a variant/add-on maps to its own catalogue item. The child
row points at its parent via `,(0,n.jsx)(r.code,{inline:`true`,children:`parentLineItemId`}),`.`]}),`
`]}),`
`,(0,n.jsxs)(r.blockquote,{children:[`
`,(0,n.jsxs)(r.p,{children:[`⚠️ `,(0,n.jsx)(r.strong,{children:`Avoid double-counting.`}),` Because add-ons can appear as separate child lines, summing
every line's total can over- or under-count a bundle depending on how the product is
modelled. Reconcile your per-purchase line sum against the purchase `,(0,n.jsx)(r.code,{inline:`true`,children:`amount`}),` as a check.`]}),`
`]}),`
`,(0,n.jsx)(r.h2,{id:`matching-a-sale-line-to-your-own-product-catalogue`,children:`Matching a sale line to your own product catalogue`}),`
`,(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{inline:`true`,children:`articleNo`}),` is a `,(0,n.jsx)(r.strong,{children:`Karma-internal reference used for fiscal cash-register registration`}),` —
despite the name it is `,(0,n.jsx)(r.strong,{children:`not`}),` your SKU/PLU/article number, and it will not match your
catalogue.`]}),`
`,(0,n.jsxs)(r.p,{children:[`To link a sale line to your own product, use `,(0,n.jsx)(r.strong,{children:(0,n.jsx)(r.code,{inline:`true`,children:`originItemId`})}),` — the catalogue item the
line was sold from. Join `,(0,n.jsx)(r.code,{inline:`true`,children:`originItemId`}),` to the item, where your own external article number
lives (populated from your inventory/POS setup). That join, not `,(0,n.jsx)(r.code,{inline:`true`,children:`articleNo`}),`, is the stable
key to your catalogue.`]}),`
`,(0,n.jsx)(r.h2,{id:`refunds`,children:`Refunds`}),`
`,(0,n.jsxs)(r.p,{children:[`Refunds are represented against the purchase. Refund amounts are stored as `,(0,n.jsx)(r.strong,{children:`positive`}),`
values (the magnitude refunded) — negate them for a ledger. A refund is valid once it is
`,(0,n.jsx)(r.code,{inline:`true`,children:`confirmed`}),`.`]}),`
`,(0,n.jsx)(r.h2,{id:`timing-when-is-a-sale-final`,children:`Timing: when is a sale final?`}),`
`,(0,n.jsx)(r.p,{children:`There is no single "finalized at" flag. In practice:`}),`
`,(0,n.jsxs)(r.ul,{children:[`
`,(0,n.jsxs)(r.li,{children:[`A purchase's payment is final at `,(0,n.jsx)(r.code,{inline:`true`,children:`status === "confirmed"`}),`.`]}),`
`,(0,n.jsxs)(r.li,{children:[`Fee and settlement data can be written `,(0,n.jsx)(r.strong,{children:`asynchronously after capture`}),` (minutes to a
couple of hours later), so if you need fees, don't treat a just-confirmed purchase as
complete for fee purposes.`]}),`
`,(0,n.jsx)(r.li,{children:`Late corrections and refunds can arrive afterward.`}),`
`]}),`
`,(0,n.jsx)(r.p,{children:`A safe pattern is to only export purchases that have been settled for a few hours, and to
re-poll on the update timestamp to catch late changes.`})]})}function c(e={}){let{wrapper:r}={...t(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(s,{...e})}):s(e)}export{o as __filepath,c as default,r as excerpt,a as frontmatter,i as tableOfContents};
//# sourceMappingURL=sales-data-model-3_AwtwEB.js.map