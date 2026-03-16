# Stock Module Full Upgrade

## What Changed

### Main Stock Page (`/stock`)

- **Two-panel layout**: Left sidebar (desktop) lists unique product names with search; main area shows the stock table.
- **Product sidebar**: Fixed width `w-56`, "Products" header, search input that filters both the sidebar list and the main table. Each item shows product name, SKU, and total stock quantity (amber pill). Clicking an item scrolls to that product’s section in the table and highlights the group.
- **Mobile**: Sidebar becomes a horizontal scrollable chip row above the table.
- **Flat table**: One row per stock movement (item). Each row shows PRODUCT (name + SKU), MOVEMENT, LOCATION, STATUS, DATE, QUANTITY. No grouping or expand/collapse; 100 movements = 100 rows. Pagination (15 per page) with Previous/Next and “Showing 1–15 of N” when applicable. Table styling matches the Firm table (white card, header row, “Showing X results”).
- **Filter bar**: Movement type (All | Inbound | Outbound | Transfer) and product search, plus a dedicated **Filter** circular button that opens a Stock filter modal with From/To date filters (matching the Firm filter UX). Summary stats row: Total Movements, Total Inbound, Total Outbound, Total Pending.
- **Tabs UI alignment**: Stock movement filter pills and top search controls now use the same rounded amber tab styling and search input treatment as the Firm list tabs for visual consistency, including the circular action buttons (Add, filter, column visibility) and the Export pill on the right.
- **Add Stock** button now links to `/stock/add` instead of opening a modal.

### Add Stock Page (`/stock/add`)

- **UI aligned with Add New Firm**: Breadcrumbs (Dashboard > Stock > Add Stock), PageHeader with title, description, and HELP button. No single wrapper card; each tab uses the same card-based layout as the firm form (cards with icon, title, subtitle; same input styling and Cancel/Submit footer).
- **Single page, 5 tabs in bar**: Fine Stock, Raw Metal Stock, Crystal Stock, Stock Reports, Other Options (dropdown). Tab bar uses amber background and sliding pill indicator.
- **Fine Stock tab**: Card 1 — Bill/header (date, firm, metal/rate, product code, brand, counter, gender, photos, barcode, hallmark, mfg date) + RETAIL STOCK. Card 2 — Product & item details (category/weights/purity grid, DETAILS/STONE, VALUATION/TOT LAB/FINAL AMT, optional stone row). Required-fields note; Cancel + Submit footer; review card with ADD STOCK/Delete per row. (Imitation: same with “Imitation” section title.)
- **Raw Metal Stock tab**: Card 1 — Bill/header. Card 2 — Metal details (type, qty, weights, purity, taxes). Same footer and review pattern.
- **Crystal Stock tab**: Card 1 — Bill/header + RETAIL STOCK. Card 2 — Crystal details (name, size, color, tax, qty/weights/rates). Cancel, Purchase on Cash, Submit; same review pattern.
- **Stock Reports tab**: Single card with icon, Export CSV and Print in header, read-only StockTable in body.
- **Other Options**: Dropdown-style card with 6 options (Stock Setting, Stock Master, Stock Transfer, Discount Option, Setup Option, Multiple Stock Delete). Selecting an option shows a “Coming Soon” placeholder panel.

### New / Modified Files

- `apps/inventory/src/types/stock.ts` — All stock TypeScript types (MovementType, StockStatus, StockTab, MetalType, StoneDetail, FineStockEntry, RawMetalEntry, CrystalEntry, constants).
- `apps/inventory/src/store/stock-store.ts` — Zustand slices: `useFineStockStore`, `useRawMetalStore`, `useCrystalStore` (pendingEntries, confirmedEntries, addPending, confirmEntry, deletePending); `createEmptyStoneDetail` helper.
- `apps/inventory/src/components/stock/StockProductSidebar.tsx` — Left product navigator with search; `variant="sidebar"` (desktop) or `variant="chips"` (mobile).
- `apps/inventory/src/components/stock/StockTable.tsx` — Flat table (one row per movement), filter bar, pagination, Firm-like header and styling.
- `apps/inventory/src/components/stock/StockFilterModal.tsx` — Modal for From/To date filters, mirroring the Firm filter UX, opened via the Filter button in the Stock top bar.
- `apps/inventory/src/components/stock/StockStoneRow.tsx` — Inline expandable stone detail grid (crystal ID/name, clarity, color, cert, lab, size, shape, qty, weights, rates, valuation, ➕/🗑️).
- `apps/inventory/src/components/stock/tabs/FineStockTab.tsx` — Fine/Imitation form and review table.
- `apps/inventory/src/components/stock/tabs/RawMetalStockTab.tsx` — Raw metal form and review table.
- `apps/inventory/src/components/stock/tabs/CrystalStockTab.tsx` — Crystal form and review table.
- `apps/inventory/src/components/stock/tabs/StockReportsTab.tsx` — Reuses StockTable read-only with Export/Print.
- `apps/inventory/src/components/stock/tabs/OtherOptionsTab.tsx` — Options list and placeholder panel.
- `apps/inventory/app/(back-office)/stock/page.tsx` — Upgraded with sidebar + StockTable and link to `/stock/add`.
- `apps/inventory/app/(back-office)/stock/add/page.tsx` — New Add Stock page with 6-tab bar and tab content.

## Why

- Improve navigation and discovery of stock by product on the main page.
- Support multiple stock entry types (fine/imitation, raw metal, crystal) and a single Add Stock entry point with tabs.
- Align with reference UX: grouped table, filters, review-before-add flow, and Other Options menu.

## Setup / Migration

- No env or DB migration required. Uses existing `useStockMovements()` and shared types; new Zustand stores are client-only.
- Add Stock is now a dedicated route: ensure nav or buttons point to `/stock/add`.

## Follow-up

- Wire Remove Stock and Transfer Stock buttons (e.g. modals or `/stock/remove`, `/stock/transfer`).
- Implement Export CSV and Print in Stock Reports tab.
- Implement Other Options actions (e.g. Stock Transfer, Discount Option) when ready.
- Optional: persist pending review entries (e.g. localStorage) so they survive tab switch or refresh.
