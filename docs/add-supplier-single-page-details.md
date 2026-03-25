# Add Supplier Single Page Details

## What Changed
- Updated `AddSupplierForm` to render all sections (`Supplier`, `Contact`, `Bank`, and `Performance`) on a single add-supplier page.
- Removed tab-based conditional rendering for section cards, so every detail component is visible in one continuous form.
- Removed the section tab bar from `apps/inventory/app/(back-office)/suppliers/add/page.tsx`.
- Kept existing form fields, validation, submit actions, and footer actions unchanged.

## Why
- The add supplier flow now requires all details to be visible together instead of split by section tabs.

## Notes
- `activeTab` is still accepted as a prop for compatibility, but it no longer controls which section is rendered.
