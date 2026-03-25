# Navbar: brand card removal and UI primitives

## What changed

- Removed the right-hand navbar card (logo + app title/subtitle). Brand copy remains on the **sidebar** via `DashboardLayout`’s `brand` prop.
- Replaced raw `<input>` and `<button>` with **`Input`** and **`Button`** from `packages/ui`.
- Dropped the `brand` prop from **`Navbar`**; `DashboardLayout` no longer passes it to the navbar.

## Why

- Simpler top bar aligned with the requested layout (search + notifications only).
- Consistent use of shared UI components for form controls and actions.

## Files

- `packages/ui/src/components/navbar.tsx`
- `packages/ui/src/layouts/dashboard-layout.tsx`
