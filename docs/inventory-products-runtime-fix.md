# Products Page Runtime Fix

## What Changed
- Updated `apps/inventory/app/(back-office)/products/page.tsx` to normalize `useProducts()` output into a safe `products` array before applying filters and counters.
- Replaced direct reads from `data` with `products` in filtering, KPI calculations, and results count text.

## Why
- The products payload can arrive as a non-array object in some environments, which caused `data.filter is not a function`.
- The guard prevents the page from crashing and keeps the UI usable even when payload shape varies.
