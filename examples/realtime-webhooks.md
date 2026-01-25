# Example: Listening to Real-time Sales Through Webhooks

This guide shows how to receive real-time sales notifications via webhooks, enabling instant updates to your systems when orders are placed and payments are completed.

## Overview

Webhooks provide push notifications for events like:
- New orders placed
- Payments completed
- Tab status changes
- Inventory updates

This is more efficient than polling and enables real-time integrations.

## Setting Up Webhook Subscriptions

### Step 1: Create a Webhook Endpoint

First, create an endpoint on your server to receive webhook events:

```typescript
// Express.js example
import express from 'express'
import crypto from 'crypto'

const app = express()

// Parse raw body for signature verification
app.use('/webhooks/karma', express.raw({ type: 'application/json' }))

app.post('/webhooks/karma', (req, res) => {
  // Verify webhook signature
  const signature = req.headers['x-webhook-signature'] as string
  const secret = process.env.WEBHOOK_SECRET!

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest('hex')

  if (signature !== expectedSignature) {
    console.error('Invalid webhook signature')
    return res.status(401).send('Invalid signature')
  }

  // Parse and handle the event
  const event = JSON.parse(req.body.toString())
  handleWebhookEvent(event)

  // Always respond quickly (within 5 seconds)
  res.status(200).send('OK')
})

app.listen(3000)
```

### Step 2: Register Your Webhook

```typescript
import { createKarmaClient } from '@karmalicious/karma-api-js'

async function setupWebhook(apiKey: string, locationId: number) {
  const client = createKarmaClient({
    apiKey,
    baseUrl: 'https://common-api.karma.life'
  })

  const subscription = await client.webhooks.createSubscription({
    url: 'https://your-server.com/webhooks/karma',
    events: [
      // Order events
      'order.created',
      'order.updated',
      'order.completed',
      'order.cancelled',

      // Payment events
      'purchase.confirmed',
      'purchase.refunded',

      // Tab events
      'tab.opened',
      'tab.closed',
      'tab.payment_received',

      // Inventory events
      'inventory.updated',
      'inventory.availability_changed'
    ],
    secret: 'your_webhook_secret_here', // Store this securely!
    active: true
  })

  console.log('Webhook created:', subscription.data.id)
  return subscription.data
}
```

### cURL Example

```bash
# Create webhook subscription
curl -X POST "https://common-api.karma.life/api/v1/webhooks/subscriptions" \
  -H "X-API-Key: karma_live_your_api_key_here" \
  -H "Content-Type: application/json" \
  -H "X-Location-Id: 100" \
  -d '{
    "url": "https://your-server.com/webhooks/karma",
    "events": ["order.created", "purchase.confirmed", "tab.closed"],
    "secret": "your_webhook_secret_here",
    "active": true
  }'
```

## Webhook Event Handling

### Real-time Sales Dashboard

```typescript
interface WebhookEvent {
  id: string
  event: string
  resource: string
  resourceId: string
  timestamp: string
  apiVersion: string
  data: any
}

interface SalesMetrics {
  totalSales: number
  orderCount: number
  averageOrderValue: number
  recentOrders: Array<{
    id: string
    amount: number
    time: Date
  }>
}

class RealtimeSalesDashboard {
  private metrics: SalesMetrics = {
    totalSales: 0,
    orderCount: 0,
    averageOrderValue: 0,
    recentOrders: []
  }

  handleEvent(event: WebhookEvent) {
    switch (event.event) {
      case 'purchase.confirmed':
        this.handlePurchaseConfirmed(event)
        break
      case 'order.created':
        this.handleOrderCreated(event)
        break
      case 'order.completed':
        this.handleOrderCompleted(event)
        break
      case 'tab.closed':
        this.handleTabClosed(event)
        break
    }
  }

  private handlePurchaseConfirmed(event: WebhookEvent) {
    const purchase = event.data

    // Calculate total from line items
    const total = purchase.lineItems
      .filter((li: any) => li.type === 'product')
      .reduce((sum: number, li: any) => sum + li.finalAmountCents, 0)

    // Update metrics
    this.metrics.totalSales += total
    this.metrics.orderCount++
    this.metrics.averageOrderValue = Math.round(
      this.metrics.totalSales / this.metrics.orderCount
    )

    // Add to recent orders (keep last 10)
    this.metrics.recentOrders.unshift({
      id: purchase.id,
      amount: total,
      time: new Date(event.timestamp)
    })
    this.metrics.recentOrders = this.metrics.recentOrders.slice(0, 10)

    // Broadcast to connected clients
    this.broadcastUpdate()

    console.log(`Sale confirmed: ${total / 100} SEK`)
  }

  private handleOrderCreated(event: WebhookEvent) {
    console.log(`New order created: ${event.resourceId}`)
    // Notify kitchen display
    this.notifyKitchen(event.data)
  }

  private handleOrderCompleted(event: WebhookEvent) {
    console.log(`Order completed: ${event.resourceId}`)
  }

  private handleTabClosed(event: WebhookEvent) {
    const tab = event.data
    console.log(`Tab closed: ${tab.uuid}, Total: ${tab.totalAmountCents / 100} SEK`)
  }

  private broadcastUpdate() {
    // Send to WebSocket clients, update dashboard, etc.
  }

  private notifyKitchen(order: any) {
    // Send to kitchen display system
  }

  getMetrics(): SalesMetrics {
    return { ...this.metrics }
  }
}

// Usage
const dashboard = new RealtimeSalesDashboard()

function handleWebhookEvent(event: WebhookEvent) {
  dashboard.handleEvent(event)
}
```

### POS Integration

```typescript
class POSIntegration {
  async handleEvent(event: WebhookEvent) {
    switch (event.event) {
      case 'order.created':
        await this.syncOrderToPOS(event.data)
        break
      case 'purchase.confirmed':
        await this.recordPaymentInPOS(event.data)
        break
      case 'inventory.availability_changed':
        await this.updatePOSInventory(event.data)
        break
    }
  }

  private async syncOrderToPOS(order: any) {
    const posOrder = {
      externalId: `karma_${order.id}`,
      createdAt: order.createdAt,
      items: order.items.map((item: any) => ({
        name: item.title,
        quantity: item.quantity,
        unitPrice: item.price / 100,
        modifiers: item.variants?.map((v: any) => v.name) || []
      })),
      subtotal: order.subtotalCents / 100,
      tax: order.taxCents / 100,
      total: order.totalCents / 100
    }

    await this.posAPI.createOrder(posOrder)
  }

  private async recordPaymentInPOS(purchase: any) {
    const payment = {
      orderId: `karma_${purchase.tabId}`,
      amount: purchase.lineItems
        .reduce((sum: number, li: any) => sum + li.finalAmountCents, 0) / 100,
      method: purchase.psp,
      reference: purchase.pspResponseRef,
      timestamp: purchase.purchasedAt
    }

    await this.posAPI.recordPayment(payment)
  }

  private async updatePOSInventory(item: any) {
    await this.posAPI.updateItemAvailability(
      `karma_${item.id}`,
      item.available
    )
  }

  private posAPI = {
    createOrder: async (order: any) => { /* ... */ },
    recordPayment: async (payment: any) => { /* ... */ },
    updateItemAvailability: async (id: string, available: boolean) => { /* ... */ }
  }
}
```

### Accounting Integration

```typescript
class AccountingIntegration {
  async handlePurchaseConfirmed(event: WebhookEvent) {
    const purchase = event.data

    // Group line items by VAT rate
    const vatGroups: Record<number, { net: number; vat: number }> = {}

    for (const lineItem of purchase.lineItems) {
      if (lineItem.type !== 'product') continue

      const vatRate = lineItem.vatRateBasisPoints
      if (!vatGroups[vatRate]) {
        vatGroups[vatRate] = { net: 0, vat: 0 }
      }

      vatGroups[vatRate].net += lineItem.finalAmountCents - lineItem.vatAmountCents
      vatGroups[vatRate].vat += lineItem.vatAmountCents
    }

    // Create accounting entry
    const entry = {
      date: purchase.purchasedAt,
      reference: `KARMA-${purchase.id}`,
      description: `Sale at location ${purchase.locationId}`,
      lines: [
        // Revenue lines by VAT rate
        ...Object.entries(vatGroups).map(([vatRate, amounts]) => ({
          account: this.getRevenueAccount(Number(vatRate)),
          credit: amounts.net / 100,
          description: `Sales ${Number(vatRate) / 100}% VAT`
        })),
        // VAT liability
        ...Object.entries(vatGroups).map(([vatRate, amounts]) => ({
          account: this.getVATAccount(Number(vatRate)),
          credit: amounts.vat / 100,
          description: `VAT ${Number(vatRate) / 100}%`
        })),
        // Cash/Bank debit
        {
          account: this.getPaymentAccount(purchase.psp),
          debit: purchase.lineItems.reduce(
            (sum: number, li: any) => sum + li.finalAmountCents, 0
          ) / 100,
          description: `Payment via ${purchase.psp}`
        }
      ]
    }

    await this.accountingAPI.createJournalEntry(entry)
  }

  private getRevenueAccount(vatRateBasisPoints: number): string {
    // Map VAT rate to revenue account
    if (vatRateBasisPoints === 2500) return '3001' // 25% VAT
    if (vatRateBasisPoints === 1200) return '3002' // 12% VAT
    if (vatRateBasisPoints === 600) return '3003'  // 6% VAT
    return '3000' // Default
  }

  private getVATAccount(vatRateBasisPoints: number): string {
    if (vatRateBasisPoints === 2500) return '2610' // 25% VAT
    if (vatRateBasisPoints === 1200) return '2620' // 12% VAT
    if (vatRateBasisPoints === 600) return '2630'  // 6% VAT
    return '2600' // Default
  }

  private getPaymentAccount(psp: string): string {
    if (psp === 'stripe') return '1930'
    if (psp === 'adyen') return '1931'
    if (psp === 'swish') return '1932'
    return '1900' // Default cash
  }

  private accountingAPI = {
    createJournalEntry: async (entry: any) => { /* ... */ }
  }
}
```

## Webhook Event Payload Examples

### order.created

```json
{
  "id": "evt_abc123",
  "event": "order.created",
  "resource": "order",
  "resourceId": "ord_12345",
  "timestamp": "2026-01-25T14:30:00.000Z",
  "apiVersion": "v1",
  "data": {
    "id": "ord_12345",
    "tabId": "tab_67890",
    "locationId": 100,
    "state": "sent",
    "createdAt": "2026-01-25T14:30:00.000Z",
    "items": [
      {
        "id": 1,
        "itemId": 12345,
        "title": "Caesar Salad",
        "quantity": 2,
        "price": 14500,
        "variants": [
          { "name": "Extra Chicken", "price": 3500 }
        ]
      }
    ],
    "subtotalCents": 36000,
    "source": "QR"
  }
}
```

### purchase.confirmed

```json
{
  "id": "evt_def456",
  "event": "purchase.confirmed",
  "resource": "purchase",
  "resourceId": "12345",
  "timestamp": "2026-01-25T14:35:00.000Z",
  "apiVersion": "v1",
  "data": {
    "id": 12345,
    "locationId": 100,
    "tabId": "tab_67890",
    "state": "confirmed",
    "psp": "stripe",
    "pspResponseRef": "pi_abc123",
    "currencyCode": "SEK",
    "purchasedAt": "2026-01-25T14:35:00.000Z",
    "lineItems": [
      {
        "id": 1,
        "type": "product",
        "title": "Caesar Salad",
        "finalAmountCents": 14500,
        "vatRateBasisPoints": 1200,
        "vatAmountCents": 1560,
        "quantity": 1
      },
      {
        "id": 2,
        "type": "tip",
        "title": "Tip",
        "finalAmountCents": 2000,
        "vatRateBasisPoints": 0,
        "vatAmountCents": 0,
        "quantity": 1
      }
    ]
  }
}
```

### tab.closed

```json
{
  "id": "evt_ghi789",
  "event": "tab.closed",
  "resource": "tab",
  "resourceId": "tab_67890",
  "timestamp": "2026-01-25T15:00:00.000Z",
  "apiVersion": "v1",
  "data": {
    "uuid": "tab_67890",
    "locationId": 100,
    "latestState": "closed",
    "totalAmountCents": 36000,
    "paidAmountCents": 36000,
    "tipAmountCents": 2000,
    "tabType": "table",
    "createdAt": "2026-01-25T14:00:00.000Z",
    "closedAt": "2026-01-25T15:00:00.000Z"
  }
}
```

## Best Practices

### 1. Verify Signatures
Always verify the webhook signature to ensure authenticity:
```typescript
const isValid = crypto
  .createHmac('sha256', secret)
  .update(rawBody)
  .digest('hex') === signature
```

### 2. Respond Quickly
Return 200 OK within 5 seconds. Process asynchronously:
```typescript
app.post('/webhook', (req, res) => {
  // Acknowledge immediately
  res.status(200).send('OK')

  // Process asynchronously
  processEvent(req.body).catch(console.error)
})
```

### 3. Handle Retries
Webhooks retry on failure. Implement idempotency:
```typescript
async function processEvent(event: WebhookEvent) {
  // Check if already processed
  if (await isProcessed(event.id)) {
    return
  }

  // Process the event
  await handleEvent(event)

  // Mark as processed
  await markProcessed(event.id)
}
```

### 4. Log Everything
Keep logs for debugging:
```typescript
console.log(`Received webhook: ${event.event} - ${event.resourceId}`)
```

### 5. Use HTTPS
Your webhook endpoint must use HTTPS with a valid SSL certificate.

## Managing Subscriptions

### List Subscriptions

```bash
curl -X GET "https://common-api.karma.life/api/v1/webhooks/subscriptions" \
  -H "X-API-Key: karma_live_your_api_key_here"
```

### Update Subscription

```bash
curl -X PUT "https://common-api.karma.life/api/v1/webhooks/subscriptions/123" \
  -H "X-API-Key: karma_live_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["order.created", "purchase.confirmed"],
    "active": true
  }'
```

### Delete Subscription

```bash
curl -X DELETE "https://common-api.karma.life/api/v1/webhooks/subscriptions/123" \
  -H "X-API-Key: karma_live_your_api_key_here"
```

## Available Events

| Event | Description |
|-------|-------------|
| `order.created` | New order sent to kitchen |
| `order.updated` | Order status changed |
| `order.completed` | Order marked as complete |
| `order.cancelled` | Order cancelled |
| `purchase.confirmed` | Payment completed |
| `purchase.refunded` | Payment refunded |
| `tab.opened` | New tab created |
| `tab.closed` | Tab closed |
| `tab.payment_received` | Partial payment on tab |
| `inventory.created` | New item added |
| `inventory.updated` | Item details changed |
| `inventory.deleted` | Item removed |
| `inventory.availability_changed` | Item availability toggled |

## Need Help?

Contact [hello@karma.life](mailto:hello@karma.life) for API support.
