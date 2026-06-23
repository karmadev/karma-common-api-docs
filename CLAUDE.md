# karma-common-api-docs — Claude Code Instructions

This repo hosts the **public** API documentation served at **https://docs.karma.life**.
It is a [Zudoku](https://zudoku.dev) static site. All pages are pre-rendered to HTML at
build time and committed in `dist/` — there is **no** client-side spec hydration and
**no** build step in CI.

## ⚠️ Git Policy

Never commit, push, or deploy without explicit user approval. This is a **public**
production site — confirm before pushing to `main`.

## How the docs are published (READ THIS BEFORE TOUCHING DOCS)

The OpenAPI spec is **not fetched live**. The site renders from a committed snapshot at
`public/latest/openapi.json`. Publishing new API changes is a manual, multi-step process.

> There is a `sync-api-docs.yml` workflow in `karma-common-api`, but it only triggers on
> pushes to **`main`/`master`** of that repo, and it only refreshes the raw spec files —
> it does **not** rebuild the Zudoku `dist/`. In practice we publish **manually from
> `dev`** (the committed `public/latest/version.json` shows `gitBranch: dev`). Don't
> assume a push to common-api `dev` or `beta` updates these docs — it does not.

### Full publish procedure

1. **Generate the spec** from `karma-common-api` (check out the branch whose API you want
   to publish — by convention `dev`):
   ```bash
   cd ../karma-common-api
   npm run export-openapi -- --output=/tmp/api-docs
   # → /tmp/api-docs/openapi.json, openapi.yaml, version.json
   ```
   Verify your change is in it before continuing, e.g.:
   ```bash
   grep -c "<yourNewField>" /tmp/api-docs/openapi.json
   ```

2. **Copy the spec** into this repo. The site renders from `public/latest/` (this is the
   path `zudoku.config.ts` reads via its `apis` array). Also update the matching specific
   version dir under `public/versions/` (its name matches `version.json`'s `version`):
   ```bash
   cd ../karma-common-api-docs
   cp /tmp/api-docs/openapi.json  public/latest/openapi.json
   cp /tmp/api-docs/openapi.yaml  public/latest/openapi.yaml
   cp /tmp/api-docs/version.json  public/latest/version.json
   cp /tmp/api-docs/openapi.json  public/versions/v<VERSION>/openapi.json
   cp /tmp/api-docs/openapi.yaml  public/versions/v<VERSION>/openapi.yaml
   ```

3. **Build the static site:**
   ```bash
   npm run build   # → dist/
   ```
   ⚠️ **The build is flaky.** It intermittently fails with `[PARSE_ERROR] Unterminated
   string` in `node_modules/.zudoku/processed/api-openapi.json.js`. Fix by clearing the
   processed cache and rebuilding:
   ```bash
   rm -rf node_modules/.zudoku/processed .zudoku
   npm run build
   ```
   A successful build exits 0 (benign warnings like `--localstorage-file` and `<Navigate>
   must not be used on the initial render` are fine). Confirm your change rendered:
   ```bash
   grep -rl "<yourNewField>" dist/api/latest/   # the operation page(s)
   grep -c  "<yourNewField>" dist/latest/openapi.json
   ```

4. **Commit and push `main`.** `dist/` is **intentionally tracked** (the `.gitignore` has
   an exception — see its comment). A full rebuild changes hundreds of files; that's
   normal. `deploy.yml` triggers on pushes to `main` that touch `dist/**` and uploads
   `dist/` to GitHub Pages (no build in CI).
   ```bash
   git add -A
   git commit -m "docs: refresh OpenAPI spec — <what changed>"
   git push origin main
   ```

5. **Verify the deploy and the live site:**
   ```bash
   gh run watch <run-id> --exit-status
   curl -s https://docs.karma.life/latest/openapi.json | grep -c "<yourNewField>"
   ```

## Repo layout

| Path | Contents |
|------|----------|
| `zudoku.config.ts` | Site config, branding, navigation, multi-version `apis` array (inputs point at `./public/latest/openapi.json` and `./public/versions/.../openapi.json`) |
| `zudoku.build.ts` | Build-time processor that merges `specs/` fragments (custom integrations, webhook events) into each version's spec and computes `x-tagGroups` |
| `pages/` | Hand-written MDX pages (Introduction, Examples, prose) |
| `specs/` | OpenAPI **fragments** consumed only at build time (NOT the main API spec) |
| `public/` | Served verbatim — `public/latest/openapi.json` is the rendered source of truth; also preserves `/versions/...`, `/CNAME` |
| `dist/` | Build output, **committed** and published to Pages by `deploy.yml` |

## Notes

- The published spec reflects whatever branch you exported from. Because we publish from
  `dev`, docs.karma.life can be ahead of the production API. Keep this in mind when telling
  external integrators a field is "available" — confirm whether it's on the prod deploy.
- `https://<service-host>/docs` is a **separate** in-service Scalar UI generated live from
  the running service's schemas. It auto-updates on each service deploy and is independent
  of this repo. This repo is the public, versioned, pre-rendered site.
