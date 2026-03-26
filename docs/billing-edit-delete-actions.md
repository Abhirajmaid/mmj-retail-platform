# Billing: Edit & Delete on Customers and Invoices

## What changed

- **Customers list** (`/customers`): New **Action** column with **Edit** (pencil) and **Delete** (trash). Edit goes to `/customers/[id]/edit`; Delete opens a small popover below the icon with “Want to delete?” and **Yes** / **Cancel**.
- **Invoices list** (`/invoices`): **Action** column now includes **Edit** and **Delete** (same popover) in addition to **Download**.
- **Customer edit page** (`/customers/[id]/edit`): Same form fields as “Create New Customer”, pre-filled from the selected customer. Save redirects to the customer profile.
- **Invoice edit page** (`/invoices/[id]/edit`): Same fields as create (customer name, amount, due date) plus status. Pre-filled from the selected invoice. Save redirects to the invoice detail.
- **Customer detail** (`/customers/[id]`): **Edit** and **Delete** buttons next to the status badge. Delete redirects to `/customers?deleted=id` so the list hides that row.
- **Invoice detail** (`/invoices/[id]`): **Edit** and **Delete** next to the status badge. Delete redirects to `/invoices?deleted=id` so the list hides that row.

Delete is in-memory only (no API): list pages keep a `deletedIds` set and filter them out; detail-page delete passes `?deleted=id` so the list can add that id to the set.

## Files touched

- `apps/billing/src/components/DeleteConfirmPopover.tsx` — New: dropdown with “Want to delete?” / Yes / Cancel.
- `apps/billing/app/(pos)/customers/page.tsx` — Action column, deletedIds, Edit link, DeleteConfirmPopover.
- `apps/billing/app/(pos)/invoices/page.tsx` — deletedIds, Edit link, DeleteConfirmPopover, `?deleted=` sync.
- `apps/billing/app/(pos)/customers/[id]/page.tsx` — Edit link, Delete button with redirect.
- `apps/billing/app/(pos)/customers/[id]/edit/page.tsx` — New: edit form (same as new customer).
- `apps/billing/app/(pos)/invoices/[id]/page.tsx` — Edit link, Delete with redirect to list with `?deleted=`.
- `apps/billing/app/(pos)/invoices/[id]/edit/page.tsx` — New: edit form (customer, amount, due date, status).

## Follow-up UI Alignment

- Invoices page top bar was aligned with stock page header layout:
  - page container now uses `min-w-0 space-y-4 sm:space-y-6`
  - `PageHeader` actions now use the same wrapper structure (`flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3`)
  - `Create invoice` action now uses `Button` `variant="primary"` like stock page header actions.
