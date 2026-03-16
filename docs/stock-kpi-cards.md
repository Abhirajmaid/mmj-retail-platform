# Stock KPI Cards

## What Changed
- Added a `StockKPIs` component in `apps/inventory/src/components/stock/StockKPIs.tsx` that renders four KPI cards (Total, Inbound, Outbound, Pending) in the same visual style as the Firm KPIs.
- The Stock page (`apps/inventory/app/(back-office)/stock/page.tsx`) now computes movement stats from `useStockMovements()` and displays these cards above the stock table.

## Why
- Provide a quick overview of stock movements (totals and by type/status) consistent with the Firm dashboard experience.

## Notes
- Stats are derived from the current movements list: total count, inbound count, outbound count, and pending status count. No new API or backend changes.
