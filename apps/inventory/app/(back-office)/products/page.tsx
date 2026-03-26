"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Package, PackageX, PencilLine } from "lucide-react";

import type { Product } from "@jewellery-retail/types";
import { useProducts } from "@jewellery-retail/hooks";
import { StockKPIs } from "@/src/components/stock/StockKPIs";
import { StockTabs } from "@/src/components/stock/StockTabs";
import {
  Badge,
  Button,
  CardTitle,
  Input,
  Modal,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { formatCurrency, statusColor } from "@jewellery-retail/utils";

export default function ProductsPage() {
  const { data } = useProducts();
  const products = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown }).data)
      ? ((data as { data: Product[] }).data ?? [])
      : [];
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = `${product.name} ${product.sku} ${product.category}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus = statusFilter === "all" || product.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [products, query, statusFilter]
  );

  const { totalCount, activeCount, lowStockCount, outOfStockCount } = useMemo(() => {
    let active = 0;
    let low = 0;
    let out = 0;
    for (const p of products) {
      if (p.status === "active") active += 1;
      else if (p.status === "low") low += 1;
      else if (p.status === "out_of_stock") out += 1;
    }
    return {
      totalCount: products.length,
      activeCount: active,
      lowStockCount: low,
      outOfStockCount: out,
    };
  }, [products]);

  const productTabItems = useMemo(
    () => [
      { key: "all", label: "All", count: totalCount },
      { key: "active", label: "Active", count: activeCount },
      { key: "low", label: "Low stock", count: lowStockCount },
      { key: "out_of_stock", label: "Out of stock", count: outOfStockCount },
    ],
    [totalCount, activeCount, lowStockCount, outOfStockCount]
  );

  const productKpiStats = useMemo(
    () => [
      {
        label: "total",
        count: totalCount,
        icon: Package,
        color: "bg-amber-50",
        borderColor: "border-amber-200",
        iconColor: "text-amber-600",
        displayTitle: "Total SKUs",
        footer:
          totalCount === 0
            ? "No products yet"
            : `${totalCount} ${totalCount === 1 ? "product" : "products"} in catalog`,
      },
      {
        label: "active",
        count: activeCount,
        icon: CheckCircle2,
        color: "bg-emerald-50",
        borderColor: "border-emerald-200",
        iconColor: "text-emerald-600",
        displayTitle: "Active",
        footer:
          activeCount === 0
            ? "No active listings"
            : `${activeCount} ${activeCount === 1 ? "listing" : "listings"} ready to sell`,
      },
      {
        label: "low",
        count: lowStockCount,
        icon: AlertTriangle,
        color: "bg-yellow-50",
        borderColor: "border-yellow-200",
        iconColor: "text-yellow-600",
        displayTitle: "Low stock",
        footer:
          lowStockCount === 0
            ? "All SKUs above threshold"
            : `${lowStockCount} need${lowStockCount === 1 ? "s" : ""} replenishment`,
      },
      {
        label: "out",
        count: outOfStockCount,
        icon: PackageX,
        color: "bg-red-50",
        borderColor: "border-red-200",
        iconColor: "text-red-600",
        displayTitle: "Out of stock",
        footer:
          outOfStockCount === 0
            ? "No zero-stock SKUs"
            : `${outOfStockCount} unavailable ${outOfStockCount === 1 ? "SKU" : "SKUs"}`,
      },
    ],
    [totalCount, activeCount, lowStockCount, outOfStockCount]
  );

  const hasActiveFilter = statusFilter !== "all" || query.trim().length > 0;

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Products"
        description="Search, filter, and maintain your product catalog from one shared inventory view."
      />

      <StockKPIs statusStats={productKpiStats} />

      <StockTabs
        tabItems={productTabItems}
        activeTab={statusFilter}
        onTabChange={setStatusFilter}
        searchQuery={query}
        onSearchChange={setQuery}
        onAddClick={() => {}}
        onFilterClick={() => {}}
        onColumnVisibilityClick={() => {}}
        onExportClick={() => {}}
      />

      <section className="min-w-0" aria-labelledby="products-catalog-heading">
        <div className="min-w-0 space-y-4">
          <p className="text-sm text-zinc-500">
            Showing{" "}
            <strong>{filteredProducts.length}</strong>
            {hasActiveFilter ? (
              <>
                {" "}
                of <strong>{products.length}</strong>
              </>
            ) : null}{" "}
            result{filteredProducts.length !== 1 ? "s" : ""}
          </p>
          <div className="min-w-0 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
            <Table className="min-w-[1100px] table-fixed">
              <TableHead>
                <TableRow>
                  <TableHeader className="w-[24%] min-w-0">PRODUCT</TableHeader>
                  <TableHeader className="w-[12%] min-w-0">CATEGORY</TableHeader>
                  <TableHeader className="w-[18%] min-w-0">SUPPLIER</TableHeader>
                  <TableHeader className="w-[12%] min-w-0">STATUS</TableHeader>
                  <TableHeader className="w-[8%] min-w-0">STOCK</TableHeader>
                  <TableHeader className="w-[12%] min-w-0 text-right">PRICE</TableHeader>
                  <TableHeader className="w-[14%] min-w-0 text-right">ACTION</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-zinc-500">
                      No products match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-b border-zinc-100 bg-white">
                      <TableCell className="py-2 pl-4 min-w-0">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-900" title={product.name}>
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-zinc-500" title={product.sku}>
                            {product.sku}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-left text-sm text-zinc-700 truncate" title={product.category}>
                        {product.category}
                      </TableCell>
                      <TableCell className="py-2 text-left text-sm text-zinc-700 truncate" title={product.supplier}>
                        {product.supplier}
                      </TableCell>
                      <TableCell className="py-2 text-left">
                        <Badge variant={statusColor(product.status)}>
                          {product.status.replaceAll("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-left text-sm font-medium text-zinc-900">{product.stock}</TableCell>
                      <TableCell className="py-2 text-right text-sm font-medium text-zinc-900">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell className="py-2 pr-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-600 hover:text-zinc-900"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <PencilLine className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <Modal
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct ? `Edit ${selectedProduct.name}` : "Edit product"}
      >
        {selectedProduct ? (
          <div className="grid gap-4">
            <Input label="Name" defaultValue={selectedProduct.name} />
            <Input label="SKU" defaultValue={selectedProduct.sku} />
            <Input label="Price" type="number" defaultValue={selectedProduct.price} />
            <Input label="Stock" type="number" defaultValue={selectedProduct.stock} />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Cancel
              </Button>
              <Button onClick={() => setSelectedProduct(null)}>Save changes</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
