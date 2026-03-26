"use client";

import { Activity, AlertTriangle, PackageOpen } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useBillingReports } from "@jewellery-retail/hooks";
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
import { formatCompactNumber, formatCurrency } from "@jewellery-retail/utils";

export default function ReportsPage() {
  const { data } = useBillingReports();
  const revenueSeries = data.revenueSeries ?? [];
  const customerSeries = data.customerGrowthSeries ?? [];
  const planDistribution = data.planDistribution ?? [];

  const latestRevenue = revenueSeries.length ? revenueSeries[revenueSeries.length - 1]?.value ?? 0 : 0;
  const avgRevenue = revenueSeries.length
    ? Math.round(revenueSeries.reduce((sum, p) => sum + p.value, 0) / revenueSeries.length)
    : 0;
  const latestGrowth = customerSeries.length ? customerSeries[customerSeries.length - 1]?.value ?? 0 : 0;

  const kpis = [
    {
      title: "Plan categories",
      value: planDistribution.length,
      footer: planDistribution.length === 0 ? "No plans mapped" : "Subscription segments tracked",
      icon: AlertTriangle,
      color: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
    },
    {
      title: "Current revenue",
      value: formatCurrency(latestRevenue),
      footer: "Latest month value",
      icon: PackageOpen,
      color: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-600",
    },
    {
      title: "Avg revenue",
      value: formatCurrency(avgRevenue),
      footer: "Average over the series",
      icon: Activity,
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      title: "Latest growth",
      value: latestGrowth,
      footer: customerSeries.length === 0 ? "No growth data yet" : "Current customer growth point",
      icon: PackageOpen,
      color: "bg-zinc-100",
      borderColor: "border-zinc-200",
      iconColor: "text-zinc-700",
    },
  ];

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Reports"
        description="Revenue performance, customer growth, and plan mix in one analytics view."
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
                <CardTitle className="text-lg font-semibold text-zinc-900">Revenue trend</CardTitle>
                <p className="text-sm text-zinc-500">Rolling billing value over recent months.</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries}>
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
                <CardTitle className="text-lg font-semibold text-zinc-900">Plan distribution</CardTitle>
                <p className="text-sm text-zinc-500">Prioritise plans by current customer share.</p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-3">
              {planDistribution.map((plan) => (
                <div key={plan.name} className="rounded-2xl border border-zinc-200 bg-white px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-950">{plan.name}</p>
                      <p className="text-sm text-zinc-500">{plan.value} customers</p>
                    </div>
                    <Badge variant="info">{plan.value}</Badge>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-zinc-100">
                    <div
                      className="h-2 rounded-full bg-zinc-950"
                      style={{ width: `${(plan.value / Math.max(planDistribution[0]?.value ?? 1, 1)) * 100}%` }}
                    />
                  </div>
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
              <CardTitle className="text-lg font-semibold text-zinc-900">Customer growth points</CardTitle>
              <p className="text-sm text-zinc-500">Month-by-month growth with linked revenue snapshots.</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="min-w-0 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
            <Table className="min-w-[1000px] table-fixed">
              <TableHead>
                <TableRow>
                  <TableHeader className="w-[40%] min-w-0">MONTH</TableHeader>
                  <TableHeader className="w-[30%] min-w-0">GROWTH</TableHeader>
                  <TableHeader className="w-[30%] min-w-0 text-right">REVENUE</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerSeries.map((point, idx) => (
                  <TableRow
                    key={`${point.label}-${idx}`}
                    className="border-b border-zinc-100 bg-white"
                  >
                    <TableCell className="py-2 pl-4 min-w-0">
                      <p className="font-medium text-zinc-900 truncate">{point.label}</p>
                    </TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{point.value}</TableCell>
                    <TableCell className="py-2 pr-4 text-right font-medium text-zinc-950">
                      {formatCurrency(revenueSeries[idx]?.value ?? 0)}
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
