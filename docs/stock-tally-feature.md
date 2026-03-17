# Stock Tally Feature

## What Changed

- **Sidebar**: Added a new "Stock Tally" item below "Stock" in the inventory back-office sidebar. It uses a grid-style icon (LayoutGrid) and links to `/stock-tally`. The item stays active when on any `/stock-tally/*` route.
- **Stock Tally landing** (`/stock-tally`): A single entry card titled "RFID / Barcode Stock Tally" with subtitle "Stock Tally by RFID / Barcode." Clicking the card navigates to `/stock-tally/rfid-barcode`.
- **RFID / Barcode Stock Tally panel** (`/stock-tally/rfid-barcode`): A full daily physical verification tool with:
  - **Mode tabs**: TALLY WITH IMAGES, TALLY WITH TABLES, STOCK TALLY WITH RFID, STOCK TALLY WITH MULTI BARCODE. Switching tabs changes the content area only; Counter Name, Location Name, and item category are preserved.
  - **Shared controls**: MANUALLY toggle (blue when on), OPEN STOCK (green), CLOSE STOCK (red), Counter Name, Location Name, item category autocomplete (Chain, Ring, Sahajew, etc.), RESET (red), REPORT (teal).
  - **RFID / Multi Barcode modes**: Large textarea for tags (RFID or multi barcode). Left panel "AVAILABLE" and right panel "SCANNED" with totals and weight; items move from left to right as tags are entered. Category filter narrows the available list.
  - **Tally With Images**: Filter by Item Category, Item Name, Item Id; RESET, items-per-page (30) with refresh, BACK. Split panel with image cards: left "NON TALLY STOCK" (amber background), right "TALLY STOCK" (white). Click a card to move it to the other side.
  - **Tally With Tables**: Same filters and RESET/per-page/BACK. Two data tables with export toolbar (Copy, CSV, Excel, JSON, PDF, Print, Column Visibility, Print Selected), per-column search row, red totals row (QTY, GS WT, NT WT, FN WT), and green plus icon on the left table to move a row to the right.
- **REMINDER**: A vertical "REMINDER" tab on the left edge of the RFID/Barcode page, matching the existing pattern for reminder panels.
- **Responsive**: On small viewports the top controls stack vertically; the four mode tabs scroll horizontally; the bottom split panel stacks (AVAILABLE on top, SCANNED below).

## Why

- Support daily physical stock verification for jewellers: reconcile physical stock with system records using images, tables, RFID, or barcode scanning from a single panel.

## Setup / Follow-up

- No migration required. Stock tally uses in-memory store (`stockTallyStore`) and mock item data; replace with API-backed available items and optional persistence when backend endpoints exist.
- Styling reuses existing app tokens: navy `#1E3A8A`, amber `#F59E0B`, white cards, same border radius and shadows as Stock Transfer and dashboard.
