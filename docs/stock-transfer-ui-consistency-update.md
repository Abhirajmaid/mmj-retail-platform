# Stock Transfer UI Consistency Update

## What changed

- Updated `ProductBarcodeSearch` to use shared `@jewellery-retail/ui` primitives (`Card`, `Input`, `Button`) with inventory-consistent spacing, borders, shadows, and focus states.
- Reworked the transfer search field to match stock-page search styling: search icon placement, rounded input shape, neutral border, shadow, and amber focus treatment.
- Refined the suggestion dropdown surface and selection state to align with current back-office visual language.
- Updated `TransferSummaryRow` containers with card-like sections and corrected copy from "TRANSFERING" to "Transferring".
- Updated transfer form actions (`Cancel`, `Save transfer`, `Submit for approval`) to use consistent casing, heights, radii, and neutral/amber action hierarchy.
- Adjusted transfer section containers to match the reference surface style: rounded corners, no outer border, and more visible drop shadows for the search panel, summary panel, and transfer-options header.
- Removed the divider line above transfer footer actions and aligned `Save transfer` styling to match `Submit for approval` for a consistent primary-action treatment.
- Stock transfer list page header now uses shared `PageHeader` (removed orange left accent marker next to title).
- Replaced list toolbar with a stock-style compact bar: search input + filter icon popover (for rows-per-page), keeping only necessary controls for list view.
- Added stock-like status tabs to the transfer list toolbar (`All`, `Draft`, `Pending`, `Approved`, `Return`) with counts and tab-based filtering, while retaining only list-relevant controls.
- Restyled the transfer list data table to mirror stock page data-grid treatment (rounded bordered shell, horizontal scroll wrapper, cleaner header typography, row spacing, and empty-state readability) while preserving transfer-specific columns and actions.
- Updated Stock Transfer sub-pages (`Pending approval`, `Approved`, `Return`, `History`, `Report`) to use the same shared `PageHeader` layout and stock-style toolbar/table surfaces as `Stock Transfer List` for consistent back-office UI.
- Removed the `Stock Transfer History` page route and navigation item, since this page is no longer needed.
- Updated `StockTransferDropdown` menu surface to show all remaining options without internal scroll clipping.
- Replaced transfer-list status tabs (`All`, `Draft`, `Pending`, `Approved`, `Return`) with a `From`/`To` date range bar + `Go` action, aligned with the Stock Transfer Report filter style.
- Added date-range filtering on transfer list rows using transfer date (fallback to row date) when the `Go` action is applied.
- Removed list-toolbar utility controls (`Filter` icon and `Export` dropdown) so the bar mirrors the cleaner Stock Transfer Report pattern.
- Updated the transfer-list date/search toolbar container to a raised card surface (`bg-white` + `shadow-md`) to match other back-office bars.

## Why

- The transfer page looked visually outdated compared to the stock/dashboard screens.
- Shared component styling creates a more cohesive experience and lowers future maintenance effort.

## Files

- `apps/inventory/src/components/stock/transfer/ProductBarcodeSearch.tsx`
- `apps/inventory/src/components/stock/transfer/TransferSummaryRow.tsx`
- `apps/inventory/src/components/stock/transfer/StockTransferForm.tsx`
- `apps/inventory/src/components/stock/transfer/StockTransferTable.tsx`
