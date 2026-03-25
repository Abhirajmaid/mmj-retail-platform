# Purchase Order Create Page

## What Changed
- Added `/apps/inventory/app/(back-office)/purchase-orders/add/page.tsx` to create a PO using the same single-page 4-card form layout style as `suppliers/add`.
- Added `apps/inventory/src/components/purchase-orders/AddPurchaseOrderForm.tsx` (form UI + sticky footer: `Cancel`, `Save as Draft`, `Create PO`).
- Updated the PO list page `/apps/inventory/app/(back-office)/purchase-orders/page.tsx` so the `Create PO` button navigates to `/purchase-orders/add`.

## Notes
- The current PO submit flow is UI-only (no dedicated backend endpoint in this repo). After submit, the page navigates back to `/purchase-orders` with a toast.

