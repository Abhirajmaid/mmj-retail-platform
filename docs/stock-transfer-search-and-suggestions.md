# Stock Transfer: Search Selection & Suggestion Position

## What Changed
- **Left white box:** Selected item from search now always appears in the left panel (full details). Previously, selection was ignored when source/destination firms were not set, so the box stayed empty.
- **Suggestions position:** Search suggestions dropdown now opens **above** the search bar instead of below (`bottom-full mb-1`).
- **Add-to-transfer hint:** When an item is selected but firms are missing, the left panel shows a short hint that source firm (top bar) and destination (SELECT FIRM) must be chosen to add the item to the transfer.

## Why
- Users expect the selected product to show in the left box regardless of firm selection; adding to the transfer can still require both firms.
- Suggestions above the search bar improve visibility and match the requested layout.

## Where
- `apps/inventory/src/components/stock/transfer/StockTransferForm.tsx` – `handleSelectItem` sets `selectedItemForDetails` first, then adds to draft only when both firms are set; passes `showAddHint`.
- `apps/inventory/src/components/stock/transfer/ProductBarcodeSearch.tsx` – dropdown positioning; optional `showAddHint` and hint message in left panel.
