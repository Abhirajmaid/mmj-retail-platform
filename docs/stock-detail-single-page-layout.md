# Stock Detail Single Page Layout

## What Changed
- Added a new stock single-details page at `apps/inventory/app/(back-office)/stock/[id]/page.tsx`.
- The page uses the same consistent UI structure as `suppliers/[id]/page.tsx`: `PageHeader` with `Back`, `Edit`, `Delete`, and four `Card` sections on a single page.
- Updated the stock table row click behavior so normal stock movements open the new details page.

## Why
- Provide a consistent “click row -> view details” experience across back-office screens (stock aligned to supplier details layout).

