# Products toolbar (stock bar alignment)

## What changed

- **`StockKPIs`** (same **`KpiCard`** tiles from `@jewellery-retail/ui` as the stock page) sits **above** the products toolbar: Total SKUs, Active, Low stock, Out of stock.
- Products uses the same **`StockTabs`** bar as the stock page: **status tabs** on the left (All / Active / Low stock / Out of stock with counts), **search + circular actions + Export** on the right.
- **`StockTabs`** now accepts **string tab keys** and an optional **`searchPlaceholder`** (default matches stock: “Search by product name…”); search field styling is unified with `Input` from `@jewellery-retail/ui`.
- Navbar global search icon spacing now matches stock/search toolbar rhythm (`left-3` icon and `pl-10` input padding) for visual consistency across back-office pages.
- Navbar global search input now also matches stock/search toolbar styling (`h-10`, `rounded-xl`, `border-zinc-200`, `shadow-md`, amber focus ring) so top-bar and stock-bar search fields are visually consistent.
- Navbar notification icon button now matches stock toolbar circular action controls (`h-10 w-10`, `rounded-full`, `border-zinc-200`, `shadow-md`, and zinc icon tone with subtle hover).
- **Product catalog table** follows the dashboard “Recent stock updates” block: `section` + `CardTitle` + subtitle, **Showing N** (and **of M** when filters/search apply), bordered `overflow-x-auto` shell, `Table` with `table-fixed` + column widths, row/cell padding and typography aligned with the dashboard data grid.

## Files

- `apps/inventory/app/(back-office)/products/page.tsx`
- `apps/inventory/src/components/stock/StockTabs.tsx`
- `apps/inventory/src/components/stock/StockTable.tsx` (`onTabChange` typing)
