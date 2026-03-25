"use client";

import { AlertTriangle, Activity, PackageOpen } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useInventoryAnalytics } from "@jewellery-retail/hooks";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  KpiCard,
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

  const stockSeries = data.stockValuationSeries ?? [];
  const latestValuation = stockSeries.length ? stockSeries[stockSeries.length - 1]?.value ?? 0 : 0;
  const avgValuation = stockSeries.length
    ? Math.round(stockSeries.reduce((sum, p) => sum + p.value, 0) / stockSeries.length)
    : 0;

  const lowInventoryCount = data.lowInventoryAlerts.length;
  const topSellerCount = data.topSellingItems.length;

  const kpis = [
    {
      title: "Low inventory",
      value: lowInventoryCount,
      footer: lowInventoryCount === 0 ? "No alerts right now" : "Items need replenishment",
      icon: AlertTriangle,
      color: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
    },
    {
      title: "Current valuation",
      value: formatCurrency(latestValuation),
      footer: "Latest month value",
      icon: PackageOpen,
      color: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-600",
    },
    {
      title: "Avg valuation",
      value: formatCurrency(avgValuation),
      footer: "Average over the series",
      icon: Activity,
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      title: "Top sellers",
      value: topSellerCount,
      footer: topSellerCount === 0 ? "No top sellers yet" : `${topSellerCount} SKUs tracked`,
      icon: PackageOpen,
      color: "bg-zinc-100",
      borderColor: "border-zinc-200",
      iconColor: "text-zinc-700",
    },
  ];

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Analytics"
        description="Stock valuation, top sellers, and low inventory alerts for faster replenishment decisions."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {kpis.map((stat) => (
          <KpiCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            footer={stat.footer}
            icon={stat.icon}
            color={stat.color}
            borderColor={stat.borderColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <PackageOpen className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">Stock valuation</CardTitle>
                <p className="text-sm text-zinc-500">Rolling inventory value over the past six months.</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
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
          </CardBody>
        </Card>

        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">Low inventory alerts</CardTitle>
                <p className="text-sm text-zinc-500">Prioritise SKUs that need urgent replenishment.</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-3">
              {data.lowInventoryAlerts.map((product) => (
                <div key={product.id} className="rounded-2xl border border-zinc-200 bg-white px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-950">{product.name}</p>
                      <p className="text-sm text-zinc-500">{product.sku}</p>
                    </div>
                    <Badge variant={statusColor(product.status)}>
                      {product.status.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600">
                    {product.stock} units left at {product.location}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <PackageOpen className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg font-semibold text-zinc-900">Top selling items</CardTitle>
              <p className="text-sm text-zinc-500">Best-performing SKUs by volume and revenue.</p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          <div className="min-w-0 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
            <Table className="min-w-[1000px] table-fixed">
              <TableHead>
                <TableRow>
                  <TableHeader className="w-[50%] min-w-0">ITEM</TableHeader>
                  <TableHeader className="w-[25%] min-w-0">UNITS SOLD</TableHeader>
                  <TableHeader className="w-[25%] min-w-0 text-right">REVENUE</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.topSellingItems.map((item) => (
                  <TableRow
                    key={item.name}
                    className="border-b border-zinc-100 bg-white"
                  >
                    <TableCell className="py-2 pl-4 min-w-0">
                      <p className="font-medium text-zinc-900 truncate" title={item.name}>
                        {item.name}
                      </p>
                    </TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{item.sold}</TableCell>
                    <TableCell className="py-2 pr-4 text-right font-medium text-zinc-950">
                      {formatCurrency(item.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
