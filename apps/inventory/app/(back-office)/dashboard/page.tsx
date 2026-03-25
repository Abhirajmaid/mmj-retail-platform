"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Boxes, IndianRupee, Package, Search, ShoppingCart } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useInventory } from "@jewellery-retail/hooks";
import {
  Badge,
  Card,
  CardTitle,
  Input,
  KpiCard,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, formatCompactNumber, formatCurrency } from "@jewellery-retail/utils";

function getStatusBadgeVariant(
  status: string
): "default" | "success" | "warning" | "danger" | "info" {
  if (status === "completed") return "success";
  if (status === "pending") return "warning";
  if (status === "cancelled") return "danger";
  return "default";
}

export default function InventoryDashboardPage() {
  const router = useRouter();
  const { data } = useInventory();
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();
  const filteredUpdates = query
    ? data.recentStockUpdates.filter(
        (m) =>
          m.productName.toLowerCase().includes(query) ||
          m.sku.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query) ||
          m.productId.toLowerCase().includes(query)
      )
    : data.recentStockUpdates;

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Dashboard"
        description="Monitor inventory valuation, purchase orders, and recent stock movements from one place."
      />

      <div className="relative w-full max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="search"
          placeholder="Search by product name, SKU, or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 rounded-xl border border-zinc-200 bg-white py-0 pl-10 pr-4 text-zinc-900 shadow-md placeholder:text-zinc-400 focus:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        <Card
          padding="none"
          className="overflow-hidden border-0 p-7 text-white shadow-[0_28px_56px_-34px_rgba(23,54,132,0.55)]"
          style={{ backgroundColor: "#173684" }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <Badge className="border-transparent bg-white text-[#173684] shadow-none" variant="default">
                Inventory overview
              </Badge>
              <div>
                <p className="text-sm text-white/70">Current stock valuation</p>
                <p className="mt-2 text-4xl font-semibold text-white">{formatCurrency(data.stockValue)}</p>
              </div>
              <p className="max-w-xl text-sm leading-6 text-white/70">
                Monitor product movement, replenishment signals, and valuation trends from this control center.
              </p>
            </div>
            <div className="shrink-0 rounded-[24px] border border-white/10 bg-white/10 px-5 py-4 shadow-none sm:max-w-[11rem]">
              <p className="text-xs uppercase tracking-[0.22em] text-white/55">Low stock</p>
              <p className="mt-2 text-2xl font-semibold text-white">{data.lowStockItems}</p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <KpiCard
            title="Open purchase orders"
            value={data.openPurchaseOrders}
            footer="Awaiting supplier fulfillment"
            icon={ShoppingCart}
            color="bg-amber-50"
            borderColor="border-amber-200"
            iconColor="text-amber-600"
          />
          <KpiCard
            title="Active SKUs"
            value={data.totalProducts}
            footer="Catalog stable across categories"
            icon={Boxes}
            color="bg-emerald-50"
            borderColor="border-emerald-200"
            iconColor="text-emerald-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Low stock items"
          value={data.lowStockItems}
          footer="Needs replenishment soon"
          icon={AlertTriangle}
          color="bg-yellow-50"
          borderColor="border-yellow-200"
          iconColor="text-yellow-600"
        />
        <KpiCard
          title="Stock value"
          value={formatCurrency(data.stockValue)}
          footer="Current inventory valuation"
          icon={IndianRupee}
          color="bg-amber-50"
          borderColor="border-amber-200"
          iconColor="text-amber-600"
        />
        <KpiCard
          title="Recent movements"
          value={data.recentStockUpdates.length}
          footer="Inbound, outbound, and transfer logs"
          icon={Package}
          color="bg-blue-50"
          borderColor="border-blue-200"
          iconColor="text-blue-600"
        />
      </div>

      <Card>
        <div className="mb-5 space-y-1">
          <CardTitle>Stock valuation trend</CardTitle>
          <p className="text-sm text-zinc-500">Track the month-by-month value held in inventory.</p>
        </div>
        <div className="h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.stockValueSeries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatCompactNumber(value)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <section className="min-w-0" aria-labelledby="recent-stock-updates-heading">
        <div className="mb-5 space-y-1">
          <CardTitle id="recent-stock-updates-heading">Recent stock updates</CardTitle>
          <p className="text-sm text-zinc-500">Latest inbound, outbound, and transfer activity.</p>
        </div>
        <div className="min-w-0 space-y-4">
          <p className="text-sm text-zinc-500">
            Showing{" "}
            <strong>{filteredUpdates.length}</strong>
            {query ? (
              <>
                {" "}
                of <strong>{data.recentStockUpdates.length}</strong>
              </>
            ) : null}{" "}
            result{filteredUpdates.length !== 1 ? "s" : ""}
          </p>
          <div className="min-w-0 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
            <Table className="min-w-[1000px] table-fixed">
              <TableHead>
                <TableRow>
                  <TableHeader className="w-[28%] min-w-0">PRODUCT</TableHeader>
                  <TableHeader className="w-[14%] min-w-0">MOVEMENT</TableHeader>
                  <TableHeader className="w-[20%] min-w-0">LOCATION</TableHeader>
                  <TableHeader className="w-[14%] min-w-0">STATUS</TableHeader>
                  <TableHeader className="w-[14%] min-w-0">DATE</TableHeader>
                  <TableHeader className="w-[10%] min-w-0 text-right">QUANTITY</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUpdates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-zinc-500">
                      No stock movements match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUpdates.map((movement) => {
                    const isTransfer = movement.type === "transfer";
                    return (
                      <TableRow
                        key={movement.id}
                        className="border-b border-zinc-100 bg-white"
                        onClick={isTransfer ? () => router.push("/stock/transfer/list") : undefined}
                        role={isTransfer ? "button" : undefined}
                        style={isTransfer ? { cursor: "pointer" } : undefined}
                      >
                        <TableCell className="py-2 pl-4 min-w-0">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-zinc-900" title={movement.productName}>
                              {movement.productName}
                            </p>
                            <p className="truncate text-xs text-zinc-500" title={movement.sku}>
                              {movement.sku}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-left text-sm text-zinc-700">
                          {isTransfer ? (
                            <Badge variant="info">Transfer</Badge>
                          ) : (
                            <span className="capitalize">{movement.type}</span>
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-left text-sm text-zinc-700 truncate" title={movement.location}>
                          {movement.location}
                        </TableCell>
                        <TableCell className="py-2 text-left">
                          <Badge variant={getStatusBadgeVariant(movement.status)}>{movement.status}</Badge>
                        </TableCell>
                        <TableCell className="py-2 text-left text-sm text-zinc-700">
                          {dateFormat(movement.updatedAt)}
                        </TableCell>
                        <TableCell className="py-2 text-right text-sm font-medium text-zinc-900">
                          {movement.quantity}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
}
