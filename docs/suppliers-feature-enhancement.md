# Suppliers Feature Enhancement

## What Changed

### 1. Secondary filter bar (below primary tab bar)
- Added a second horizontal bar below the existing-style tab bar on the Suppliers page.
- **Left:** Supplier type filter pills (All Types, Gold Supplier, Diamond Supplier, Silver Supplier, Stone Supplier, Other). One active at a time; active uses filled amber, inactive use plain text with amber hover. Pills scroll horizontally on mobile (360px) without wrapping.
- **Right:** “Sort By” dropdown: Name, City, On-time Rate, Open Orders. Filtering by type and sorting apply immediately to the supplier card list (no reload).

### 2. Delete on Supplier Detail panel
- Added a trash/delete icon in the top-right of the Supplier Detail (right) panel header.
- Icon is gray by default, red with light red background on hover.
- Clicking opens a confirmation modal: “Are you sure you want to delete [Supplier Name]? This action cannot be undone.” with Cancel (outlined) and Delete (solid red).
- On confirm: supplier is removed from the list, detail panel clears to empty, and a success toast “Supplier deleted successfully.” is shown. Uses the existing `Modal` from `@jewellery-retail/ui`.

### 3. Add Supplier form page (`/suppliers/add`)
- The [+] button in the primary filter bar links to `/suppliers/add`.
- Full-page form (not a modal):
  - **Header:** “← Back to Suppliers” link to `/suppliers`, title “Add New Supplier”, subtitle “Fill in the supplier details to add them to your network.”
  - **Section 1 — Supplier Information:** Supplier Name* (required), Supplier Type dropdown (Gold/Diamond/Silver/Stone/Other), Business Registration Number, GST Number, PAN Number, Status pills (Active / Inactive / Pending).
  - **Section 2 — Contact & Location:** Contact Person* (required), Phone* (required, Indian format), Alternate Phone, Email, Website URL, City* (required), State (Indian states dropdown), Pincode (6 digits), Full Address textarea.
  - **Section 3 — Bank & Payment Details:** Bank Name, Account Number, IFSC Code (auto-uppercased), Payment Terms (Immediate / Net 15 / Net 30 / Net 45 / Net 60), Credit Limit (₹), Currency (default INR).
  - **Section 4 — Performance & Catalog:** Metal Types Supplied (multi-select pills: Gold, Silver, Diamond, Platinum, Stone, Other), Item Categories (multi-select pills: Ring, Chain, Necklace, etc.), On-time Rate %, Lead Time (days), Minimum Order Value (₹), Notes textarea.
- **Validation:** Name, Contact Person, Phone, City required; GST Indian format if provided; Pincode 6 digits if provided; phone must be valid. Inline errors in small red text below fields on submit.
- **Footer:** Sticky bar with Cancel (navigates to `/suppliers`), “Save as Draft” (amber outlined, sets status Pending), “Add Supplier” (amber filled, sets status Active).
- After successful submit: redirect to `/suppliers`, toast “Supplier added successfully”, and the new supplier is auto-selected in the list with details in the right panel (via `sessionStorage` handoff).

### Supporting changes
- **Types:** `Supplier` now has optional `supplierType` and `status` extended with `"inactive"`. New `SupplierType`: gold, diamond, silver, stone, other.
- **Mock data:** `mockSuppliers` updated with `supplierType` and optional `status: "inactive"` for filtering.
- **Toast:** `ToastProvider` and `useToast` exported from `@jewellery-retail/ui` and wrapped around the back-office layout so delete and add success toasts work.
- **Suppliers list state:** Delete is implemented with a local “deleted IDs” set; add is implemented by storing the new supplier in `sessionStorage` and merging it into the list on load, then selecting it.

## Why

- Improve discoverability and control with type and sort filters.
- Allow safe removal of suppliers with confirmation and feedback.
- Provide a dedicated, validated flow to add suppliers and see them immediately in the list.

## Setup / migration

- No env or DB changes. Uses existing UI components (Modal, Button, Input, Card, etc.) and design tokens (navy `#1E3A8A`, amber `#F59E0B`).
- Mobile breakpoint for horizontal scroll of type pills: 360px min-width.

## Follow-up

- If suppliers are later persisted via API, replace local delete/add and `sessionStorage` with API calls and refresh or optimistic updates.
