# Purchase Orders KPI + Bar

## What Changed
- Updated `apps/inventory/app/(back-office)/purchase-orders/page.tsx` to show KPI cards (Total, Pending, Approved, Received) directly under the `Purchase orders` header.
- Updated `apps/inventory/app/(back-office)/purchase-orders/page.tsx` to render a Stock-like toolbar (status tabs + search + icons) and a Stock-like table layout (showing results line + overflow table + pagination).

## Why
- Align purchase orders page with the KPI pattern used in other back-office list pages (like `stock`).

## Notes
- KPI cards are computed from `usePurchaseOrders()` data and update automatically when the underlying data changes.

