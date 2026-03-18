"use client";

import { useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CustomerSearchBar } from "@/src/components/CustomerSearchBar";
import { MetalRatesCard } from "@/src/components/MetalRatesCard";
import { defaultMetalRates } from "@/src/store/metal-rates";
import { useBillingDashboard } from "@jewellery-retail/hooks";
import {
  Badge,
  Card,
  Loader,
} from "@jewellery-retail/ui";
import { formatCompactNumber, formatCurrency } from "@jewellery-retail/utils";

type RevenuePeriod = "Today" | "Monthly" | "Total";

const defaultDashboardData = {
  totalRevenue: 0,
  monthlyRevenue: 0,
  pendingInvoices: 0,
  activeCustomers: 0,
  monthlyRevenueSeries: [],
  customerGrowthSeries: [],
  recentTransactions: [],
};

export default function BillingDashboardPage() {
  const { data, isLoading, error } = useBillingDashboard();
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>("Monthly");

  const safe = data ?? defaultDashboardData;

  const todayCollected = useMemo(() => {
    const today = new Date().toDateString();
    return safe.recentTransactions
      .filter((t) => new Date(t.createdAt).toDateString() === today)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [safe.recentTransactions]);

  const revenueValue = useMemo(() => {
    switch (revenuePeriod) {
      case "Today":
        return todayCollected;
      case "Monthly":
        return safe.monthlyRevenue;
      case "Total":
        return safe.totalRevenue;
      default:
        return safe.monthlyRevenue;
    }
  }, [revenuePeriod, todayCollected, safe.monthlyRevenue, safe.totalRevenue]);

  const revenueTrend = useMemo(() => {
    switch (revenuePeriod) {
      case "Today":
        return "+12% vs yesterday";
      case "Monthly":
        return "+6.4%";
      case "Total":
        return "+18.6%";
      default:
        return "+6.4%";
    }
  }, [revenuePeriod]);

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-red-800">
        <p className="font-medium">Failed to load dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (isLoading && (!data || (data.recentTransactions?.length === 0 && data.monthlyRevenue === 0))) {
    return <Loader label="Loading dashboard…" size="lg" />;
  }

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <CustomerSearchBar />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col gap-6">
          <MetalRatesCard rates={defaultMetalRates} />

          <Card className="overflow-hidden p-5 transition-all" padding="none">
            <div className="flex items-start justify-between gap-4 p-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-500">Revenue</p>
                  <select
                    value={revenuePeriod}
                    onChange={(e) => setRevenuePeriod(e.target.value as RevenuePeriod)}
                    className="h-9 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-0"
                  >
                    <option value="Today">Today</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Total">Total</option>
                  </select>
                </div>
                <p
                  key={revenuePeriod}
                  className="mt-3 animate-in fade-in duration-300 text-3xl font-semibold text-zinc-950"
                >
                  {formatCurrency(revenueValue)}
                </p>
                <p className="mt-2 text-sm text-emerald-600">{revenueTrend}</p>
              </div>
            </div>
          </Card>

          <StatCard
            title="Pending invoices"
            value={String(safe.pendingInvoices)}
            description="Awaiting payment follow-up"
            trend="-2 this week"
            icon={Receipt}
          />
        </div>

        <Card className="flex min-h-0 flex-col p-6">
          <div className="mb-5 shrink-0">
            <h2 className="text-lg font-semibold text-zinc-950">Customer Growth</h2>
            <p className="text-sm text-zinc-500">New and retained customer growth by month.</p>
          </div>
          <div className="min-h-[280px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safe.customerGrowthSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">Monthly Revenue</h2>
            <p className="text-sm text-zinc-500">Six-month revenue trend.</p>
          </div>
          <Badge variant="info">{isLoading ? "Refreshing" : "Live view"}</Badge>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={safe.monthlyRevenueSeries} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCompactNumber(value)}
              />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#ff7a45" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string;
  description?: string;
  trend?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="space-y-5 overflow-hidden border-zinc-100 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="text-[30px] font-semibold leading-none text-zinc-950">{value}</p>
        </div>
        {Icon ? (
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3 text-[var(--app-accent,#f97316)] shadow-[0_12px_24px_-20px_rgba(15,23,42,0.35)]">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {(description || trend) && (
        <div className="flex items-end justify-between gap-3 text-sm">
          <span className="max-w-[15rem] text-zinc-500">{description}</span>
          {trend ? (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-600">
              {trend}
            </span>
          ) : null}
        </div>
      )}
    </Card>
  );
}
