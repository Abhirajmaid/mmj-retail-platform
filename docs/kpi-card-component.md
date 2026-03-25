# KpiCard (`packages/ui`)

## What

- New **`KpiCard`** in `@jewellery-retail/ui`: frosted gradient tile, metric title/value, footer line with colored dot, and right icon slot — same look as the stock dashboard KPI tiles.
- **`StockKPIs`** (`apps/inventory/.../StockKPIs.tsx`) now renders **`KpiCard`** and supports optional **`displayTitle`** / **`footer`** on each stat for non–movement copy.

## Why

- One shared primitive for stock-style KPIs; inventory dashboard uses the same component instead of `StatCard`.

## Usage

```tsx
import { KpiCard } from "@jewellery-retail/ui";

<KpiCard
  title="Open purchase orders"
  value={3}
  footer="Awaiting supplier fulfillment"
  icon={ShoppingCart}
  color="bg-amber-50"
  borderColor="border-amber-200"
  iconColor="text-amber-600"
/>
```

`value` may be a `string` (e.g. formatted currency).
