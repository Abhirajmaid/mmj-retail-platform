# Purchase Order Detail + Approve Pages

## What Changed
- Added PO single-details page: `apps/inventory/app/(back-office)/purchase-orders/[id]/page.tsx`.
  - Uses the same 4-card “single page details” layout style as `suppliers/[id]/page.tsx`.
  - Header includes `Back`, `Approve`, `Edit`, and `Delete` actions (approve navigates to the approve route).
- Added PO approve confirmation page: `apps/inventory/app/(back-office)/purchase-orders/approve/[id]/page.tsx`.
  - Shows PO + supplier context and an `Approve PO` CTA.
- Added PO approve inbox page: `apps/inventory/app/(back-office)/purchase-orders/approve/page.tsx`.
  - Renders only today’s non-approved POs by PO number; clicking opens the confirmation page.
- Updated PO list table rows (`apps/inventory/app/(back-office)/purchase-orders/page.tsx`) to be clickable and open the PO detail page.

## Notes
- Approval is UI-only (no dedicated backend endpoint in this repo); it shows a toast and navigates back to the PO detail page.

