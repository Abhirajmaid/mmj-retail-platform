# Suppliers Table & Detail Route

## What changed

- Refactored `@apps/inventory/app/(back-office)/suppliers/page.tsx` to use a stock-style **table** layout.
- Each supplier row now navigates to a dedicated detail page: `@apps/inventory/app/(back-office)/suppliers/[id]/page.tsx`.
- Updated the **Add Supplier** page header to match the stock-add pattern (breadcrumbs + HELP action): `@apps/inventory/app/(back-office)/suppliers/add/page.tsx`.
- Added shared helper utilities for suppliers: `apps/inventory/src/components/suppliers/supplier-shared.tsx`.

## Why

- Keeps suppliers UI consistent with the stock/firms approach.
- Simplifies interaction by using a single-page detail view instead of a right-side panel.

## Files

- `apps/inventory/app/(back-office)/suppliers/page.tsx`
- `apps/inventory/app/(back-office)/suppliers/[id]/page.tsx`
- `apps/inventory/app/(back-office)/suppliers/add/page.tsx`
- `apps/inventory/src/components/suppliers/supplier-shared.tsx`
