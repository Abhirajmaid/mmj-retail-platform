# Add Supplier page (Add Stock alignment)

## What changed

- `apps/inventory/app/(back-office)/suppliers/add/page.tsx` now mirrors `stock/add/page.tsx`:
  - `PageHeader` + HELP action
  - sticky white tab bar (amber active, zinc inactive)
  - tab-driven content rendering (single section at a time)
- `AddSupplierForm` now accepts `activeTab` and renders only that section, while keeping the same field set, validation, and submit actions.

## Why

- Makes Add Supplier visually and structurally consistent with Add Stock for a cleaner, more maintainable UI.

## Files

- `apps/inventory/app/(back-office)/suppliers/add/page.tsx`
- `apps/inventory/src/components/suppliers/AddSupplierForm.tsx`
