# Suppliers page header (stock alignment)

## What changed

- **Page shell** uses `min-w-0 space-y-4 sm:space-y-6` like the stock page.
- **Search** in `PageHeader` `actions` uses `@jewellery-retail/ui` **`Input`** with the same treatment as **`StockTabs`** (search icon, `rounded-xl`, `shadow-md`, amber focus / `focus-visible` ring).
- **Add Supplier** uses **`Button variant="primary"`** + **`asChild`** + **`Link`**, matching stock primary actions (no ad-hoc `bg-amber-500` classes).

## Files

- `apps/inventory/app/(back-office)/suppliers/page.tsx`
