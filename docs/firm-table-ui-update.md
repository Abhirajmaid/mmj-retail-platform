# Firm Table UI Update

## What Changed

- **Table view** on `/firm` (when “Table View” is selected) was redesigned to match the reference companies-dashboard style and the [lead-companies](https://github.com/Abhirajmaid/xtrawrkx_suits/blob/master/xtrawrkx-crm-portal/src/app/sales/lead-companies/page.jsx) shared structure.
- **Filter tabs** above the table: “All Firms”, “Active”, “Pending”, “Inactive”, each with counts. Active tab uses amber highlight.
- **Search** bar filters by shop name, firm ID, email, phone, registration number, or GSTIN.
- **“Showing X results”** line below filters/search.
- **Table columns** (config-driven): COMPANY, PRIMARY CONTACT, STATUS, FIRM TYPE, REG NO, GSTIN, ACTIONS — same content as before, now defined in a reusable column config.
- **Pagination**: 15 items per page with Previous/Next and “Page X of Y”; row click navigates to edit.
- **Export** button in the toolbar; optional `onExport` prop on `FirmTable` to wire CSV/export (e.g. pass filtered firms).
- **Shared component layout** (similar to lead-companies):
  - `firmTableColumns.tsx` — column config (`getFirmTableColumns(onDelete)`), status helpers, `FilterTab` type.
  - `FirmTabs.tsx` — filter tabs + search + export (reusable bar).
  - `FirmListView.tsx` — table from column config + pagination + row click + empty state.
  - `FirmTable.tsx` — composes tabs, “Showing X results”, list view; holds filter/search/page state and passes columns + paginated data.
- Empty state when filters return no rows: “No firms match the current filters.”

## Why

- Align firm list UX with the reference layout and with the lead-companies pattern: config-driven columns, separate Tabs and ListView, pagination, and optional export.

## Where

- `apps/inventory/src/components/firm/firmTableColumns.tsx` — column definitions and shared helpers.
- `apps/inventory/src/components/firm/FirmTabs.tsx` — tabs + search + export.
- `apps/inventory/src/components/firm/FirmListView.tsx` — table + pagination + row click.
- `apps/inventory/src/components/firm/FirmTable.tsx` — composition and state.
- `/firm` page uses FirmKPIs and passes `activeView`/`onViewChange`/`onAddClick` to FirmTable.

## xtrawrkx alignment (lead-companies components)

Firm components were updated to mirror [xtrawrkx lead-companies/components](https://github.com/Abhirajmaid/xtrawrkx_suits/tree/master/xtrawrkx-crm-portal/src/app/sales/lead-companies/components):

| Firm | xtrawrkx |
|------|----------|
| FirmKPIs | LeadsKPIs (stat cards with icon, count, subtitle) |
| FirmTabs | LeadsTabs (tabs, search, Add, List/Grid, Filter, Column visibility, Export) |
| FirmFilterModal | LeadsFilterModal (Status, Firm Type; Apply/Clear/Cancel) |
| ColumnVisibilityModal | ColumnVisibilityModal (toggle columns, Reset, Close) |
| FirmListView | LeadsListView (table + empty state with Clear Search / Add CTA) |

- **Column visibility** is persisted in `localStorage` key `firmTableColumnVisibility`.
- **Filter modal** applies status and firmType; combined with tab and search in FirmTable.
