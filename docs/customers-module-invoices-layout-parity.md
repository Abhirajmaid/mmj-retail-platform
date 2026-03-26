# Customers Module Invoices Layout Parity

## What Changed
- Updated `apps/billing/app/(pos)/customers/page.tsx` to match invoices list structure:
  - same style `PageHeader` action area
  - KPI cards row (`KpiCard`)
  - stock/invoices-style tabs + search + utility actions bar
  - row-click navigation to single detail page
  - removed per-row `Action` column for visual parity
- Redesigned `apps/billing/app/(pos)/customers/[id]/page.tsx` with invoices-like single-detail layout:
  - header actions: `Back`, `Edit`, `Delete`
  - card-based detail sections
  - stock-style readonly field rendering
  - bottom primary action strip
- Updated `apps/billing/app/(pos)/customers/new/page.tsx` to a full-page stock/invoices-style create flow:
  - breadcrumbs + help action
  - card sections with stock-like fields
  - footer actions (`Cancel`, `Create Customer`)
- Updated `apps/billing/app/(pos)/customers/[id]/edit/page.tsx` to invoices-like edit page layout:
  - card sections with stock-like field classes
  - footer actions (`Cancel`, `Save changes`)

## Why
- Maintain UI and route-flow consistency across billing modules by matching the invoices module pattern for list/detail/create/edit experiences.
