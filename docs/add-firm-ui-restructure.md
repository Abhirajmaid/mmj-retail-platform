# Add Firm Page UI Restructure

## What Changed
- **Reusable PageHeader** (`packages/ui`): New reusable page header with optional `breadcrumbs`, `title`, `description`, and right-side `actions`. Styled like the CRM reference: white card with shadow, breadcrumbs above title, subtitle below, actions on the right. Exported `BreadcrumbItem` type. No longer shows a hardcoded "Workspace overview" so each page controls its own header.
- **Add Firm page** (`/firm/add`): Uses `PageHeader` with `breadcrumbs` (Dashboard > Firm > Add New), title "Add New Firm", description, and HELP in `actions`. Breadcrumbs and HELP are no longer duplicated in the form.
- **FirmForm**: Restructured into four section cards similar to the CRM reference:
  1. **Company Information** (Building icon) – Basic firm details: Firm ID, Registration No, Shop Name, description, address, city, pincode, phone, email, website, My Firms, comments, geo, social links.
  2. **Forms & Banking** (FileText icon) – SMTP, e-Invoice, payment bank details, financial year, cash balance, GSTIN, PAN, principal amounts, form header/footer.
  3. **Documents & Media** (Image icon) – Form left image, right logo, right image, owner signature, QR code uploads.
  4. **Firm Status** (Clipboard icon) – Firm type and status dropdowns.
- Footer actions: Cancel with left arrow (left), Submit for Review and Create Firm with right arrow (right, primary orange).
- Form submit payload now includes `status` from the new Firm Status card.

## Why
- Align add-firm page with the reference CRM “Add New Lead Company” layout: breadcrumbs, clear page title/subtitle, and form grouped into titled cards with icons and short descriptions.
- Improves scannability and matches the requested UI structure.

## Setup / Migration
- None. Existing form fields and submit behavior are unchanged; only layout and grouping changed.
