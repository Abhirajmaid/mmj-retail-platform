"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Eye, Filter, Plus, Search, Users, UserCheck, UserPlus } from "lucide-react";

import { useCustomers } from "@jewellery-retail/hooks";
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
import { dateFormat, formatCurrency } from "@jewellery-retail/utils";

export default function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useCustomers();
  const [query, setQuery] = useState("");
  const [customerFilter, setCustomerFilter] = useState<"All" | "VIP" | "Loyal" | "New">("All");
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => {
    const id = searchParams.get("deleted");
    return id ? new Set([id]) : new Set();
  });

  const mergedCustomers = useMemo(
    () => data.filter((c) => !deletedIds.has(c.id)),
    [data, deletedIds]
  );

  const vipCount = useMemo(() => mergedCustomers.filter((c) => c.segment === "VIP").length, [mergedCustomers]);
  const loyalCount = useMemo(() => mergedCustomers.filter((c) => c.segment === "Loyal").length, [mergedCustomers]);
  const newCount = useMemo(() => mergedCustomers.filter((c) => c.segment === "New").length, [mergedCustomers]);

  const tabItems = useMemo(
    () => [
      { key: "All" as const, label: "All", count: mergedCustomers.length },
      { key: "VIP" as const, label: "VIP", count: vipCount },
      { key: "Loyal" as const, label: "Loyal", count: loyalCount },
      { key: "New" as const, label: "New", count: newCount },
    ],
    [mergedCustomers.length, vipCount, loyalCount, newCount]
  );

  const filteredCustomers = useMemo(() => {
    return mergedCustomers.filter((customer) => {
      if (customerFilter !== "All" && customer.segment !== customerFilter) return false;
      if (!query.trim()) return true;
      return `${customer.name} ${customer.email} ${customer.phone} ${customer.city}`
        .toLowerCase()
        .includes(query.toLowerCase());
    });
  }, [mergedCustomers, customerFilter, query]);

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Customers"
        description="Review profiles, balances, and purchase history. Click a row to open the customer profile."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="primary" asChild>
              <Link href="/customers/new">
                <Plus className="mr-2 h-4 w-4" />
                Create customer
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard
          title="Total Customers"
          value={mergedCustomers.length}
          footer={`${mergedCustomers.length} ${mergedCustomers.length === 1 ? "customer" : "customers"}`}
          icon={Users}
          color="bg-amber-50"
          borderColor="border-amber-200"
          iconColor="text-amber-600"
        />
        <KpiCard
          title="VIP Customers"
          value={vipCount}
          footer={`${vipCount} ${vipCount === 1 ? "customer" : "customers"}`}
          icon={UserCheck}
          color="bg-emerald-50"
          borderColor="border-emerald-200"
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Loyal Customers"
          value={loyalCount}
          footer={`${loyalCount} ${loyalCount === 1 ? "customer" : "customers"}`}
          icon={UserPlus}
          color="bg-blue-50"
          borderColor="border-blue-200"
          iconColor="text-blue-600"
        />
        <KpiCard
          title="New Customers"
          value={newCount}
          footer={`${newCount} ${newCount === 1 ? "customer" : "customers"}`}
          icon={UserPlus}
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
                onClick={() => setCustomerFilter(key)}
                className={`flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  customerFilter === key
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
              onClick={() => router.push("/customers/new")}
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
            <TableHeader>Segment</TableHeader>
            <TableHeader>Outstanding</TableHeader>
            <TableHeader>Last purchase</TableHeader>
            <TableHeader className="text-right">Lifetime value</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow
              key={customer.id}
              className="cursor-pointer hover:bg-zinc-50"
              onClick={() => router.push(`/customers/${customer.id}`)}
            >
              <TableCell>
                <div>
                  <p className="font-medium text-zinc-950">{customer.name}</p>
                  <p className="text-xs text-zinc-500">{customer.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="info">{customer.segment}</Badge>
              </TableCell>
              <TableCell>{formatCurrency(customer.outstandingBalance)}</TableCell>
              <TableCell>{dateFormat(customer.lastPurchaseAt)}</TableCell>
              <TableCell className="text-right font-medium text-zinc-950">
                {formatCurrency(customer.totalSpend)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
