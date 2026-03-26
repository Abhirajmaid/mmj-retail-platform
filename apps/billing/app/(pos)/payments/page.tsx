"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CircleCheck, Clock3, Download, Eye, FileText, Filter, Plus, Search, XCircle } from "lucide-react";

import type { Payment } from "@jewellery-retail/types";
import { usePayments } from "@jewellery-retail/hooks";
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

export default function PaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = usePayments();
  const [payments] = useState<Payment[]>([]);
  const [deletedIds] = useState<Set<string>>(() => {
    const id = searchParams.get("deleted");
    return id ? new Set([id]) : new Set();
  });
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<"All" | "Paid" | "Pending" | "Failed">("All");

  const mergedPayments = useMemo(
    () => [...payments, ...data].filter((payment) => !deletedIds.has(payment.id)),
    [data, payments, deletedIds]
  );
  const paidCount = useMemo(
    () => mergedPayments.filter((payment) => payment.status === "paid").length,
    [mergedPayments]
  );
  const pendingCount = useMemo(
    () => mergedPayments.filter((payment) => payment.status === "pending").length,
    [mergedPayments]
  );
  const failedCount = useMemo(
    () => mergedPayments.filter((payment) => payment.status === "failed").length,
    [mergedPayments]
  );
  const tabItems = useMemo(
    () => [
      { key: "All" as const, label: "All", count: mergedPayments.length },
      { key: "Paid" as const, label: "Paid", count: paidCount },
      { key: "Pending" as const, label: "Pending", count: pendingCount },
      { key: "Failed" as const, label: "Failed", count: failedCount },
    ],
    [mergedPayments.length, paidCount, pendingCount, failedCount]
  );

  const filteredPayments = useMemo(() => {
    return mergedPayments.filter((payment) => {
      if (paymentFilter === "Paid" && payment.status !== "paid") return false;
      if (paymentFilter === "Pending" && payment.status !== "pending") return false;
      if (paymentFilter === "Failed" && payment.status !== "failed") return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        payment.reference.toLowerCase().includes(q) ||
        payment.customerName.toLowerCase().includes(q) ||
        payment.invoiceNumber.toLowerCase().includes(q) ||
        payment.method.toLowerCase().includes(q) ||
        payment.status.toLowerCase().includes(q) ||
        formatCurrency(payment.amount).toLowerCase().includes(q)
      );
    });
  }, [mergedPayments, paymentFilter, query]);

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Payments"
        description="Create, monitor, and review payment entries across the billing workspace."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="primary" asChild>
              <Link href="/payments/new">
                <Plus className="mr-2 h-4 w-4" />
                Create payment
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard
          title="Total Payments"
          value={mergedPayments.length}
          footer={`${mergedPayments.length} ${mergedPayments.length === 1 ? "payment" : "payments"}`}
          icon={FileText}
          color="bg-amber-50"
          borderColor="border-amber-200"
          iconColor="text-amber-600"
        />
        <KpiCard
          title="Paid Payments"
          value={paidCount}
          footer={`${paidCount} ${paidCount === 1 ? "payment" : "payments"}`}
          icon={CircleCheck}
          color="bg-emerald-50"
          borderColor="border-emerald-200"
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Pending Payments"
          value={pendingCount}
          footer={`${pendingCount} ${pendingCount === 1 ? "payment" : "payments"}`}
          icon={Clock3}
          color="bg-blue-50"
          borderColor="border-blue-200"
          iconColor="text-blue-600"
        />
        <KpiCard
          title="Failed Payments"
          value={failedCount}
          footer={`${failedCount} ${failedCount === 1 ? "payment" : "payments"}`}
          icon={XCircle}
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
                onClick={() => setPaymentFilter(key)}
                className={`flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  paymentFilter === key
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
                placeholder="Search by payment reference..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-10 rounded-xl border border-zinc-200 bg-white py-0 pl-10 pr-4 text-zinc-900 shadow-md placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
              />
            </div>

            <button
              type="button"
              title="Add"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-amber-500 shadow-md hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
              onClick={() => router.push("/payments/new")}
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
            <TableHeader>Reference</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Invoice</TableHeader>
            <TableHeader>Method</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPayments.map((payment) => (
            <TableRow
              key={payment.id}
              className="cursor-pointer hover:bg-zinc-50"
              onClick={() => router.push(`/payments/${payment.id}`)}
            >
              <TableCell className="font-medium text-zinc-950">{payment.reference}</TableCell>
              <TableCell>{payment.customerName}</TableCell>
              <TableCell>{payment.invoiceNumber}</TableCell>
              <TableCell className="uppercase">{payment.method}</TableCell>
              <TableCell>
                <Badge variant={statusColor(payment.status)}>{payment.status}</Badge>
              </TableCell>
              <TableCell>{dateFormat(payment.createdAt)}</TableCell>
              <TableCell className="text-right font-medium text-zinc-950">{formatCurrency(payment.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
