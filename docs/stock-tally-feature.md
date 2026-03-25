# Stock Tally Feature

## What Changed

- **Sidebar**: Added a new "Stock Tally" item below "Stock" in the inventory back-office sidebar. It uses a grid-style icon (LayoutGrid) and links to `/stock-tally`. The item stays active when on any `/stock-tally/*` route.
- **Stock Tally landing** (`/stock-tally`): Now directly renders the **RFID / Barcode Stock Tally** UI (no extra “click card” step). The same interface is implemented under `/stock-tally/rfid-barcode`.
- **RFID / Barcode Stock Tally panel** (`/stock-tally/rfid-barcode`): A full daily physical verification tool with:
  - **Consistent UI bar**: The mode pills (TALLY WITH IMAGES/TABLES/RFID/MULTI BARCODE) now use the same “active options” tab-bar pattern as `stock/add` (sticky white card + amber active pill).
  - **Mode tabs**: TALLY WITH IMAGES, TALLY WITH TABLES, STOCK TALLY WITH RFID, STOCK TALLY WITH MULTI BARCODE. Switching tabs changes the content area only; Counter Name, Location Name, and item category are preserved.
  - **Shared controls**: MANUALLY toggle (blue when on), OPEN STOCK (green), CLOSE STOCK (red), Counter Name, Location Name, item category autocomplete (Chain, Ring, Sahajew, etc.), RESET (red), REPORT (teal).
  - **RFID / Multi Barcode modes**: Large textarea for tags (RFID or multi barcode). Left panel "AVAILABLE" and right panel "SCANNED" with totals and weight; items move from left to right as tags are entered. Category filter narrows the available list.
- **Top control UI consistency**: The header controls (Counter/Location inputs, item filter inputs, items-per-page input, BACK/refresh buttons) now use `@jewellery-retail/ui` `Input`/`Label`/`Button` primitives for consistent styling with `stock/add`.
- **Top control theme**: The MANUALLY switch now shows an off/on icon on the knob; the category dropdown trigger + the `RESET`/`REPORT` buttons use the navy blue theme (`#1E3A8A`). (The `BACK` button was removed.)
- **Fields styling**: Counter/Location and related filter inputs now use the same label + native input styling as `stock/add` to match the reference UI.
  - **Tally With Images**: Filter by Item Category, Item Name, Item Id; RESET, items-per-page (30) with refresh, BACK. Split panel with image cards: left "NON TALLY STOCK" (amber background), right "TALLY STOCK" (white). Click a card to move it to the other side.
  - **Tally With Tables**: Same filters and RESET/per-page/BACK. Two data tables with export toolbar (Copy, CSV, Excel, JSON, PDF, Print, Column Visibility, Print Selected), per-column search row, red totals row (QTY, GS WT, NT WT, FN WT), and green plus icon on the left table to move a row to the right.
- **Tables UI**: Updated the `TALLY WITH TABLES` panel toolbar to a styled secondary bar (rounded-xl, white card, shadow — matching the suppliers secondary bar). Search and rows-per-page sit on the left; all export/action options (Copy, CSV, Excel, JSON, PDF, Print, Column Visibility, Print Selected) are collapsed into a single **Actions** `DropdownMenu` on the right (same amber-highlight pattern as the supplier sort dropdown).
- **Tables filters**: Updated the `TALLY WITH TABLES` per-column search header to match the supplier detail page field styling (label + 44px rounded search input boxes).
- **Clean tally cards**: Updated the `AVAILABLE` / `TALLY` card shell to use `@jewellery-retail/ui` `CardHeader`/`CardBody` with a cleaner white design (less gradient/backdrop styling) for consistent look.
- **Category dropdown fix**: Made the category selector use a native `<select>` styled like `stock/add` / supplier forms for consistent, “reference-image” dropdown behavior.
- **REMINDER**: A vertical "REMINDER" tab on the left edge of the RFID/Barcode page, matching the existing pattern for reminder panels.
- **Responsive**: On small viewports the top controls stack vertically; the four mode tabs scroll horizontally; the bottom split panel stacks (AVAILABLE on top, SCANNED below).

## Why

- Support daily physical stock verification for jewellers: reconcile physical stock with system records using images, tables, RFID, or barcode scanning from a single panel.

## Setup / Follow-up

- No migration required. Stock tally uses in-memory store (`stockTallyStore`) and mock item data; replace with API-backed available items and optional persistence when backend endpoints exist.
- Styling reuses existing app tokens: navy `#1E3A8A`, amber `#F59E0B`, white cards, same border radius and shadows as Stock Transfer and dashboard.
