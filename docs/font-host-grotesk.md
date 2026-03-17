# Font update: Host Grotesk

## What changed
- **Inventory** and **Billing** apps now use **Host Grotesk** (Google Fonts) as the primary UI font.
- **Storefront** is unchanged and continues to use Open Sans.

## Why
- Unified typography across MMJ back-office and POS apps; storefront keeps its own font for brand separation.

## Details
- Font is loaded via `next/font/google` (Host_Grotesk) in each app’s root `layout.jsx`.
- `globals.css` in inventory and billing was updated so the `body` font-family fallback is `"Host Grotesk", sans-serif`.

## Setup / follow-up
- No extra setup. Rebuild or run dev for inventory/billing to see the new font.
- Storefront was intentionally not modified.
