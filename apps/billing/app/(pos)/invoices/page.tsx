"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CircleCheck, Clock3, Download, Eye, FileText, Filter, Plus, Search } from "lucide-react";

import type { Invoice } from "@jewellery-retail/types";
import { useInvoices } from "@jewellery-retail/hooks";
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

export default function InvoicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useInvoices();
  const [invoices] = useState<Invoice[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => {
    const id = searchParams.get("deleted");
    return id ? new Set([id]) : new Set();
  });
  const [query, setQuery] = useState("");
  const [invoiceFilter, setInvoiceFilter] = useState<"All" | "Paid" | "Pending" | "Overdue">("All");

  const mergedInvoices = useMemo(
    () => [...invoices, ...data].filter((inv) => !deletedIds.has(inv.id)),
    [data, invoices, deletedIds]
  );

  const normalizedStatus = (status: string) => status.toLowerCase().replace("_", " ");
  const paidCount = useMemo(
    () => mergedInvoices.filter((invoice) => normalizedStatus(invoice.status).includes("paid")).length,
    [mergedInvoices]
  );
  const pendingCount = useMemo(
    () =>
      mergedInvoices.filter((invoice) => {
        const status = normalizedStatus(invoice.status);
        return status.includes("pending") || status.includes("unpaid");
      }).length,
    [mergedInvoices]
  );
  const overdueCount = useMemo(
    () => mergedInvoices.filter((invoice) => normalizedStatus(invoice.status).includes("overdue")).length,
    [mergedInvoices]
  );

  const tabItems = useMemo(
    () => [
      { key: "All" as const, label: "All", count: mergedInvoices.length },
      { key: "Paid" as const, label: "Paid", count: paidCount },
      { key: "Pending" as const, label: "Pending", count: pendingCount },
      { key: "Overdue" as const, label: "Overdue", count: overdueCount },
    ],
    [mergedInvoices.length, paidCount, pendingCount, overdueCount]
  );

  const filteredInvoices = useMemo(() => {
    return mergedInvoices.filter((invoice) => {
      const status = normalizedStatus(invoice.status);
      if (invoiceFilter === "Paid" && !status.includes("paid")) return false;
      if (invoiceFilter === "Pending" && !(status.includes("pending") || status.includes("unpaid"))) return false;
      if (invoiceFilter === "Overdue" && !status.includes("overdue")) return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        invoice.invoiceNumber.toLowerCase().includes(q) ||
        invoice.customerName.toLowerCase().includes(q) ||
        formatCurrency(invoice.amount).toLowerCase().includes(q) ||
        status.includes(q)
      );
    });
  }, [mergedInvoices, invoiceFilter, query]);

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Invoices"
        description="Create, monitor, and download customer invoices across the billing workspace. Click a row to open the invoice."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="primary" asChild>
              <Link href="/invoices/new">
                <Plus className="mr-2 h-4 w-4" />
                Create invoice
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard
          title="Total Invoices"
          value={mergedInvoices.length}
          footer={`${mergedInvoices.length} ${mergedInvoices.length === 1 ? "invoice" : "invoices"}`}
          icon={FileText}
          color="bg-amber-50"
          borderColor="border-amber-200"
          iconColor="text-amber-600"
        />
        <KpiCard
          title="Paid Invoices"
          value={paidCount}
          footer={`${paidCount} ${paidCount === 1 ? "invoice" : "invoices"}`}
          icon={CircleCheck}
          color="bg-emerald-50"
          borderColor="border-emerald-200"
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Pending Invoices"
          value={pendingCount}
          footer={`${pendingCount} ${pendingCount === 1 ? "invoice" : "invoices"}`}
          icon={Clock3}
          color="bg-blue-50"
          borderColor="border-blue-200"
          iconColor="text-blue-600"
        />
        <KpiCard
          title="Overdue Invoices"
          value={overdueCount}
          footer={`${overdueCount} ${overdueCount === 1 ? "invoice" : "invoices"}`}
          icon={Clock3}
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
                onClick={() => setInvoiceFilter(key)}
                className={`flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  invoiceFilter === key
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
                placeholder="Search by invoice number..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-10 rounded-xl border border-zinc-200 bg-white py-0 pl-10 pr-4 text-zinc-900 shadow-md placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
              />
            </div>

            <button
              type="button"
              title="Add"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-amber-500 shadow-md hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
              onClick={() => router.push("/invoices/new")}
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
            <TableHeader>Invoice</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Issued</TableHeader>
            <TableHeader>Due</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow
              key={invoice.id}
              className="cursor-pointer hover:bg-zinc-50"
              onClick={() => router.push(`/invoices/${invoice.id}`)}
            >
              <TableCell className="font-medium text-zinc-950">{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>
                <Badge variant={statusColor(invoice.status)}>{invoice.status.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell>{dateFormat(invoice.issuedAt)}</TableCell>
              <TableCell>{dateFormat(invoice.dueDate)}</TableCell>
              <TableCell className="text-right font-medium text-zinc-950">
                {formatCurrency(invoice.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
