# Example: Pushing and Pulling Inventory

This guide shows how to sync inventory between your system and Karma, including fetching current inventory, updating items, and handling availability changes.

## Overview

Inventory sync is essential for:
- Keeping POS systems in sync with Karma
- Managing stock levels from external inventory systems
- Updating prices from your ERP
- Syncing menu changes across platforms

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/inventory` | List all inventory items |
| GET | `/api/v1/inventory/:id` | Get single item details |
| PUT | `/api/v1/inventory/:id` | Update an inventory item |
| POST | `/api/v1/inventory/commit` | Commit items to an order |

## Pulling Inventory (Fetch from Karma)

### TypeScript Implementation

```typescript
import { createKarmaClient } from '@karmalicious/karma-api-js'

interface InventoryItem {
  id: number
  title: string
  basePrice: number // in cents
  vatRateBasisPoints: number
  available: boolean
  categoryId: number
  categoryName: string
  variants: VariantGroup[]
}

interface VariantGroup {
  id: number
  name: string
  required: boolean
  options: VariantOption[]
}

interface VariantOption {
  id: number
  name: string
  priceAdjustment: number // in cents
  available: boolean
}

async function pullInventory(
  apiKey: string,
  locationId: number
): Promise<InventoryItem[]> {
  const client = createKarmaClient({
    apiKey,
    baseUrl: 'https://common-api.karma.life'
  })

  const allItems: InventoryItem[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await client.inventory.getInventoryItems({
      locationId,
      includeVariants: true,
      includeUnavailable: true, // Include out-of-stock items
      page,
      limit: 100
    })

    const items = response.data.items.map(item => ({
      id: item.id,
      title: item.title,
      basePrice: item.basePrice,
      vatRateBasisPoints: item.vatRateBasisPoints,
      available: item.available,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      variants: item.variantGroups || []
    }))

    allItems.push(...items)
    hasMore = response.data.pagination.hasMore
    page++
  }

  return allItems
}

// Example: Sync to external POS
async function syncToPOS(apiKey: string, locationId: number) {
  console.log('Pulling inventory from Karma...')
  const inventory = await pullInventory(apiKey, locationId)

  console.log(`Found ${inventory.length} items`)

  for (const item of inventory) {
    // Transform to your POS format
    const posItem = {
      externalId: `karma_${item.id}`,
      name: item.title,
      price: item.basePrice / 100, // Convert cents to currency
      taxRate: item.vatRateBasisPoints / 10000, // Convert basis points to decimal
      inStock: item.available,
      modifiers: item.variants.map(vg => ({
        name: vg.name,
        required: vg.required,
        options: vg.options.map(opt => ({
          name: opt.name,
          priceAdjustment: opt.priceAdjustment / 100,
          available: opt.available
        }))
      }))
    }

    // Send to your POS system
    await yourPOSAPI.upsertItem(posItem)
  }

  console.log('Sync complete!')
}
```

### cURL Example

```bash
# Fetch all inventory items
curl -X GET "https://common-api.karma.life/api/v1/inventory?locationId=100&includeVariants=true&limit=100" \
  -H "X-API-Key: karma_live_your_api_key_here" \
  -H "Content-Type: application/json"
```

## Pushing Inventory (Update in Karma)

### Update Item Availability

```typescript
async function updateItemAvailability(
  apiKey: string,
  locationId: number,
  itemId: number,
  available: boolean
): Promise<void> {
  const client = createKarmaClient({
    apiKey,
    baseUrl: 'https://common-api.karma.life'
  })

  await client.inventory.updateInventoryItem(itemId, {
    locationId,
    available
  })

  console.log(`Item ${itemId} availability set to ${available}`)
}

// Bulk availability update
async function bulkUpdateAvailability(
  apiKey: string,
  locationId: number,
  updates: Array<{ itemId: number; available: boolean }>
): Promise<void> {
  const client = createKarmaClient({
    apiKey,
    baseUrl: 'https://common-api.karma.life'
  })

  // Process in batches to respect rate limits
  const batchSize = 10
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize)

    await Promise.all(
      batch.map(update =>
        client.inventory.updateInventoryItem(update.itemId, {
          locationId,
          available: update.available
        })
      )
    )

    // Small delay between batches
    if (i + batchSize < updates.length) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
}
```

### Update Item Prices

```typescript
async function updateItemPrice(
  apiKey: string,
  locationId: number,
  itemId: number,
  newPriceCents: number
): Promise<void> {
  const client = createKarmaClient({
    apiKey,
    baseUrl: 'https://common-api.karma.life'
  })

  await client.inventory.updateInventoryItem(itemId, {
    locationId,
    basePrice: newPriceCents // Always in cents!
  })

  console.log(`Item ${itemId} price updated to ${newPriceCents / 100} SEK`)
}
```

### cURL Example

```bash
# Update item availability
curl -X PUT "https://common-api.karma.life/api/v1/inventory/12345" \
  -H "X-API-Key: karma_live_your_api_key_here" \
  -H "Content-Type: application/json" \
  -H "X-Location-Id: 100" \
  -d '{
    "available": false
  }'

# Update item price
curl -X PUT "https://common-api.karma.life/api/v1/inventory/12345" \
  -H "X-API-Key: karma_live_your_api_key_here" \
  -H "Content-Type: application/json" \
  -H "X-Location-Id: 100" \
  -d '{
    "basePrice": 15900
  }'
```

## Complete Sync Example

Here's a full two-way sync implementation:

```typescript
interface ExternalItem {
  sku: string
  karmaId?: number
  name: string
  price: number // in currency units (not cents)
  inStock: boolean
  stockQuantity: number
}

async function twoWayInventorySync(
  apiKey: string,
  locationId: number,
  externalItems: ExternalItem[]
): Promise<{
  updated: number
  outOfStock: number
  priceChanges: number
}> {
  const client = createKarmaClient({
    apiKey,
    baseUrl: 'https://common-api.karma.life'
  })

  // Pull current Karma inventory
  const karmaInventory = await pullInventory(apiKey, locationId)
  const karmaItemsById = new Map(karmaInventory.map(item => [item.id, item]))

  let updated = 0
  let outOfStock = 0
  let priceChanges = 0

  for (const extItem of externalItems) {
    if (!extItem.karmaId) continue // Skip items not linked to Karma

    const karmaItem = karmaItemsById.get(extItem.karmaId)
    if (!karmaItem) {
      console.warn(`Karma item ${extItem.karmaId} not found for SKU ${extItem.sku}`)
      continue
    }

    const updates: any = {}

    // Check availability
    const shouldBeAvailable = extItem.inStock && extItem.stockQuantity > 0
    if (karmaItem.available !== shouldBeAvailable) {
      updates.available = shouldBeAvailable
      if (!shouldBeAvailable) outOfStock++
    }

    // Check price (convert to cents for comparison)
    const extPriceCents = Math.round(extItem.price * 100)
    if (karmaItem.basePrice !== extPriceCents) {
      updates.basePrice = extPriceCents
      priceChanges++
    }

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      await client.inventory.updateInventoryItem(extItem.karmaId, {
        locationId,
        ...updates
      })
      updated++
      console.log(`Updated ${extItem.sku}: ${JSON.stringify(updates)}`)
    }
  }

  return { updated, outOfStock, priceChanges }
}

// Run the sync
async function runSync() {
  const apiKey = process.env.KARMA_API_KEY!
  const locationId = 100

  // Fetch your external inventory
  const externalItems = await fetchFromYourERP()

  const result = await twoWayInventorySync(apiKey, locationId, externalItems)

  console.log(`Sync complete:`)
  console.log(`  - ${result.updated} items updated`)
  console.log(`  - ${result.outOfStock} items marked out of stock`)
  console.log(`  - ${result.priceChanges} price changes applied`)
}
```

## Webhook Integration

For real-time sync, subscribe to inventory webhooks:

```typescript
// Webhook events for inventory
const inventoryEvents = [
  'inventory.created',
  'inventory.updated',
  'inventory.deleted',
  'inventory.availability_changed'
]

// Create webhook subscription
await client.webhooks.createSubscription({
  url: 'https://your-server.com/webhooks/karma',
  events: inventoryEvents,
  secret: 'your_webhook_secret'
})
```

See the [Webhooks Example](./realtime-webhooks.md) for detailed webhook implementation.

## Response Example

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 12345,
        "title": "Margherita Pizza",
        "description": "Classic tomato and mozzarella",
        "basePrice": 14900,
        "vatRateBasisPoints": 1200,
        "available": true,
        "categoryId": 100,
        "categoryName": "Pizzas",
        "variantGroups": [
          {
            "id": 200,
            "name": "Size",
            "required": true,
            "minSelections": 1,
            "maxSelections": 1,
            "options": [
              {
                "id": 201,
                "name": "Regular",
                "priceAdjustment": 0,
                "available": true
              },
              {
                "id": 202,
                "name": "Large",
                "priceAdjustment": 3000,
                "available": true
              }
            ]
          },
          {
            "id": 210,
            "name": "Extra Toppings",
            "required": false,
            "minSelections": 0,
            "maxSelections": 5,
            "options": [
              {
                "id": 211,
                "name": "Extra Cheese",
                "priceAdjustment": 2000,
                "available": true
              },
              {
                "id": 212,
                "name": "Pepperoni",
                "priceAdjustment": 2500,
                "available": false
              }
            ]
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 45,
      "hasMore": false
    }
  }
}
```

## Best Practices

### 1. Always Use Cents
Prices in the API are always in cents (smallest currency unit):
```typescript
// 149 SEK = 14900 cents
const priceCents = Math.round(priceInSEK * 100)
```

### 2. Handle Variants Properly
When updating variant availability, use the variant groups endpoint:
```typescript
// Update variant option availability
await client.variantGroups.updateVariantOption(optionId, {
  available: false
})
```

### 3. Use X-Location-Id Header
Always include the location header for location-scoped operations:
```typescript
const response = await fetch(url, {
  headers: {
    'X-API-Key': apiKey,
    'X-Location-Id': locationId.toString()
  }
})
```

### 4. Batch Updates
Group multiple updates to reduce API calls:
```typescript
// Instead of updating one by one
for (const item of items) {
  await updateItem(item) // Slow!
}

// Batch them
const batches = chunk(items, 10)
for (const batch of batches) {
  await Promise.all(batch.map(updateItem))
}
```

### 5. Use Webhooks for Real-Time
Don't poll for changes. Subscribe to webhooks for instant updates.

## Related Endpoints

- `GET /api/v1/inventory` - List inventory items
- `PUT /api/v1/inventory/:id` - Update inventory item
- `GET /api/v1/variant-groups` - List variant groups
- `PUT /api/v1/variant-groups/:id/options/:optionId` - Update variant option
- `POST /api/v1/webhooks/subscriptions` - Subscribe to webhooks

## Need Help?

Contact [hello@karma.life](mailto:hello@karma.life) for API support.
