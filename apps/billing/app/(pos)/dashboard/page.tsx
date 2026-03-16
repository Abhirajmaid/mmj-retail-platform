"use client";

import { ArrowUpRight, CreditCard, IndianRupee, Receipt, Users } from "lucide-react";
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

import { useBillingDashboard } from "@jewellery-retail/hooks";
import {
  Badge,
  Card,
  Loader,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, formatCompactNumber, formatCurrency, statusColor } from "@jewellery-retail/utils";

export default function BillingDashboardPage() {
  const { data, isLoading, error } = useBillingDashboard();

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

  const safe = data ?? {
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingInvoices: 0,
    activeCustomers: 0,
    monthlyRevenueSeries: [],
    customerGrowthSeries: [],
    recentTransactions: [],
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Card
          className="overflow-hidden border-0 p-7 text-white shadow-[0_28px_56px_-34px_rgba(23,54,132,0.55)]"
          style={{ backgroundColor: "#173684" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <Badge className="border-transparent bg-white text-[#173684] shadow-none" variant="default">
                Billing overview
              </Badge>
              <div>
                <p className="text-sm text-white/70">Total balance handled this month</p>
                <p className="mt-2 text-4xl font-semibold text-white">{formatCurrency(safe.monthlyRevenue)}</p>
              </div>
              <p className="max-w-xl text-sm leading-6 text-white/70">
                Stay on top of invoices, monthly collections, and customer activity with a cleaner control center inspired by modern finance dashboards.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 px-5 py-4 shadow-none">
              <p className="text-xs uppercase tracking-[0.22em] text-white/55">Pending</p>
              <p className="mt-2 text-2xl font-semibold text-white">{safe.pendingInvoices}</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Collected today</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">
              {formatCurrency(safe.recentTransactions[0]?.amount ?? 0)}
            </p>
            <p className="mt-2 text-sm text-emerald-600">+12% vs yesterday</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Transactions</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">{safe.recentTransactions.length}</p>
            <p className="mt-2 text-sm text-zinc-500">Recent activity synced from shared hooks</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Growth rate</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">18.6%</p>
            <p className="mt-2 text-sm text-zinc-500">Stronger conversions this month</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Customer health</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">{formatCompactNumber(safe.activeCustomers)}</p>
            <p className="mt-2 text-sm text-zinc-500">Active accounts with recent purchases</p>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total revenue"
          value={formatCurrency(safe.totalRevenue)}
          description="All-time collected revenue"
          trend="+18.6%"
          icon={IndianRupee}
        />
        <StatCard
          title="Monthly revenue"
          value={formatCurrency(safe.monthlyRevenue)}
          description="Current month recognized revenue"
          trend="+6.4%"
          icon={ArrowUpRight}
        />
        <StatCard
          title="Pending invoices"
          value={String(safe.pendingInvoices)}
          description="Awaiting payment follow-up"
          trend="-2 this week"
          icon={Receipt}
        />
        <StatCard
          title="Active customers"
          value={formatCompactNumber(safe.activeCustomers)}
          description="Customers with recent activity"
          trend="+9% this month"
          icon={Users}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Monthly revenue</h2>
              <p className="text-sm text-zinc-500">Six-month revenue trend from the shared billing API layer.</p>
            </div>
            <Badge variant="info">{isLoading ? "Refreshing" : "Live view"}</Badge>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safe.monthlyRevenueSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatCompactNumber(value)} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#ff7a45" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-zinc-950">Customer growth</h2>
            <p className="text-sm text-zinc-500">New and retained customer growth by month.</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safe.customerGrowthSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">Recent transactions</h2>
            <p className="text-sm text-zinc-500">Latest customer payments synced through the billing hooks layer.</p>
          </div>
          <Badge variant="success">
            <CreditCard className="mr-1 h-3.5 w-3.5" />
            {formatCurrency(safe.recentTransactions.reduce((total, item) => total + item.amount, 0))}
          </Badge>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Invoice</TableHeader>
              <TableHeader>Method</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader className="text-right">Amount</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {safe.recentTransactions.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium text-zinc-950">{payment.customerName}</TableCell>
                <TableCell>{payment.invoiceNumber}</TableCell>
                <TableCell className="uppercase">{payment.method}</TableCell>
                <TableCell>
                  <Badge variant={statusColor(payment.status)}>{payment.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>{dateFormat(payment.createdAt)}</TableCell>
                <TableCell className="text-right font-medium text-zinc-950">
                  {formatCurrency(payment.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
