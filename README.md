# Karma Common API Documentation

This repository hosts the OpenAPI specification and documentation for the [Karma Common API](https://github.com/karmadev/karma-common-api).

## Live Documentation

**[https://docs.karma.life](https://docs.karma.life)**

## Features

- **Interactive API Reference** - Full OpenAPI documentation powered by Scalar
- **Environment Selector** - Switch between Production, Beta, and Development APIs
- **Implementation Examples** - Complete code examples for common integrations
- **Version History** - Access previous API versions

## Implementation Examples

| Example | Description |
|---------|-------------|
| [Nightly Sales Data](examples/nightly-sales-data.md) | Fetch and aggregate daily sales for accounting |
| [Inventory Sync](examples/inventory-sync.md) | Two-way inventory sync with POS systems |
| [Real-time Webhooks](examples/realtime-webhooks.md) | Receive instant sales notifications |

## API Environments

| Environment | API Base URL |
|-------------|--------------|
| Production | `https://common-api.karma.life` |
| Beta | `https://common-api.beta.karma.life` |
| Development | `https://common-api.development.karma.life` |

## Using the Specification

### Direct Links

- **JSON**: https://docs.karma.life/latest/openapi.json
- **YAML**: https://docs.karma.life/latest/openapi.yaml

### Embed with Scalar

```html
<!DOCTYPE html>
<html>
<head>
  <title>API Docs</title>
</head>
<body>
  <script
    id="api-reference"
    data-url="https://docs.karma.life/latest/openapi.json">
  </script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>
```

### Import in Postman

1. Open Postman
2. Click **Import** → **Link**
3. Paste: `https://docs.karma.life/latest/openapi.json`
4. Click **Import**

### Generate TypeScript Client

```bash
# Using openapi-generator
npx @openapitools/openapi-generator-cli generate \
  -i https://docs.karma.life/latest/openapi.json \
  -g typescript-fetch \
  -o ./generated-client

# Using orval (recommended for React)
npx orval --input https://docs.karma.life/latest/openapi.json
```

## Version History

| Path | Description |
|------|-------------|
| `/latest/openapi.json` | Always the latest version |
| `/versions/v1/openapi.json` | Latest v1.x stable |

See [versions/manifest.json](./versions/manifest.json) for the complete version history.

## Automatic Updates

This documentation is automatically updated when changes are pushed to the [karma-common-api](https://github.com/karmadev/karma-common-api) repository.

**Triggers:**
- Changes to `src/endpoints/**/schemas.ts`
- Changes to `src/server.ts`
- Version bumps in `package.json`

## Related Repositories

- [karma-common-api](https://github.com/karmadev/karma-common-api) - The API source code
- [Karma-Merchant-Web](https://github.com/karmadev/Karma-Merchant-Web) - Merchant dashboard

## Support

For API support, contact [hello@karma.life](mailto:hello@karma.life)
