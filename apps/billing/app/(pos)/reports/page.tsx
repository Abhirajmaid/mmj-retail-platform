"use client";

import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useBillingReports } from "@jewellery-retail/hooks";
import { Card, PageHeader } from "@jewellery-retail/ui";
import { formatCompactNumber, formatCurrency } from "@jewellery-retail/utils";

export default function ReportsPage() {
  const { data } = useBillingReports();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Revenue performance, customer growth, and subscription mix in one reporting view."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-zinc-950">Monthly revenue graph</h2>
            <p className="text-sm text-zinc-500">Track the top-line billing trend for the past six months.</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueSeries}>
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
            <h2 className="text-lg font-semibold text-zinc-950">Customer growth</h2>
            <p className="text-sm text-zinc-500">Growth in retained and new customers across the workspace.</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.customerGrowthSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#a16207" fill="#f59e0b" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-zinc-950">Plan distribution</h2>
          <p className="text-sm text-zinc-500">Customer subscription mix by recurring plan.</p>
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.planDistribution} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} fill="#18181b" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {data.planDistribution.map((plan) => (
              <div key={plan.name} className="rounded-2xl border border-zinc-200 px-4 py-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-zinc-950">{plan.name}</p>
                  <p className="text-sm text-zinc-500">{plan.value} customers</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-zinc-100">
                  <div
                    className="h-2 rounded-full bg-zinc-950"
                    style={{ width: `${(plan.value / Math.max(data.planDistribution[0]?.value ?? 1, 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
