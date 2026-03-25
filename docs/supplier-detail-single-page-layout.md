# Supplier Detail Single Page Layout

## What Changed
- Refactored `apps/inventory/app/(back-office)/suppliers/[id]/page.tsx` to render all supplier detail sections on one page using the same 4-card layout style as the add-supplier form (`Supplier`, `Contact`, `Bank`, `Performance`).
- Added an `Edit` button to the supplier detail page header (PageHeader actions).
- Added KPI cards + a purchase orders table under the “Purchase orders” header (filtered to the current supplier).
- Implemented the KPI cards using the existing `StockKPIs` component to match the stock UI styling.

## Why
- Ensure supplier detail UI matches the “single page / all details visible” requirement (same structure as Add Supplier).
- Provide a clear entry point to edit supplier details from the details view.

## Notes
- The `Edit` button currently navigates to `/suppliers/add?edit=<supplierId>` (pre-fill behavior can be added later if needed).

