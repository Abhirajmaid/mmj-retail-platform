# Billing Reports Inventory Analytics Alignment

## What Changed
- Refactored `apps/billing/app/(pos)/reports/page.tsx` to follow the same structural UI composition as `apps/inventory/app/(back-office)/analytics/page.tsx`.
- Switched reports page to shared `@jewellery-retail/ui` building blocks:
  - `PageHeader`
  - `KpiCard`
  - `Card`, `CardHeader`, `CardBody`, `CardTitle`
  - `Table` family components
  - `Badge` for plan count chips
- Added analytics-style KPI row (4 cards) for billing metrics.
- Rebuilt middle section into two analytics cards:
  - Revenue trend chart (area chart)
  - Plan distribution card-list panel
- Replaced old pie + progress section with an analytics-style bottom data card:
  - Customer growth table with month, growth value, and mapped revenue

## Why
- Keep reports page visual language and component usage consistent with inventory analytics.
- Standardize chart + KPI + data-card composition across dashboard analytics screens.
