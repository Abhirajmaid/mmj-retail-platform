# Stock Tally RFID/Barcode: Horizontal Column Filters

## What Changed
- Refactored the per-column filter inputs (`PRODUCT ID`, `METAL TYPE`, `CATEGORY`, `PRODUCT NAME`, `QTY`, `GS WT`, `NT WT`, `FN WT`) in `apps/inventory/app/(back-office)/stock-tally/rfid-barcode/page.tsx`.
- The filters are now rendered in a responsive grid above the table (using the same layout approach as `suppliers/[id]/page.tsx`), instead of being embedded inside the table header.
- Simplified the table header to show labels only.

## Why
- Improve visual consistency and readability by using the “horizontal field grid” pattern already used for supplier detail pages.
- Make the filter controls easier to scan on wider screens while still wrapping well on smaller viewports.

## Follow-ups / Notes
- The filtering logic remains unchanged; only the presentation/layout moved.
