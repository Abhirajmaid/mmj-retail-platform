# Subscriptions Module Invoices Layout Parity

## What Changed
- Updated `apps/billing/app/(pos)/subscriptions/page.tsx` to match invoices list page structure:
  - header action with `Create subscription`
  - KPI row (`KpiCard`) for totals and key metrics
  - stock/invoices-style tabs + search + utility control bar
  - row-click navigation to single detail page
- Added single detail page: `apps/billing/app/(pos)/subscriptions/[id]/page.tsx`
  - header actions (`Back`, `Edit`, `Delete`) and status badge
  - card-based detail sections with stock-style readonly fields
  - bottom primary action strip
- Added edit page: `apps/billing/app/(pos)/subscriptions/[id]/edit/page.tsx`
  - invoices-style edit layout with card sections and stock-like fields
  - footer actions (`Cancel`, `Save changes`)
- Added create page: `apps/billing/app/(pos)/subscriptions/new/page.tsx`
  - full-page stock/invoices-style create flow
  - breadcrumbs + help action + card sections + footer actions

## Why
- Keep subscriptions UX consistent with invoices/payments/customers pattern across list/detail/create/edit flows.

## Notes
- Delete behavior is currently URL-driven (`/subscriptions?deleted=id`) for UI parity.
- Create/Edit actions are UI-level navigation flows and can be wired to API persistence next.
