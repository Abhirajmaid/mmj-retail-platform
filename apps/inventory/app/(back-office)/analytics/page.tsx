"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useInventoryAnalytics } from "@jewellery-retail/hooks";
import {
  Badge,
  Card,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { formatCompactNumber, formatCurrency, statusColor } from "@jewellery-retail/utils";

export default function AnalyticsPage() {
  const { data } = useInventoryAnalytics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Stock valuation, top sellers, and low inventory alerts for faster replenishment decisions."
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-zinc-950">Stock valuation</h2>
            <p className="text-sm text-zinc-500">Rolling inventory value over the past six months.</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.stockValuationSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatCompactNumber(value)} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Area type="monotone" dataKey="value" stroke="#18181b" fill="#18181b" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-zinc-950">Low inventory alerts</h2>
            <p className="text-sm text-zinc-500">Prioritise SKUs that need urgent replenishment.</p>
          </div>
          <div className="space-y-3">
            {data.lowInventoryAlerts.map((product) => (
              <div key={product.id} className="rounded-2xl border border-zinc-200 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-950">{product.name}</p>
                    <p className="text-sm text-zinc-500">{product.sku}</p>
                  </div>
                  <Badge variant={statusColor(product.status)}>{product.status.replaceAll("_", " ")}</Badge>
                </div>
                <p className="mt-3 text-sm text-zinc-600">
                  {product.stock} units left at {product.location}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-zinc-950">Top selling items</h2>
          <p className="text-sm text-zinc-500">Best-performing SKUs by volume and revenue.</p>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Item</TableHeader>
              <TableHeader>Units sold</TableHeader>
              <TableHeader className="text-right">Revenue</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.topSellingItems.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium text-zinc-950">{item.name}</TableCell>
                <TableCell>{item.sold}</TableCell>
                <TableCell className="text-right font-medium text-zinc-950">
                  {formatCurrency(item.revenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
