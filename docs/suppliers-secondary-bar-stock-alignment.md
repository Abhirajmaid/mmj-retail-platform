# Suppliers secondary bar (stock bar + dropdowns)

## What changed

- **Shell** matches **`StockTabs`**: `rounded-xl bg-white px-4 py-3 shadow-md`, row layout with tabs left and sort right.
- **Type filters**: **All Types**, **Gold Supplier**, and **Silver Supplier** stay as primary tabs (same pill classes as stock: `rounded-xl`, amber active + `shadow-lg`, zinc hover).
- **Diamond**, **Stone**, and **Other** moved into a **“More types”** menu using `@jewellery-retail/ui` **`DropdownMenu`** (Radix). Panel styling mirrors **Add Stock → Other options** (`rounded-xl`, `border-zinc-100`, soft shadow, `hover:bg-amber-50` items). Trigger shows the selected more-type label when active.
- **Right controls** now mirror stock bar tools: search input, add (+), filter, column visibility, **Sort by** dropdown, and **Export** button.
- **Suppliers page** now includes a KPI row above this bar using the stock/firm style cards (`StockKPIs` + `KpiCard`): Total suppliers, Active, Pending, and Fulfilment risk.

## Data

- `SuppliersFilterBar.tsx` exports **`SUPPLIER_PRIMARY_TYPE_TABS`**, **`SUPPLIER_MORE_TYPE_OPTIONS`**, and keeps **`SUPPLIER_TYPE_OPTIONS`** as the combined list for label lookup.

## Files

- `apps/inventory/src/components/suppliers/SuppliersSecondaryBar.tsx`
- `apps/inventory/src/components/suppliers/SuppliersFilterBar.tsx`
- `apps/inventory/app/(back-office)/suppliers/page.tsx`
