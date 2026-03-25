# Inventory dashboard UI alignment (stock page)

## What changed

- **Layout** matches the stock page shell: `PageHeader`, `min-w-0 space-y-4 sm:space-y-6`, and shared spacing rhythm.
- **Search** uses the same `Input` treatment as `StockTabs` (rounded-xl, amber focus ring, shadow).
- **KPIs** use `KpiCard` from `@jewellery-retail/ui` (same glass style as the stock page via `StockKPIs`) beside the hero and in a three-column row.
- **Removed** the second-column mini cards (recent updates, category groups), the four-wide duplicate stat row, and the **Category mix** pie chart; valuation trend is a single full-width `Card`.
- **Recent stock updates**: no outer `Card` (transparent section); bordered table uses `bg-white`. Same behavior as `StockTable` (no top-right badge, **Showing N results** / **of M** when filtered, **MOVEMENT** + transfer badge, column widths, transfer rows → `/stock/transfer/list`).

## Why

- One visual language with the stock page and shared UI primitives from `packages/ui`.

## Files

- `apps/inventory/app/(back-office)/dashboard/page.tsx`
