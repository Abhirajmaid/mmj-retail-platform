# Billing Dashboard Redesign (MMJ Jewelry)

## What Changed

- **Customer search & details bar** — Toggle above fields: **Customers** | **Invoice**. Customers: Row 1 — First name, Last name, Mr/Mrs, Gender, Mobile, Email; Row 2 — Aadhaar, Address, Pincode, City, State, SI. Invoice: Row 1 — Invoice number, Customer name, Status, Amount, Issued from/to; Row 2 — Due from/to, Payment method, Reference, Notes, Items. Same 2×6 layout and right-side actions (HOME, SELL, LOAN, UDHAAR) for both; only the form fields switch. Customer results or invoice results show below based on mode. Hint text updates by mode.
- **Customer search behavior** — Results list appears only when the user types in any search field. Clicking a result navigates to `/billing/customers/[id]`. When no customer is found, a “No customer found” message is shown with two buttons: “Create New Customer” (blue outlined) and “Create New Bill” (orange filled).
- **Customer profile page** — New page at `/billing/customers/[id]` showing customer name, status, email, phone, city, lifetime spend, outstanding balance, segment badge, and purchase history.
- **Create New Customer** — New page at `/billing/customers/new` with full customer form (name, mobile, alternate phone, father/spouse name, gender, DOB, address, city, state, pincode, country, GST, PAN, Aadhaar, email, user type, firm assignment) and an action tab bar (Home, Sell, Loan, Udhaar). No billing table until a bill is started from the profile.
- **Create New Bill** — New page at `/billing/bills/new` with customer identification row, product/return barcode search with GO buttons, billing header row (Bill date, Customer name, Billing name, Invoice number, Firm name, Account, Sale executive, Sale month), and line item table (Metal, Category, Name, Product code, Qty, Gross/Packet/Net/Tag weight, Purity, WST, Fine purchase, Value per gram, Fine weight, CGST/SGST/IGST, Price, Total). SUBMIT creates the bill and redirects to Invoices.
- **Billing overview card** — Replaced previous “Total balance handled this month” content with a **Gold and Silver rate** card: two stacked rows (Gold, Silver), each with rate per 10 gm, percentage change (green/red), and a small SVG sparkline. Placeholder rates: Gold ₹95,000, Silver ₹97,335. Navy background and existing card styling retained.
- **Merged revenue card** — Replaced the three separate cards (Collected today, Monthly revenue, Total revenue) with a single card and a dropdown: Today | Monthly | Total. The main amount and trend badge update with a subtle transition when the option changes.
- **Right panel** — Removed Active customers, Customer health, Growth rate, and Transactions cards. Only the **Pending invoices** card remains on the right column.
- **Customer Growth chart** — Kept in the right column with the same line chart (orange/amber) and title “Customer Growth” / “New and retained customer growth by month.”
- **Bottom section** — **Recent transactions** table removed. Only the **Monthly Revenue** bar chart remains, full width, with title “Monthly Revenue” and subtitle “Six-month revenue trend.”
- **Button colors** — Primary actions use solid orange/amber (`bg-amber-500`). Secondary/navigation use blue (primary token or outline). Destructive/cancel use outline only. Invoices page “Create invoice” and “Save invoice” use amber; dashboard “Create New Customer” uses blue outline and “Create New Bill” uses orange filled.

## Why

- Align the billing dashboard with the legacy jewelry billing workflow: customer lookup first, then create customer or create bill.
- Surface gold/silver rates in the main overview for daily pricing.
- Simplify the right side and bottom to reduce clutter and focus on revenue, pending invoices, and customer growth.
- Unify primary/secondary button usage (blue and orange/amber only) across the billing app.

## Setup / migration

- No env or DB migration. Metal rates are in-app state with defaults; replace with API when available.
- New routes: `(pos)/customers/[id]`, `(pos)/customers/new`, `(pos)/bills/new`. No sidebar entry for “Bills”; “Create New Bill” is reached from the dashboard no-results state and from the Create New Customer action bar.

## Follow-up

- Wire Create New Bill submit to the invoices API or shared state so new bills appear in the Invoices list immediately.
- Wire Create New Customer submit to the customers API and redirect to the new customer profile.
- Replace placeholder metal rates with live data (store or API).
- Optional: add “Create New Bill” link on the Invoices page for quick access.

## UI Consistency Update

- Billing dashboard revenue period selector now uses shared `DropdownMenu` from `@jewellery-retail/ui` instead of native `<select>` for consistent dropdown behavior and styling.
- Pending invoices now uses shared `StatCard` from `@jewellery-retail/ui` (local duplicate card removed).
- Monthly revenue section was aligned to shared card structure using `CardHeader` + `CardBody` from `@jewellery-retail/ui` so chart containers follow the same layout system as other modules.

## Dashboard Visual Alignment Follow-up

- Revenue period control was restyled to a native chevron select matching the upper metal-rate dropdown interaction and appearance.
- Monthly revenue chart was updated to visually match inventory’s stock valuation trend style:
  - Same card title pattern (`CardTitle` + subtitle)
  - Removed right-side live badge
  - Removed extra bar category gap for wider bars
  - Updated bar fill to amber (`#f59e0b`)
- Revenue period select field now uses the same stock add field styling pattern (gray border, rounded-lg, amber focus ring/border, min 44px height) for consistency with `apps/inventory/app/(back-office)/stock/add/page.tsx`.
- Metal-rate card dropdowns (`10 gm`, `24k`) now also use stock-add-style field treatment (light field, gray border, rounded corners, amber focus ring/border) for consistent dropdown styling across billing dashboard controls.
- Pending invoices card now uses shared `KpiCard` styling (same icon tile, typography, and footer-dot layout as inventory KPI cards) to match inventory dashboard card design.
