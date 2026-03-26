# Invoices Table and Detail Stock-Style Update

## What Changed
- Removed the `Action` column from invoices list table in `apps/billing/app/(pos)/invoices/page.tsx`.
- Removed inline edit/delete/download action buttons from each invoice row; row-click navigation remains.
- Redesigned single invoice page `apps/billing/app/(pos)/invoices/[id]/page.tsx` to follow stock-add style layout:
  - `PageHeader` with status badge + back action
  - Card section: `Invoice Header Information`
  - Card section: `Customer & Billing Summary`
  - Read-only field presentation using stock-like input styling
  - Bottom footer actions aligned to stock-add style (`Back` and amber `Download`)

## Why
- Match invoice screens with stock module UI patterns for visual consistency.
- Simplify invoice list rows by removing per-row action clutter.

## Notes
- Printing/downloading behavior remains available from single invoice page.
- Single invoice page footer actions were updated to a stock-add-like action strip with explicit `Back`, `Edit`, and `Delete` outline buttons (plus `Download` primary action).
- `Back`, `Edit`, and `Delete` actions are now moved to the single invoice `PageHeader` action bar (top-right), matching stock-add-style header action placement.
