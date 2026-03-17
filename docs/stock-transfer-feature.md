# Stock Transfer Feature (Firm-to-Firm)

## What Changed

- **Stock Transfer** system for firm-to-firm transfers with approval workflow, lists, report, and history.
- New routes under `/stock/transfer`: form, list, pending-approval, approved, return-list, report, history.
- New components in `apps/inventory/src/components/stock/transfer/`: `FirmSelectorBar`, `StockTransferDropdown`, `TransferOptionsBar`, `ProductBarcodeSearch`, `TransferSummaryRow`, `StockTransferTable`, `StockTransferForm`, `GoldStockListTable`.
- Types in `src/types/stockTransfer.ts` and Zustand store in `src/store/stockTransferStore.ts`.
- Main Stock page: "Transfer stock" button now links to `/stock/transfer`; Transfer movements show a "Transfer" badge and are clickable to open the transfer list.
- Other Options dropdown (on Add Stock page): "Stock transfer" links to `/stock/transfer`.
- Fine Stock tab (Add Stock): "ALL GOLD STOCK LIST" button shows Gold Stock List table with « BACK.

## Why

- Support firm-to-firm stock transfers with voucher numbering (VO3/VO4), counter and staff selection, product search by ID/barcode/RFID, and approval workflow.
- Central place for pending approvals, approved list, return list, report, and audit history.
- Align UI with reference designs (navy `#1E3A8A`, amber `#F59E0B`, white cards, transfer-specific colors for counter/staff/firm).

## Setup / Migration

- No env or DB migration required. Transfer data is in-memory (Zustand) for now; can be replaced with API persistence later.
- Navigate to **Stock** → **Transfer stock** or **Stock** → (Add stock) **Other options** → **Stock transfer**.

## UX: Product search and GO button

- Items are added to the left “selected products” box **only** when the user clicks **GO** (or presses Enter) after searching. Clicking a suggestion in the dropdown only selects that row and closes the list; the user must click GO to add it.

## Follow-up Notes

- Counter and staff options are mock lists; wire to real APIs when available.
- Product search (barcode/ID) currently adds mock line items; integrate with product API for real lookup.
- Export buttons (Copy, CSV, Excel, PDF, etc.) on list/report are UI-only; implement export logic as needed.
- Gold Stock List uses mock data; connect to fine stock API for live data.
