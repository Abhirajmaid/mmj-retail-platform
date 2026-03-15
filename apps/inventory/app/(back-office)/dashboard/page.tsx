"use client";

import { useState } from "react";
import { AlertTriangle, Boxes, IndianRupee, Search, ShoppingCart } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useInventory } from "@jewellery-retail/hooks";
import {
  Badge,
  Card,
  Input,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, formatCompactNumber, formatCurrency, statusColor } from "@jewellery-retail/utils";

export default function InventoryDashboardPage() {
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
    <div className="space-y-6">
      <div className="relative mr-auto w-full max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="search"
          placeholder="Search by product name, SKU, or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 rounded-lg border-zinc-200 bg-white pl-10 pr-4 shadow-sm"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Card
          className="overflow-hidden border-0 p-7 text-white shadow-[0_28px_56px_-34px_rgba(23,54,132,0.55)]"
          style={{ backgroundColor: "#173684" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <Badge className="border-transparent bg-white text-[#173684] shadow-none" variant="default">
                Inventory overview
              </Badge>
              <div>
                <p className="text-sm text-white/70">Current stock valuation</p>
                <p className="mt-2 text-4xl font-semibold text-white">{formatCurrency(data.stockValue)}</p>
              </div>
              <p className="max-w-xl text-sm leading-6 text-white/70">
                Monitor product movement, inventory concentration, and replenishment signals from one polished back-office control center.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 px-5 py-4 shadow-none">
              <p className="text-xs uppercase tracking-[0.22em] text-white/55">Low stock</p>
              <p className="mt-2 text-2xl font-semibold text-white">{data.lowStockItems}</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Open purchase orders</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">{data.openPurchaseOrders}</p>
            <p className="mt-2 text-sm text-zinc-500">Awaiting supplier fulfillment</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Recent updates</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">{data.recentStockUpdates.length}</p>
            <p className="mt-2 text-sm text-zinc-500">Inbound, outbound, and transfer logs</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Active SKUs</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">{data.totalProducts}</p>
            <p className="mt-2 text-sm text-emerald-600">Catalog health remains stable</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Category groups</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">{data.categoryBreakdown.length}</p>
            <p className="mt-2 text-sm text-zinc-500">Balanced across rings, chains, and more</p>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total products"
          value={String(data.totalProducts)}
          description="Active SKUs"
          icon={Boxes}
        />
        <StatCard
          title="Low stock items"
          value={String(data.lowStockItems)}
          description="Needs replenishment soon"
          icon={AlertTriangle}
        />
        <StatCard
          title="Stock value"
          value={formatCurrency(data.stockValue)}
          description="Current inventory valuation"
          icon={IndianRupee}
        />
        <StatCard
          title="Open purchase orders"
          value={String(data.openPurchaseOrders)}
          description="Pending supplier fulfilment"
          icon={ShoppingCart}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-zinc-950">Stock valuation trend</h2>
            <p className="text-sm text-zinc-500">Track the month-by-month value held in inventory.</p>
          </div>
          <div className="h-80">
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

        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-zinc-950">Category mix</h2>
            <p className="text-sm text-zinc-500">Current stock concentration by category.</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.categoryBreakdown} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} fill="#18181b" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">Recent stock updates</h2>
            <p className="text-sm text-zinc-500">Latest inbound, outbound, and transfer activity.</p>
          </div>
          <Badge variant="info">
            {filteredUpdates.length}
            {query ? ` of ${data.recentStockUpdates.length}` : ""} movements
          </Badge>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Product</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader className="text-right">Quantity</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUpdates.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-zinc-950">{movement.productName}</p>
                    <p className="text-xs text-zinc-500">{movement.sku}</p>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{movement.type}</TableCell>
                <TableCell>{movement.location}</TableCell>
                <TableCell>
                  <Badge variant={statusColor(movement.status)}>{movement.status}</Badge>
                </TableCell>
                <TableCell>{dateFormat(movement.updatedAt)}</TableCell>
                <TableCell className="text-right font-medium text-zinc-950">{movement.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
