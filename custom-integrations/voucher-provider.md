[← Back to API docs](/)

# Custom Voucher Provider — Wire Contract

If your restaurant manages voucher codes in your own system, Karma can forward voucher operations to your URLs instead of Karma's native voucher store. This document is everything a backend engineer needs to implement the three HTTP endpoints Karma will call.

## Overview

When a location is configured with the `custom` voucher provider, Karma stops validating voucher codes against its own database and instead calls three HTTPS endpoints that you host. Every voucher operation a guest triggers at checkout becomes an outbound request from Karma to your service.

**When this is used.** A Karma operator enables the `custom` voucher provider on a specific restaurant location. The restaurant (or the customer's IT vendor) owns the voucher database, and Karma becomes the point-of-sale client that asks your system whether a code is valid and then tells you when to consume it.

**What Karma does.** When a guest enters a voucher code at checkout:

1. Karma calls your `checkUrl` to validate the code and reserve its value against the current cart.
2. If the guest pays, Karma calls your `commitUrl` to tell you the voucher has been consumed.
3. If the guest cancels or the payment fails, Karma calls your `reactivateUrl` to release the reservation so the code can be used again.

**What you implement.** Three HTTPS endpoints of your choosing. The URLs do not need to share a hostname, a path prefix, or a deployment. You give Karma three absolute URLs when the integration is configured.

**What you don't need.** No inbound callbacks to Karma. No HMAC request signing (Karma does not sign outbound requests today). No Karma-specific SDK, library, or client certificate. Plain HTTPS, JSON in, JSON out, optional Basic Auth or custom header auth.

**What you do need.** Idempotency on commit and reactivate — if Karma retries a request with the same `transactionId`, your endpoint must not double-consume the voucher. See "Idempotency & Retries" below.

Karma has multiple voucher provider types; this document covers the `custom` type only.

## Endpoints

You implement three endpoints. Each accepts a JSON request body over HTTPS and returns a JSON response. The URLs are configured per location in Karma and may live on different hosts.

All three endpoints:

- Use HTTP method **POST**.
- Require the header `Content-Type: application/json`.
- Must respond within **5 seconds**. Slower responses will be treated as timeouts and retried.
- Return JSON with a top-level `ok` boolean indicating success or failure.

### POST {checkUrl}

Validate a voucher code against the current cart and reserve its value. Karma calls this when a guest first enters a voucher code at checkout. You look the code up in your system, decide whether it applies to the cart, and return the discount amount.

**Request body:**

```json
{
  "code": "VCH-ABC123",
  "cart": {
    "totalCents": 15000,
    "items": [
      {
        "inventoryItemId": 4711,
        "quantity": 2,
        "priceCents": 6000
      },
      {
        "inventoryItemId": 4712,
        "quantity": 1,
        "priceCents": 3000
      }
    ]
  }
}
```

**Fields:**

- `code` (string, required) — the voucher code the guest entered at checkout. Take this as the user-facing value; your system decides how to match it (exact, canonicalized, case-insensitive, etc.).
- `cart.totalCents` (integer, required) — the sum of `priceCents * quantity` across all items, expressed in cents. See "Why cents?" below.
- `cart.items` (array, required, min 1) — the line items currently in the guest's cart.
- `cart.items[].inventoryItemId` (integer, required) — the ID you would see on a POS export from the restaurant. Treat this as an opaque identifier unless you have explicitly agreed with the restaurant on item-to-ID mapping.
- `cart.items[].quantity` (integer, required, min 1) — how many of this item are in the cart.
- `cart.items[].priceCents` (integer, required) — the per-unit price of this item in cents.

**Success response (HTTP 200):**

```json
{
  "ok": true,
  "voucherNr": "VCH-ABC123",
  "discountAmountCents": 5000,
  "expiresAt": "2026-04-22T10:00:00Z",
  "providerRef": "internal-voucher-9f3c"
}
```

**Fields:**

- `ok` (boolean, required) — must be `true` on success.
- `voucherNr` (string, required) — the voucher identifier in your system. May equal the input `code` or be a canonicalized form (uppercased, whitespace-trimmed, etc.). Karma stores this as the reservation's voucher number.
- `discountAmountCents` (integer, required) — how much Karma should discount the cart, in cents. Karma caps this at `cart.totalCents` internally, so returning a value larger than the cart total is safe — the guest will simply get a full discount on this cart.
- `expiresAt` (ISO 8601 string, optional) — when this reservation expires. If omitted, Karma applies a 2-hour default. Use this if your voucher rules require a tighter window.
- `providerRef` (string, optional) — an opaque string Karma will echo back on commit and reactivate. Use it to correlate the commit request to your internal record (e.g. a row ID, a claim token, an offer instance). Karma never inspects this value.

**Error response (HTTP 200 or 4xx):**

```json
{
  "ok": false,
  "error": {
    "code": "VOUCHER_NOT_FOUND",
    "message": "No voucher matches the supplied code"
  }
}
```

You may return the error body with either HTTP 200 or an appropriate 4xx status code (400, 404, 409, 422) — Karma inspects the JSON body regardless. Karma will **not** retry on 4xx responses; the error is treated as a definitive rejection. See "Error Codes" below for the allowed `code` values.

### POST {commitUrl}

Consume a previously reserved voucher. Karma calls this after the guest has successfully paid. Your endpoint should mark the voucher as used, decrement its remaining balance, or otherwise register the redemption in your system.

**Request body:**

```json
{
  "providerRef": "internal-voucher-9f3c",
  "amountCents": 5000,
  "transactionId": "res_2f8a1d4b9e7c4f3e8b1a6c2d3e4f5a6b"
}
```

**Fields:**

- `providerRef` (string, optional) — the value you returned from the check response (if any). Echoed back so you can look up the original reservation by your own identifier.
- `amountCents` (integer, required) — Karma's reserved amount. Always equals the `discountAmountCents` you returned from check, capped at the cart total. Use this value to confirm the amount you expected matches what Karma applied.
- `transactionId` (string, required) — a Karma-generated reservation identifier. **Your endpoint MUST dedupe by this value.** See "Idempotency & Retries" below.

**Success response (HTTP 200):**

```json
{
  "ok": true
}
```

**Error response:** same `{ ok: false, error: { code, message } }` shape as check. See "Error Codes".

### POST {reactivateUrl}

Release a previously reserved voucher. Karma calls this when the guest cancels payment, closes the checkout flow, or the reservation times out before a commit lands. Your endpoint should undo the reservation — return the voucher to a usable state so the guest (or someone else) can apply it again.

**Request body:** identical shape to commit.

```json
{
  "providerRef": "internal-voucher-9f3c",
  "amountCents": 5000,
  "transactionId": "res_2f8a1d4b9e7c4f3e8b1a6c2d3e4f5a6b"
}
```

**Success response (HTTP 200):**

```json
{
  "ok": true
}
```

**Error response:** same `{ ok: false, error: { code, message } }` shape as check.

**Note on reactivate semantics.** If you have already committed the voucher (Karma's commit succeeded before the guest cancelled), a reactivate request is ambiguous — your system has already recorded a redemption. You may either roll back the redemption (if your business rules allow refunds) or respond with `VOUCHER_ALREADY_COMMITTED`. Karma logs the reactivate failure and proceeds; the guest's payment path is not affected.

---

**All prices are in cents (integer). Never return fractional values.** Karma stores all money as integer cents to avoid floating-point rounding errors. If your internal system uses major-unit currency values, convert on the boundary: multiply by 100 on the way in, divide by 100 for display only. Never emit a fractional `discountAmountCents` or `amountCents` — Karma will reject the response.

## Error Codes

When your endpoint needs to reject a request, return an error body with a `code` field chosen from this fixed set. Karma forwards the chosen `code` directly to the guest-facing checkout UI, so pick the most specific one that applies.

| Code | When to return |
|------|----------------|
| VOUCHER_NOT_FOUND | No voucher in your system matches the submitted `code` |
| VOUCHER_EXPIRED | The voucher exists but has already passed its validity date |
| VOUCHER_ALREADY_COMMITTED | The voucher was already consumed (either by a previous commit or outside Karma) |
| VOUCHER_INSUFFICIENT_VALUE | The voucher's value is too low for the cart total (if your program has a minimum) |
| VOUCHER_NOT_ACTIVE | The voucher is disabled, not yet active, or has been revoked |
| INVALID_REQUEST | The request body failed your validation (missing `code`, bad cart shape, etc.) |
| PROVIDER_ERROR | Anything else — internal error, database unreachable, unexpected condition |

Karma surfaces these codes directly to the guest-facing checkout UI — choose the most specific code that applies. `PROVIDER_ERROR` should be your last resort: it signals to Karma that something went wrong on your side and the guest is told to try again later. The other six codes let the guest take a specific action (enter a different code, give up, contact support).

## Authentication & Security

### HTTPS is required

Every URL you give Karma must begin with `https://`. Plain `http://` URLs are rejected by Karma's SSRF guard at configuration time and at each outbound request. No exceptions. If you need to test from a development machine, use a TLS-terminating tunnel such as `ngrok` or Cloudflare Tunnel.

Karma also blocks URLs that resolve to private or loopback addresses (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `::1`, `fe80::/10`). Your endpoints must be reachable from the public internet.

### Supported auth modes

Karma supports three authentication modes. You pick one per integration and Karma applies it to every outbound request.

| Mode | Karma sends | You verify |
|------|-------------|------------|
| None | No `Authorization` header | Use only if your endpoints are already IP-restricted (see below) |
| Basic | `Authorization: Basic base64(username:password)` | Compare the decoded credential to your stored username/password |
| Custom headers | Any named headers you configured in Karma (e.g. `X-Api-Key: <value>`) | Compare each header value to your stored secret |

The auth credentials (password, header values) are stored encrypted at rest in Karma's database and decrypted in memory only when a request is about to be sent. They are never written to logs.

### IP allowlisting (recommended in addition to auth)

Karma's outbound traffic originates from Google Cloud Platform. The exact egress IP ranges rotate over time; if you need a fixed IP for your firewall allowlist, contact Karma support and we can arrange it. For self-serve setups, rely on HTTPS plus Basic Auth or header auth — that combination is sufficient for the vast majority of customers.

### Secrets are never logged

Karma decrypts your configured Basic Auth password and custom header secrets in memory only. They are never written to application logs, error logs, or request traces. If you rotate a secret, update it in Karma's integration config — no Karma redeploy is required.

### No HMAC signing (yet)

Karma does not currently sign outbound requests with a shared secret. Authentication relies on HTTPS plus the Basic Auth or custom header mode you configured. If your compliance requirements call for HMAC-SHA256 request signatures (as in the Standard Webhooks spec), raise it with Karma support — the feature is on the roadmap but not yet available.

## Idempotency & Retries

Your endpoints must be safe to call more than once with the same request body, because Karma will retry on transport failures.

### When Karma retries

Karma automatically retries a request when it encounters:

- **HTTP 5xx responses** (500, 502, 503, 504, etc.) — treated as transient server-side failures.
- **Timeouts** — any request that does not receive a response within **5 seconds**.
- **Network errors** — `ECONNREFUSED`, `ECONNRESET`, `ENOTFOUND`, `ECONNABORTED`, DNS failure.

### When Karma does NOT retry

Karma will **not** retry on 4xx responses. A 4xx means your server definitively rejected the request (bad code, wrong cart, not found, conflict, etc.); retrying would be wasteful and wrong.

### Retry count

Up to **2 retries** per operation (so 3 attempts total, worst case). No exponential backoff between retries — Karma retries immediately. The entire retry window fits within the guest's checkout budget.

### Idempotency contract

Every commit and reactivate request carries a `transactionId` in the body. **Your endpoint MUST dedupe by this value.** If you receive the same `transactionId` twice, treat it as the same operation — do NOT consume the voucher twice.

The recommended implementation is:

1. When a commit arrives, look up `transactionId` in your database.
2. If it's already there with status "committed" → respond `{ "ok": true }` immediately, do nothing else.
3. If it's there with status "released" (a prior reactivate landed first) → respond with an error code that fits your business rules (often `VOUCHER_ALREADY_COMMITTED` if you disallow re-committing, or you can choose to allow it).
4. If it's not there → process the commit, record the `transactionId` with status "committed", respond `{ "ok": true }`.

A unique constraint on `transactionId` in your database is the simplest way to make this race-free.

### What can go wrong without idempotency

Worked example. Karma sends a commit request. Your server processes it successfully and reduces the voucher balance by 50 SEK. Your response packet is lost on the way back (network blip). Karma's 5-second timer fires. Karma retries. Your server has no idea it's a retry — you reduce the balance by another 50 SEK. Net effect: the voucher has been double-consumed.

With proper dedup by `transactionId`, the retry is a no-op. Karma's retry behaviour is safe by construction.

### How Karma generates `transactionId`

Karma generates `transactionId` in the format `res_<32 hex chars>` — the `res_` prefix followed by a UUID-derived 32-character hex string (e.g. `res_2f8a1d4b9e7c4f3e8b1a6c2d3e4f5a6b`). Treat it as opaque; the maximum length is 100 characters. The same `transactionId` is used for both commit and reactivate of a given reservation, so storing it once is sufficient.

## Reference Implementation

A minimal Node.js server implementing all three endpoints, suitable as a starting point. Drop this into a file called `server.js`, install `express`, and run it locally.

```javascript
const express = require('express')
const app = express()

app.use(express.json())

// Very simple Basic Auth middleware. Swap in your own auth as needed.
const EXPECTED_USER = 'demouser'
const EXPECTED_PASS = 'demopass'

function requireBasicAuth(req, res, next) {
  const header = req.get('Authorization') || ''
  if (!header.startsWith('Basic ')) {
    return res.status(401).json({ ok: false, error: { code: 'INVALID_REQUEST', message: 'Missing auth' } })
  }
  const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
  const [user, pass] = decoded.split(':')
  if (user !== EXPECTED_USER || pass !== EXPECTED_PASS) {
    return res.status(401).json({ ok: false, error: { code: 'INVALID_REQUEST', message: 'Bad auth' } })
  }
  next()
}

// In-memory store: transactionId -> 'committed' | 'released'
// In production, back this with a real database and a unique constraint on transactionId.
const transactions = new Map()

app.post('/voucher/check', requireBasicAuth, (req, res) => {
  const { code, cart } = req.body || {}
  if (!code || !cart || typeof cart.totalCents !== 'number') {
    return res.json({ ok: false, error: { code: 'INVALID_REQUEST', message: 'Missing code or cart' } })
  }
  if (code === 'DEMO') {
    return res.json({
      ok: true,
      voucherNr: 'DEMO',
      discountAmountCents: 5000,
      providerRef: 'demo-ref-1',
    })
  }
  return res.json({ ok: false, error: { code: 'VOUCHER_NOT_FOUND', message: 'Unknown code' } })
})

app.post('/voucher/commit', requireBasicAuth, (req, res) => {
  const { transactionId } = req.body || {}
  if (!transactionId) {
    return res.json({ ok: false, error: { code: 'INVALID_REQUEST', message: 'Missing transactionId' } })
  }
  // Idempotency: if we've seen this transactionId before, respond the same way.
  if (transactions.has(transactionId)) {
    return res.json({ ok: true })
  }
  transactions.set(transactionId, 'committed')
  return res.json({ ok: true })
})

app.post('/voucher/reactivate', requireBasicAuth, (req, res) => {
  const { transactionId } = req.body || {}
  if (!transactionId) {
    return res.json({ ok: false, error: { code: 'INVALID_REQUEST', message: 'Missing transactionId' } })
  }
  transactions.set(transactionId, 'released')
  return res.json({ ok: true })
})

app.listen(3000, () => console.log('Voucher provider listening on :3000'))
```

### How to run it

```
npm init -y
npm install express
node server.js
```

### Example curl

Exercise the check endpoint against the running server:

```bash
curl -X POST http://localhost:3000/voucher/check \
  -H 'Content-Type: application/json' \
  -u 'demouser:demopass' \
  -d '{"code":"DEMO","cart":{"totalCents":10000,"items":[{"inventoryItemId":1,"quantity":1,"priceCents":10000}]}}'
```

Expected output:

```json
{"ok":true,"voucherNr":"DEMO","discountAmountCents":5000,"providerRef":"demo-ref-1"}
```

Try again with a different code to see the not-found path:

```bash
curl -X POST http://localhost:3000/voucher/check \
  -H 'Content-Type: application/json' \
  -u 'demouser:demopass' \
  -d '{"code":"NOPE","cart":{"totalCents":10000,"items":[{"inventoryItemId":1,"quantity":1,"priceCents":10000}]}}'
```

Expected output:

```json
{"ok":false,"error":{"code":"VOUCHER_NOT_FOUND","message":"Unknown code"}}
```

Then exercise commit twice with the same `transactionId` to verify idempotency — you should see `{"ok":true}` both times, with no duplicate side effects:

```bash
curl -X POST http://localhost:3000/voucher/commit \
  -H 'Content-Type: application/json' \
  -u 'demouser:demopass' \
  -d '{"amountCents":5000,"transactionId":"res_2f8a1d4b9e7c4f3e8b1a6c2d3e4f5a6b"}'
```

Once this passes against `localhost`, deploy your implementation behind an HTTPS endpoint and configure the URLs in Karma. You are ready to accept live voucher traffic.
