# Stock Tally RFID/Barcode: Filters Inside Table Card

## What Changed
- Moved the per-column filter fields (e.g. `PRODUCT ID`, `METAL TYPE`, `QTY`, `GS WT`, `NT WT`, `FN WT`) inside the bordered card container that wraps the table in `apps/inventory/app/(back-office)/stock-tally/rfid-barcode/page.tsx`.
- Removed the table’s column header label row to avoid duplicate labels (filters are already shown inside the card).
- Filtering logic is unchanged.

## Why
- Align the UI so the filter fields visually belong to the same “table card” section, matching the expected layout in the screenshot you shared.

## Follow-ups / Notes
- No behavioral changes were made; only layout structure changed.
