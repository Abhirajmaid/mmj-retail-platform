# Stock Tally — RFID / Barcode UI

## What Changed
- **Page shell:** Uses `PageHeader` (same as Stock and Firm) for title, description, and mode tabs in `actions`.
- **Layout:** `min-w-0 max-w-full space-y-4 sm:space-y-6` aligned with firm/stock listing pages.
- **Top control block:** Frosted `Card` (`rounded-2xl`, gradient, blur, shadow) matching `StockKPIs` / `FirmKPIs`.
- **Available / Scanned columns:** `TallyColumnShell` — KPI-style header (large total, optional weight line, status dot, icon in tinted `rounded-xl` box) plus scroll body on `bg-zinc-50/50`.
- **Line items:** `rounded-xl border border-zinc-200 bg-white` rows (aligned with stock table container styling); monospace tag on the right; dashed empty states when lists are empty.
- **Scanned rows:** Subtle `ring-emerald-100/60` to echo the emerald tally column without flat green headers.

## Why
- One visual language with Stock and Firm: `PageHeader`, frosted KPI cards, zinc borders, amber mode buttons.

## Notes
- File: `apps/inventory/app/(back-office)/stock-tally/rfid-barcode/page.tsx`.
- Form fields in the control card use `border-zinc-200` / `rounded-lg` where updated to match stock table chrome.
