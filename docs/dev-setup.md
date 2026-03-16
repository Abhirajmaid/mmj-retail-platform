# Dev Setup (npm run dev)

## What Changed

- **Turbopack workspace root**: Next.js was inferring the wrong workspace root (e.g. due to multiple lockfiles), which broke resolution in the monorepo. Each Next app now sets `turbopack.root` (and `experimental.turbo.root` for Next 14) to the repo root in `next.config.mjs`.
- **Single lockfile**: Removed `apps/storefront/package-lock.json`. Only the root `package-lock.json` should exist so Turbo/Next.js detect the monorepo root correctly.
- **Root scripts**: `dev` runs all apps except backend; `dev:storefront` now runs only the storefront (mmj-web).
- **Images config**: Replaced deprecated `images.domains` with `images.remotePatterns` in storefront, billing, and inventory.

## Why

- Correct workspace root fixes “Next.js inferred your workspace root, but it may not be correct” and ensures all apps compile and resolve workspace packages properly.
- One lockfile at root avoids conflicting dependency resolution and wrong root detection.
- Clear scripts: `npm run dev` for full dev, `npm run dev:storefront` for storefront only.

## Scripts (from repo root)

| Command | What runs |
|--------|-----------|
| `npm run dev` | Storefront (mmj-web) + billing-app + inventory-app (no backend) |
| `npm run dev:storefront` | Storefront only (port 3000) |
| `npm run dev:backend` | Backend only |

**Note:** In Turbo output the storefront appears as **mmj-web** (its package name in `apps/storefront/package.json`). That is the storefront app.

## Billing app: “Tailwind PostCSS plugin has moved to a separate package”

If you see **Build Error: Error evaluating Node.js code** pointing at `globals.css` and Tailwind’s PostCSS plugin message, the app was resolving **Tailwind v4** while the config expects **v3**. The root `package.json` now has an **override** so the whole monorepo uses Tailwind v3:

```json
"overrides": {
  "tailwindcss": "^3.4.0"
}
```

After pulling, run **`npm install`** at the repo root so the lockfile uses Tailwind v3. Then restart `npm run dev`. If you later need Tailwind v4 in an app, use `@tailwindcss/postcss` in that app’s PostCSS config and the v4 CSS syntax in its styles.

## Billing app stuck on “loading”

If the billing app (localhost:3001) never finishes compiling or only shows a loading state:

- **Loading UI**: The app now has `app/loading.jsx` and `app/(pos)/loading.tsx` so you get a clear “Loading…” while the first compile or data fetch runs. The dashboard also shows a loader until data is ready and handles errors.
- **Clear Turbopack cache**: From repo root, remove the billing app’s build cache and restart:
  ```bash
  rm -rf apps/billing/.next
  npm run dev
  ```
  On Windows PowerShell: `Remove-Item -Recurse -Force apps\billing\.next`
- If it still hangs, run only the billing app to see a single process’s logs: `npm run dev --workspace=@jewellery-retail/billing-app` (or `cd apps/billing && npm run dev`).

## Follow-up

- After pulling these changes, run `npm install` at the repo root once.
- If you still see middleware deprecation in the storefront, consider migrating to the [proxy convention](https://nextjs.org/docs/messages/middleware-to-proxy) when upgrading Next.js.
