# Firm / Branch Management Feature

## What Changed

- **New "Firm" section** in the Inventory app (back-office) for managing firms and branches.
- **Sidebar**: Added "Firm" between "Stock" and "Suppliers" with building icon.
- **Pages**:
  - **Firm listing** (`/firm`): Table and gallery view toggle, stats (Total / Active / Pending Review / Self Firms), "Add Firm" and "Toggle View" buttons. Banner when firm count is 2: "YOU CAN ADD ONLY 2 FIRMS!".
  - **Add Firm** (`/firm/add`): Full 3-column form (Firm/Company Details, Forms Details, Company Logo & uploads). All 40+ fields from the reference design, 5 image uploads, financial year dropdowns, CR toggle for cash balance. "Submit for Review" and "Save / Add Firm" actions.
  - **Edit Firm** (`/firm/edit/[id]`): Same form with pre-filled data; "Save / Update Firm" on submit.
  - **My Firms / Review** (`/firm/review`): Table of firms (Firm Name with avatar, Firm Type, Delete). Same max-2-firms banner. Delete from list.
- **Components**: `FirmCard`, `FirmTable`, `FirmForm`, `ImageUpload`, `FirmReviewCard` under `apps/inventory/src/components/firm/`.
- **State**: Zustand store `useFirmStore` in `apps/inventory/src/store/firm-store.ts` with `addFirm`, `updateFirm`, `deleteFirm`, `setFirms`, `getFirmById`, `canAddFirm`. Max 2 firms enforced in store.
- **Types**: `Firm` and related types in `apps/inventory/src/types/firm.ts`.

## Why

- Central place to manage multiple firms/branches (e.g. PP, RP, SR) with full company, forms, and logo/signature/QR image data.
- Aligns UI with the provided reference (3-column panel, HELP, required fields in red, Forms Details, Company Logo section). The REMINDER side tab was removed; required-fields note is shown as hint text (“Fields marked in red are required”) with an info-style indicator.
- Limit of 2 firms is enforced in UI and store with a clear warning banner.

## Styling

- Uses existing app theme: amber/orange accent (`#F59E0B`), navy primary, white cards, `rounded-xl`, section headers in `text-amber-600` uppercase. Required field labels in red. Review table header uses teal/cyan (`#0891B2`).
- Responsive: form stacks to one column below `lg`; card grid 1 col at 360px, 2+ at `sm`; table wrapped in `overflow-x-auto`; touch targets at least 44px; upload buttons full-width on small screens where applicable. Back-office layout (navbar, main content, Stock/Firm pages) uses responsive spacing, typography, and alignment (e.g. smaller titles and padding on mobile, stacked footer buttons on the firm form).

## Setup / Migration

- No backend or DB changes. Firm data lives in Zustand (in-memory). For persistence, wire `useFirmStore` to your API or local storage.
- **Dependency**: `zustand` was added to `apps/inventory/package.json`. Run `npm install` from repo root if needed.

## Follow-up

- Optional: persist firms (e.g. API, localStorage) and hydrate store on load.
- Optional: "Submit for Review" could set status to `pending_review` and only show those on the review page.
