# Invoice Create Page Stock-Add Style

## What Changed
- Added a new dedicated create invoice route at `apps/billing/app/(pos)/invoices/new/page.tsx`.
- Built the page using stock-add style structure:
  - `PageHeader` with breadcrumbs and Help action
  - informational helper line
  - card-based form sections with icon headers
  - stock-like field styling (`inputClass` / `selectClass`)
  - footer action row with `Cancel` and amber primary submit
- Updated invoices listing page `apps/billing/app/(pos)/invoices/page.tsx`:
  - `Create invoice` header button now navigates to `/invoices/new`
  - plus action in the stock-style control bar now navigates to `/invoices/new`
  - removed old modal-based create invoice flow

## Why
- Match invoice creation experience with the same visual workflow style used by stock add pages.
- Move create invoice from modal to full-page flow for consistency and better extensibility.

## Notes
- Current create action is UI-level and returns to invoices list after submit.
- API persistence can be wired in the next step using the same form model.
