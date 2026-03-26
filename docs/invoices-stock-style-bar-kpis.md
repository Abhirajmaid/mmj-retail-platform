# Invoices Stock-Style Bar and KPI Cards

## What Changed
- Updated `apps/billing/app/(pos)/invoices/page.tsx` to add a stock-style KPI cards row using shared `KpiCard`.
- Added four KPI cards aligned with stock page visual style:
  - Total Invoices
  - Paid Invoices
  - Pending Invoices
  - Overdue Invoices
- Replaced the plain search input with a stock-like action bar layout:
  - left filter tabs with counts (`All`, `Paid`, `Pending`, `Overdue`)
  - right-side search field with icon
  - circular action buttons (`+`, filter, column visibility)
  - `Export` action button
- Wired tab-based filtering + text search together so table rows update by selected status tab and search query.

## Why
- Match invoices page controls and summary cards to the same interaction and visual language used on stock pages.
- Improve scanability by surfacing invoice status counts before the table.

## Notes
- Filter/column visibility/export action buttons are currently UI-only controls in this page update.
