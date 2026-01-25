# Example: Fetching Nightly Sales Data

This guide shows how to build an automated nightly sales report that fetches purchase data from the Karma API.

## Overview

Many integrations need to sync sales data on a nightly basis for accounting, inventory reconciliation, or business intelligence. This example demonstrates:

1. Fetching purchases for a specific date range
2. Handling pagination for large result sets
3. Processing and aggregating sales data
4. Error handling and retry logic

## Prerequisites

- API Key with `purchases.read` permission
- Location ID(s) you want to fetch data for

## API Endpoint

```
GET /api/v1/purchases
```

## TypeScript Implementation

```typescript
import { createKarmaClient } from '@karmalicious/karma-api-js'

interface NightlySalesReport {
  date: string
  locationId: number
  totalSales: number
  totalTransactions: number
  averageOrderValue: number
  salesByHour: Record<number, number>
  topProducts: Array<{ title: string; quantity: number; revenue: number }>
}

async function fetchNightlySalesData(
  apiKey: string,
  locationId: number,
  date: string // YYYY-MM-DD format
): Promise<NightlySalesReport> {
  const client = createKarmaClient({
    apiKey,
    baseUrl: 'https://common-api.karma.life'
  })

  // Define date range for the full day
  const startDate = `${date}T00:00:00Z`
  const endDate = `${date}T23:59:59Z`

  // Fetch all purchases with pagination
  const allPurchases: any[] = []
  let page = 1
  const limit = 100
  let hasMore = true

  while (hasMore) {
    const response = await client.purchases.getPurchases({
      locationId,
      startDate,
      endDate,
      state: 'confirmed', // Only completed purchases
      page,
      limit
    })

    allPurchases.push(...response.data.items)
    hasMore = response.data.pagination.hasMore
    page++

    // Rate limiting protection
    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  // Aggregate the data
  return aggregateSalesData(allPurchases, date, locationId)
}

function aggregateSalesData(
  purchases: any[],
  date: string,
  locationId: number
): NightlySalesReport {
  const salesByHour: Record<number, number> = {}
  const productSales: Record<string, { quantity: number; revenue: number }> = {}
  let totalSales = 0

  for (const purchase of purchases) {
    // Add to total
    const amount = purchase.lineItems
      .filter((li: any) => li.type === 'product')
      .reduce((sum: number, li: any) => sum + li.finalAmountCents, 0)
    totalSales += amount

    // Track by hour
    const hour = new Date(purchase.purchasedAt).getHours()
    salesByHour[hour] = (salesByHour[hour] || 0) + amount

    // Track by product
    for (const lineItem of purchase.lineItems) {
      if (lineItem.type === 'product') {
        if (!productSales[lineItem.title]) {
          productSales[lineItem.title] = { quantity: 0, revenue: 0 }
        }
        productSales[lineItem.title].quantity += lineItem.quantity
        productSales[lineItem.title].revenue += lineItem.finalAmountCents
      }
    }
  }

  // Get top 10 products by revenue
  const topProducts = Object.entries(productSales)
    .map(([title, data]) => ({ title, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  return {
    date,
    locationId,
    totalSales,
    totalTransactions: purchases.length,
    averageOrderValue: purchases.length > 0 ? Math.round(totalSales / purchases.length) : 0,
    salesByHour,
    topProducts
  }
}

// Example usage with retry logic
async function fetchWithRetry(
  apiKey: string,
  locationId: number,
  date: string,
  maxRetries = 3
): Promise<NightlySalesReport> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetchNightlySalesData(apiKey, locationId, date)
    } catch (error: any) {
      if (error.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = error.headers?.['retry-after'] || 60
        console.log(`Rate limited. Waiting ${retryAfter}s before retry ${attempt}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
      } else if (attempt === maxRetries) {
        throw error
      } else {
        // Other error - exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }
  throw new Error('Max retries exceeded')
}

// Run nightly at 2 AM
async function runNightlyJob() {
  const apiKey = process.env.KARMA_API_KEY!
  const locationIds = [100, 101, 102] // Your location IDs

  // Get yesterday's date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const dateStr = yesterday.toISOString().split('T')[0]

  console.log(`Fetching sales data for ${dateStr}`)

  const reports: NightlySalesReport[] = []

  for (const locationId of locationIds) {
    try {
      const report = await fetchWithRetry(apiKey, locationId, dateStr)
      reports.push(report)
      console.log(`Location ${locationId}: ${report.totalTransactions} transactions, ${(report.totalSales / 100).toFixed(2)} SEK`)
    } catch (error) {
      console.error(`Failed to fetch data for location ${locationId}:`, error)
    }
  }

  // Send reports to your system
  await sendToAccountingSystem(reports)
  await sendDailyEmail(reports)
}

runNightlyJob()
```

## cURL Example

```bash
# Fetch purchases for a specific date
curl -X GET "https://common-api.karma.life/api/v1/purchases?locationId=100&startDate=2026-01-24T00:00:00Z&endDate=2026-01-24T23:59:59Z&state=confirmed&limit=100" \
  -H "X-API-Key: karma_live_your_api_key_here" \
  -H "Content-Type: application/json"
```

## Response Example

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 12345,
        "purchasedAt": "2026-01-24T18:30:00Z",
        "state": "confirmed",
        "currencyCode": "SEK",
        "lineItems": [
          {
            "id": 67890,
            "type": "product",
            "title": "Caesar Salad",
            "finalAmountCents": 14500,
            "quantity": 1,
            "vatRateBasisPoints": 1200,
            "vatAmountCents": 1560
          },
          {
            "id": 67891,
            "type": "product",
            "title": "Sparkling Water",
            "finalAmountCents": 3500,
            "quantity": 1,
            "vatRateBasisPoints": 1200,
            "vatAmountCents": 377
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 256,
      "hasMore": true
    }
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-01-25T02:00:00.000Z",
    "executionTimeMs": 45
  }
}
```

## Best Practices

### 1. Use Date Filtering
Always filter by date range to avoid fetching unnecessary data:
```typescript
const response = await client.purchases.getPurchases({
  startDate: '2026-01-24T00:00:00Z',
  endDate: '2026-01-24T23:59:59Z'
})
```

### 2. Handle Pagination
For large datasets, always paginate:
```typescript
let page = 1
while (hasMore) {
  const response = await fetchPage(page)
  // Process data
  page++
}
```

### 3. Respect Rate Limits
The API returns rate limit headers. Implement backoff when approaching limits:
- `X-RateLimit-Limit`: Total allowed requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: When the limit resets (Unix timestamp)

### 4. Run During Off-Peak Hours
Schedule nightly jobs for 2-4 AM local time when API load is typically lower.

### 5. Store Data Locally
Cache results locally to avoid re-fetching if your job fails partway through:
```typescript
const cacheKey = `sales_${locationId}_${date}`
const cached = await cache.get(cacheKey)
if (cached) return cached
```

## Related Endpoints

- `GET /api/v1/purchases` - List purchases
- `GET /api/v1/purchases/:id` - Get single purchase details
- `GET /api/v1/statistics` - Pre-aggregated statistics
- `GET /api/v1/analytics` - Advanced analytics queries

## Need Help?

Contact [hello@karma.life](mailto:hello@karma.life) for API support.
