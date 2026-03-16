# Stock Module Full Upgrade

## What Changed

### Main Stock Page (`/stock`)

- **Two-panel layout**: Left sidebar (desktop) lists unique product names with search; main area shows the stock table.
- **Product sidebar**: Fixed width `w-56`, "Products" header, search input that filters both the sidebar list and the main table. Each item shows product name, SKU, and total stock quantity (amber pill). Clicking an item scrolls to that product’s section in the table and highlights the group.
- **Mobile**: Sidebar becomes a horizontal scrollable chip row above the table.
- **Grouped table**: Movements grouped by product with collapsible group header rows (amber/cream background, product name + SKU + total qty + chevron). All groups expanded by default.
- **Filter bar**: Movement type (All | Inbound | Outbound | Transfer), status (All | Completed | Pending), and date range (From → To). Summary stats row: Total Movements, Total Inbound, Total Outbound, Total Pending.
- **Add Stock** button now links to `/stock/add` instead of opening a modal.

### Add Stock Page (`/stock/add`)

- **Single page, 6 tabs**: Fine Stock, Imitation Stock, Raw Metal Stock, Crystal Stock, Stock Reports, Other Options. Tab bar is sticky, amber background (`bg-amber-400/90`). Switching tabs only changes content below; no route change.
- **Fine Stock tab**: Header row (Bill Date, Firm, Metal/Rate, Product Code, Brand/Seller, Counter, Gender BIS, Img/Photos), secondary row (Barcode, Hallmark UID, MFG Date), product detail row (Category through MKG CHRG), second detail row with DETAILS and STONE buttons. **VALUATION**, **TOT LAB**, and **FINAL AMT** are editable number inputs (placeholders show computed values from ntWt/metalRate and lbrChrg/mkgChrg; user can override). STONE button toggles an inline **Stone Detail Row** (crystal columns, ➕/🗑️ for multiple stones). Bottom actions: ADD STOCK, EXISTING ITEM, PURCHASE ON CASH, HALLMARKING, HELP, SUBMIT. On SUBMIT, entries go to a **pending review table** below the form; user must click ADD on each row to confirm adding to stock.
- **Imitation Stock tab**: Same as Fine Stock with "Imitation" section label.
- **Raw Metal Stock tab**: Bill Date, Firm, Brand/Seller; metal details table (Gold/Raw Gold rows, weights, purity, taxes). Single SUBMIT; same review-then-ADD pattern.
- **Crystal Stock tab**: Bill Date, Firm, Item ID, Brand/Seller, Gender, Images; crystal details table. ADD STOCK, PURCHASE ON CASH, SUBMIT; same review pattern.
- **Stock Reports tab**: Read-only table same as main stock page (grouped, same columns and filter bar), plus Export CSV and Print.
- **Other Options tab**: Dropdown-style card with 6 options (Stock Setting, Stock Master, Stock Transfer, Discount Option, Setup Option, Multiple Stock Delete). Selecting an option shows a “Coming Soon” placeholder panel.

### New / Modified Files

- `apps/inventory/src/types/stock.ts` — All stock TypeScript types (MovementType, StockStatus, StockTab, MetalType, StoneDetail, FineStockEntry, RawMetalEntry, CrystalEntry, constants).
- `apps/inventory/src/store/stock-store.ts` — Zustand slices: `useFineStockStore`, `useRawMetalStore`, `useCrystalStore` (pendingEntries, confirmedEntries, addPending, confirmEntry, deletePending); `createEmptyStoneDetail` helper.
- `apps/inventory/src/components/stock/StockProductSidebar.tsx` — Left product navigator with search; `variant="sidebar"` (desktop) or `variant="chips"` (mobile).
- `apps/inventory/src/components/stock/StockTable.tsx` — Grouped, collapsible table with filter bar and summary stats.
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
