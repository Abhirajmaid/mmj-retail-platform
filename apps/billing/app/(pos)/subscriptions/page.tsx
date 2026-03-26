"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { BadgeCheck, Download, Eye, Filter, Gem, Plus, Search, Sparkles, Users } from "lucide-react";

import type { Subscription } from "@jewellery-retail/types";
import { useSubscriptions } from "@jewellery-retail/hooks";
import {
  Badge,
  Button,
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
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

export default function SubscriptionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useSubscriptions();
  const [subscriptions] = useState<Subscription[]>([]);
  const [deletedIds] = useState<Set<string>>(() => {
    const id = searchParams.get("deleted");
    return id ? new Set([id]) : new Set();
  });
  const [query, setQuery] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState<"All" | "Active" | "Trial" | "Past Due">("All");

  const mergedSubscriptions = useMemo(
    () => [...subscriptions, ...data].filter((s) => !deletedIds.has(s.id)),
    [subscriptions, data, deletedIds]
  );
  const activeCount = useMemo(
    () => mergedSubscriptions.filter((s) => s.status === "active").length,
    [mergedSubscriptions]
  );
  const trialCount = useMemo(
    () => mergedSubscriptions.filter((s) => s.status === "trial").length,
    [mergedSubscriptions]
  );
  const pastDueCount = useMemo(
    () => mergedSubscriptions.filter((s) => s.status === "past_due").length,
    [mergedSubscriptions]
  );
  const activeMrr = useMemo(
    () => mergedSubscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + s.mrr, 0),
    [mergedSubscriptions]
  );
  const tabItems = useMemo(
    () => [
      { key: "All" as const, label: "All", count: mergedSubscriptions.length },
      { key: "Active" as const, label: "Active", count: activeCount },
      { key: "Trial" as const, label: "Trial", count: trialCount },
      { key: "Past Due" as const, label: "Past Due", count: pastDueCount },
    ],
    [mergedSubscriptions.length, activeCount, trialCount, pastDueCount]
  );

  const filteredSubscriptions = useMemo(() => {
    return mergedSubscriptions.filter((subscription) => {
      if (subscriptionFilter === "Active" && subscription.status !== "active") return false;
      if (subscriptionFilter === "Trial" && subscription.status !== "trial") return false;
      if (subscriptionFilter === "Past Due" && subscription.status !== "past_due") return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        subscription.customerName.toLowerCase().includes(q) ||
        subscription.plan.toLowerCase().includes(q) ||
        subscription.billingCycle.toLowerCase().includes(q) ||
        subscription.status.toLowerCase().replace("_", " ").includes(q) ||
        formatCurrency(subscription.monthlyAmount).toLowerCase().includes(q)
      );
    });
  }, [mergedSubscriptions, subscriptionFilter, query]);

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Create, monitor, and review subscription plans across billing workspace."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="primary" asChild>
              <Link href="/subscriptions/new">
                <Plus className="mr-2 h-4 w-4" />
                Create subscription
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard
          title="Total Subscriptions"
          value={mergedSubscriptions.length}
          footer={`${mergedSubscriptions.length} ${mergedSubscriptions.length === 1 ? "subscription" : "subscriptions"}`}
          icon={Users}
          color="bg-amber-50"
          borderColor="border-amber-200"
          iconColor="text-amber-600"
        />
        <KpiCard
          title="Active MRR"
          value={activeMrr}
          footer="Monthly recurring revenue"
          icon={BadgeCheck}
          color="bg-emerald-50"
          borderColor="border-emerald-200"
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Premium plans"
          value={mergedSubscriptions.filter((subscription) => subscription.plan === "Diamond Care").length}
          footer="High-value recurring customers"
          icon={Gem}
          color="bg-blue-50"
          borderColor="border-blue-200"
          iconColor="text-blue-600"
        />
        <KpiCard
          title="Trials and risk"
          value={trialCount + pastDueCount}
          footer="Trial or past-due subscriptions"
          icon={Sparkles}
          color="bg-yellow-50"
          borderColor="border-yellow-200"
          iconColor="text-yellow-600"
        />
      </div>

      <div className="rounded-xl bg-white px-4 py-3 shadow-md sm:px-4 sm:py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {tabItems.map(({ key, label, count }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSubscriptionFilter(key)}
                className={`flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  subscriptionFilter === key
                    ? "bg-amber-500 text-white shadow-lg"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
                }`}
              >
                {label}
                <span className="ml-1.5">{count}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                type="search"
                placeholder="Search by customer name..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-10 rounded-xl border border-zinc-200 bg-white py-0 pl-10 pr-4 text-zinc-900 shadow-md placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
              />
            </div>
            <button
              type="button"
              title="Add"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-amber-500 shadow-md hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
              onClick={() => router.push("/subscriptions/new")}
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              type="button"
              title="Filter"
              className="flex h-10 w-10 shrink-0 items-center shadow-md justify-center rounded-full border border-zinc-200 text-zinc-600 bg-white hover:bg-zinc-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Column visibility"
              className="flex h-10 w-10 shrink-0 items-center shadow-md justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Plan</TableHeader>
            <TableHeader>Billing cycle</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Renews</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSubscriptions.map((subscription) => (
            <TableRow
              key={subscription.id}
              className="cursor-pointer hover:bg-zinc-50"
              onClick={() => router.push(`/subscriptions/${subscription.id}`)}
            >
              <TableCell className="font-medium text-zinc-950">{subscription.customerName}</TableCell>
              <TableCell>{subscription.plan}</TableCell>
              <TableCell className="capitalize">{subscription.billingCycle}</TableCell>
              <TableCell>
                <Badge variant={statusColor(subscription.status)}>{subscription.status.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell>{dateFormat(subscription.renewsAt)}</TableCell>
              <TableCell className="text-right font-medium text-zinc-950">
                {formatCurrency(subscription.monthlyAmount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
