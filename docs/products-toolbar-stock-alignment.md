# Products toolbar (stock bar alignment)

## What changed

- **`StockKPIs`** (same **`KpiCard`** tiles from `@jewellery-retail/ui` as the stock page) sits **above** the products toolbar: Total SKUs, Active, Low stock, Out of stock.
- Products uses the same **`StockTabs`** bar as the stock page: **status tabs** on the left (All / Active / Low stock / Out of stock with counts), **search + circular actions + Export** on the right.
- **`StockTabs`** now accepts **string tab keys** and an optional **`searchPlaceholder`** (default matches stock: “Search by product name…”); search field styling is unified with `Input` from `@jewellery-retail/ui`.
- **Product catalog table** follows the dashboard “Recent stock updates” block: `section` + `CardTitle` + subtitle, **Showing N** (and **of M** when filters/search apply), bordered `overflow-x-auto` shell, `Table` with `table-fixed` + column widths, row/cell padding and typography aligned with the dashboard data grid.

## Files

- `apps/inventory/app/(back-office)/products/page.tsx`
- `apps/inventory/src/components/stock/StockTabs.tsx`
- `apps/inventory/src/components/stock/StockTable.tsx` (`onTabChange` typing)
