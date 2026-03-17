# Stock Transfer Table Layout (Image-Aligned)

## What Changed
- **Stock transfer list views** (List, Pending Approval, Approved, Return List) now use a layout aligned with the shared reference image.
- **Toolbar:** "Show [N] entries", "Search:" input, then right-aligned actions: Copy, Csv, Excel, JSON, Pdf, Print, Column visibility, Print selected.
- **Table header:** Two rows — (1) column titles (PROD ID, DATE, T.DATE, PREV FIRM, FIRM, TYPE, CATEGORY, NAME, HSN, QTY, GS WT, NT WT, PURITY, FN WT, FFN WT, STATUS, RETURN); (2) per-column search inputs with placeholders (e.g. "Search PROD", "Search DA", "Search PREV FIF").
- **First column:** Checkbox for row selection; header has "select all" checkbox. Supports "Print selected".
- **RETURN column:** Renamed from "RETURN/DEL". Shows an orange circle icon when the row is a return (`status === 'RETURN'` or `returnFlag`). Approve button (pending-approval) and Delete button (list) remain where applicable.
- **Pagination:** Previous, numbered page buttons (1, 2, …), Next. Current page highlighted (amber).
- **Footer:** "Showing X to Y of Z entries (filtered from N total entries)" and search note (MIN|MAX, VALUE|VALUE with PIPE).

## Where
- `apps/inventory/src/components/stock/transfer/StockTransferTable.tsx` — toolbar labels, column definitions and search placeholders, checkbox column, RETURN column behavior, pagination controls.
- List / Pending Approval / Approved / Return List pages unchanged; they already use `StockTransferTable`.
