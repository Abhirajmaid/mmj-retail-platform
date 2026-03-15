# DashboardLayout "Invalid hook call" fix

## What changed

- Added npm `overrides` in the root `package.json` so the whole monorepo uses a single version of `react` and `react-dom` (19.2.3).

## Why

- The "Invalid hook call" in `DashboardLayout` (inventory and billing) was caused by **multiple copies of React** in the workspace. The shared `@jewellery-retail/ui` package (and its hooks like `useState` and `usePathname` in `Sidebar`) was resolving to a different React instance than the one used by the Next.js app at runtime.
- Forcing one React version via `overrides` ensures every package (including `@jewellery-retail/ui`) uses the same React instance, so hooks run in the correct context.

## Follow-up

1. From the repo root, reinstall dependencies:
   ```bash
   npm install
   ```
2. Clear Next.js caches for the apps that use the layout, then restart dev:
   ```bash
   cd apps/inventory && npx rimraf .next
   cd apps/billing && npx rimraf .next
   ```
3. Start the apps again (e.g. `npm run dev` from root or from each app).

If the error persists, confirm there are no other copies of `react` or `react-dom` under `apps/inventory/node_modules` or `apps/billing/node_modules` besides the hoisted ones.
