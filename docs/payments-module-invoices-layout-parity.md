# Payments Module Invoices Layout Parity

## What Changed
- Updated `apps/billing/app/(pos)/payments/page.tsx` to match invoices list layout pattern:
  - stock-style `PageHeader` actions
  - KPI card row (`KpiCard`)
  - stock-style filter/search/action bar (tabs + search + plus/filter/eye/export)
  - table row navigation to single detail pages
- Added single payment detail page: `apps/billing/app/(pos)/payments/[id]/page.tsx`
  - stock-add style `PageHeader` with `Back`, `Edit`, `Delete`
  - card-based detail sections and amount summary
  - print/download action parity with invoice detail flow
- Added edit page: `apps/billing/app/(pos)/payments/[id]/edit/page.tsx`
  - stock-style card sections and field treatments
  - footer actions matching invoice edit layout
- Added create page: `apps/billing/app/(pos)/payments/new/page.tsx`
  - full-page stock-add style create flow with breadcrumbs and help action
  - card sections + stock-like fields + footer actions
- Payments list `Create payment` and plus toolbar action now route to `/payments/new`.

## Why
- Keep payments UI behavior and visual hierarchy consistent with invoices module.
- Provide full route parity for list/detail/edit/create flows in payments.

## Notes
- `Delete` is currently URL-driven (`/payments?deleted=id`) as a UI-level behavior.
- Create/Edit submit actions currently navigate to list/detail without API persistence updates.
