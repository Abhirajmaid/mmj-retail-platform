"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ClipboardPlus, Clock, Download, Eye, Filter, Package, Search, Truck } from "lucide-react";

import { usePurchaseOrders } from "@jewellery-retail/hooks";
import {
  Badge,
  Button,
  KpiCard,
  Input,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { data } = usePurchaseOrders();

  const ITEMS_PER_PAGE = 15;

  const [activeTab, setActiveTab] = useState<"all" | "draft" | "in_transit" | "approved" | "received">("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const total = data.length;
  const draftCount = data.filter((po) => po.status === "draft").length;
  const inTransitCount = data.filter((po) => po.status === "in_transit").length;
  const pending = draftCount + inTransitCount;
  const approved = data.filter((po) => po.status === "approved").length;
  const received = data.filter((po) => po.status === "received").length;

  const kpis = [
    {
      label: "Total",
      value: total,
      footer: total === 0 ? "No purchase orders" : `${total} total purchase orders`,
      icon: Package,
      color: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
    },
    {
      label: "Pending",
      value: pending,
      footer: pending === 0 ? "No pending purchase orders" : `${pending} pending purchase orders`,
      icon: Clock,
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
    },
    {
      label: "Approved",
      value: approved,
      footer: approved === 0 ? "No approved purchase orders" : `${approved} approved purchase orders`,
      icon: CheckCircle2,
      color: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-600",
    },
    {
      label: "Received",
      value: received,
      footer: received === 0 ? "No received purchase orders" : `${received} received purchase orders`,
      icon: Truck,
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
    },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((po) => {
      if (activeTab !== "all" && po.status !== activeTab) return false;
      if (!q) return true;
      return po.poNumber.toLowerCase().includes(q) || po.supplierName.toLowerCase().includes(q);
    });
  }, [activeTab, data, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, data]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filtered.length);
  const hasPagination = totalPages > 1;
  const paginatedItems = useMemo(
    () => filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filtered, startIndex]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase orders"
        description="Create, approve, and track incoming purchase orders with suppliers."
        actions={
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/purchase-orders/approve")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve PO
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/purchase-orders/add")}
            >
              <ClipboardPlus className="mr-2 h-4 w-4" />
              Create PO
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {kpis.map((stat) => (
          <KpiCard
            key={stat.label}
            title={stat.label}
            value={stat.value}
            footer={stat.footer}
            icon={stat.icon}
            color={stat.color}
            borderColor={stat.borderColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Stock-like bar: status tabs + search */}
      <div className="rounded-xl bg-white px-4 py-3 shadow-md sm:px-4 sm:py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: "all" as const, label: "All", count: total },
                { key: "draft" as const, label: "Draft", count: draftCount },
                { key: "in_transit" as const, label: "In transit", count: inTransitCount },
                { key: "approved" as const, label: "Approved", count: approved },
                { key: "received" as const, label: "Received", count: received },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-amber-500 text-white shadow-lg"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5">{tab.count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                type="search"
                placeholder="Search by PO number or supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 rounded-xl border border-zinc-200 bg-white py-0 pl-10 pr-4 text-zinc-900 shadow-md placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
              />
            </div>

            <button
              type="button"
              onClick={() => {}}
              title="Filter"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-md transition-colors hover:bg-zinc-50"
            >
              <Filter className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {}}
              title="Column visibility"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-md transition-colors hover:bg-zinc-50"
            >
              <Eye className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {}}
              title="Export"
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
              disabled={filtered.length === 0}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-zinc-500">
        Showing{" "}
        {hasPagination ? (
          <>
            <strong>{startIndex + 1}</strong>–<strong>{endIndex}</strong> of{" "}
            <strong>{filtered.length}</strong>
          </>
        ) : (
          <strong>{filtered.length}</strong>
        )}{" "}
        result{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="min-w-0 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <Table className="min-w-[1080px] table-fixed">
          <TableHead>
            <TableRow>
              <TableHeader className="w-[18%] min-w-0">PO NUMBER</TableHeader>
              <TableHeader className="w-[18%] min-w-0">SUPPLIER</TableHeader>
              <TableHeader className="w-[14%] min-w-0">STATUS</TableHeader>
              <TableHeader className="w-[14%] min-w-0">CREATED</TableHeader>
              <TableHeader className="w-[18%] min-w-0">EXPECTED DELIVERY</TableHeader>
              <TableHeader className="w-[10%] min-w-0">ITEMS</TableHeader>
              <TableHeader className="w-[8%] min-w-0 text-right">TOTAL</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-zinc-500">
                  No purchase orders match your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((purchaseOrder) => (
                <TableRow
                  key={purchaseOrder.id}
                  className="cursor-pointer border-b border-zinc-100 bg-white hover:bg-amber-50"
                  onClick={() => router.push(`/purchase-orders/${purchaseOrder.id}`)}
                  role="button"
                >
                  <TableCell className="py-2 pl-4 min-w-0">
                    <p className="font-medium text-zinc-950 truncate" title={purchaseOrder.poNumber}>
                      {purchaseOrder.poNumber}
                    </p>
                  </TableCell>
                  <TableCell className="py-2 text-left text-sm text-zinc-700 truncate" title={purchaseOrder.supplierName}>
                    {purchaseOrder.supplierName}
                  </TableCell>
                  <TableCell className="py-2 text-left">
                    <Badge variant={statusColor(purchaseOrder.status)}>
                      {purchaseOrder.status.replaceAll("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 text-left text-sm text-zinc-700">{dateFormat(purchaseOrder.createdAt)}</TableCell>
                  <TableCell className="py-2 text-left text-sm text-zinc-700">{dateFormat(purchaseOrder.expectedDate)}</TableCell>
                  <TableCell className="py-2 text-left text-sm text-zinc-700">{purchaseOrder.items}</TableCell>
                  <TableCell className="py-2 pr-4 text-right font-medium text-zinc-950">
                    {formatCurrency(purchaseOrder.total)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {hasPagination && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-4">
          <p className="text-sm text-zinc-500">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
