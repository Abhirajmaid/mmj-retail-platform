"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Receipt } from "lucide-react";
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
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  KpiCard,
  Loader,
} from "@jewellery-retail/ui";
import { formatCompactNumber, formatCurrency } from "@jewellery-retail/utils";

type RevenuePeriod = "Today" | "Monthly" | "Total";

const stockLikeSelectClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px] appearance-none bg-white pr-10";

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
            <CardBody className="p-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-500">Revenue</p>
                  <div className="relative">
                    <select
                      value={revenuePeriod}
                      onChange={(e) => setRevenuePeriod(e.target.value as RevenuePeriod)}
                      className={`${stockLikeSelectClass} min-w-[126px] font-medium text-zinc-700`}
                      aria-label="Revenue period"
                    >
                      <option value="Today">Today</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Total">Total</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  </div>
                </div>
                <p
                  key={revenuePeriod}
                  className="mt-3 animate-in fade-in duration-300 text-3xl font-semibold text-zinc-950"
                >
                  {formatCurrency(revenueValue)}
                </p>
                <p className="mt-2 text-sm text-emerald-600">{revenueTrend}</p>
              </div>
            </CardBody>
          </Card>

          <KpiCard
            title="Pending invoices"
            value={safe.pendingInvoices}
            footer="Awaiting payment follow-up"
            icon={Receipt}
            color="bg-amber-50"
            borderColor="border-amber-200"
            iconColor="text-amber-600"
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
        <CardHeader className="mb-0 space-y-1 pb-0">
          <CardTitle>Monthly Revenue</CardTitle>
          <p className="text-sm text-zinc-500">Six-month revenue trend.</p>
        </CardHeader>
        <CardBody className="pt-5">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safe.monthlyRevenueSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCompactNumber(value)}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
