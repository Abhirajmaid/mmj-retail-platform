# Mobile Responsiveness & Firm Form Updates

## What Changed

- **Back-office layout (navbar + main):** Navbar title and subtitle scale down on small screens (`text-xl` → `text-2xl` → `text-[30px]` on xl). Tighter padding on mobile (`py-3 px-4`), search and actions keep min touch height 44px. Main content uses `min-w-0` and responsive padding (`py-4 sm:py-6`, `px-4 sm:px-6`).
- **PageHeader (shared):** Smaller title on mobile (`text-2xl sm:text-3xl`), smaller “Workspace overview” label, actions row with `min-h-[44px]` and consistent gap.
- **Stock page:** Actions wrapped in a flex container with touch-friendly button height; table wrapped in `overflow-x-auto` with `min-w-[360px]` so it scrolls horizontally on narrow viewports.
- **Firm pages:** Listing uses responsive grid gap and spacing; Add/Edit use responsive card padding (`p-4 sm:p-6`). Form footer buttons stack vertically on mobile (full-width, 44px min height), row on larger screens.
- **Firm form:**
  - **Removed** the dark blue REMINDER vertical sidebar (“blue box”) so the form is full-width with no left margin.
  - **Required-fields note** is now hint-style: small muted text with an “i” style indicator: “Fields marked in **red** are required.” (red only on the word “red”), plus HELP button. Layout stacks on mobile.

## Why

- Improve usability on phones and narrow viewports (360px+) for Stock, Firm, and other back-office features.
- Remove the REMINDER box per user request and present required-fields as clear hint information instead of bold red text.

## Files Touched

- `packages/ui`: `navbar.tsx`, `page-header.tsx`, `dashboard-layout.tsx`
- `apps/inventory`: `app/(back-office)/stock/page.tsx`, `app/(back-office)/firm/page.tsx`, `app/(back-office)/firm/add/page.tsx`, `app/(back-office)/firm/edit/[id]/page.tsx`, `src/components/firm/FirmForm.tsx`
- `docs/firm-management.md` (notes), `docs/mobile-responsive-and-firm-form-updates.md` (this file)
