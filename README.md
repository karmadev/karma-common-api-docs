# Karma Common API Documentation

This repository hosts the OpenAPI specification for the [Karma Common API](https://github.com/karmadev/karma-common-api).

## Live Documentation

**[View API Docs](https://karmadev.github.io/karma-common-api-docs/)**

## Available Versions

| Path | Description |
|------|-------------|
| `/latest/openapi.json` | Always the latest version |
| `/versions/v1/openapi.json` | Latest v1.x.x (stable) |
| `/versions/v1.2.0/openapi.json` | Specific version (immutable) |

## Using the Specification

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
    data-url="https://karmadev.github.io/karma-common-api-docs/latest/openapi.json">
  </script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>
```

### Import in Postman

1. Open Postman
2. Click **Import** → **Link**
3. Paste: `https://karmadev.github.io/karma-common-api-docs/latest/openapi.json`
4. Click **Import**

### Download Directly

- **JSON**: https://karmadev.github.io/karma-common-api-docs/latest/openapi.json
- **YAML**: https://karmadev.github.io/karma-common-api-docs/latest/openapi.yaml

### Use in Code Generation

```bash
# Generate TypeScript client with openapi-generator
npx @openapitools/openapi-generator-cli generate \
  -i https://karmadev.github.io/karma-common-api-docs/latest/openapi.json \
  -g typescript-fetch \
  -o ./generated-client

# Generate with orval (recommended for React)
npx orval --input https://karmadev.github.io/karma-common-api-docs/latest/openapi.json
```

## Automatic Updates

This documentation is automatically updated when changes are pushed to the [karma-common-api](https://github.com/karmadev/karma-common-api) repository.

**Triggers:**
- Changes to `src/endpoints/**/schemas.ts`
- Changes to `src/server.ts`
- Version bumps in `package.json`

## Version History

See [versions/manifest.json](./versions/manifest.json) for the complete version history.

## Related Repositories

- [karma-common-api](https://github.com/karmadev/karma-common-api) - The API source code
- [Karma-Merchant-Web](https://github.com/karmadev/Karma-Merchant-Web) - Merchant dashboard

## Support

For API support, contact [developers@karma.life](mailto:developers@karma.life)
