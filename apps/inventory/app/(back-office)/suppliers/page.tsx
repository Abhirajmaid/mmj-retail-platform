"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, PackageOpen, Plus, Truck } from "lucide-react";

import { useSuppliers } from "@jewellery-retail/hooks";
import {
  Badge,
  Button,
  CardTitle,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { statusColor } from "@jewellery-retail/utils";
import type { Supplier, SupplierType } from "@jewellery-retail/types";

import { type SupplierSortOption } from "@/src/components/suppliers/SuppliersFilterBar";
import {
  getSupplierType,
  getSupplierTypeLabel,
  readJustAddedSupplier,
} from "../../../src/components/suppliers/supplier-shared";
import { SuppliersSecondaryBar } from "@/src/components/suppliers/SuppliersSecondaryBar";
import { StockKPIs } from "@/src/components/stock/StockKPIs";

export default function SuppliersPage() {
  const router = useRouter();
  const { data } = useSuppliers();
  const [addedSuppliers, setAddedSuppliers] = useState<Supplier[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | SupplierType>("all");
  const [sortBy, setSortBy] = useState<SupplierSortOption>("name");

  const baseList = useMemo(() => [...(data ?? []), ...addedSuppliers], [data, addedSuppliers]);

  useEffect(() => {
    const parsed = readJustAddedSupplier();
    if (!parsed) return;
    setAddedSuppliers((prev) => [parsed, ...prev]);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let list = baseList;

    if (typeFilter !== "all") {
      const want = String(typeFilter).toLowerCase();
      list = list.filter((s) => (getSupplierType(s) ?? "other") === want);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.contactPerson ?? "").toLowerCase().includes(q) ||
          (s.email ?? "").toLowerCase().includes(q) ||
          (s.city ?? "").toLowerCase().includes(q) ||
          (s.phone ?? "").includes(q)
      );
    }

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name ?? "").localeCompare(b.name ?? "");
        case "city":
          return (a.city ?? "").localeCompare(b.city ?? "");
        case "onTimeRate":
          return (b.onTimeRate ?? 0) - (a.onTimeRate ?? 0);
        case "openOrders":
          return (b.openOrders ?? 0) - (a.openOrders ?? 0);
        default:
          return 0;
      }
    });
  }, [baseList, typeFilter, searchQuery, sortBy]);

  const supplierKpis = useMemo(() => {
    const total = baseList.length;
    const active = baseList.filter((s) => s.status === "active").length;
    const pending = baseList.filter((s) => s.status === "pending").length;
    const lowOnTime = baseList.filter((s) => (s.onTimeRate ?? 0) < 90).length;

    return [
      {
        label: "Total",
        count: total,
        icon: PackageOpen,
        color: "bg-amber-50",
        borderColor: "border-amber-200",
        iconColor: "text-amber-600",
        displayTitle: "Total suppliers",
        footer: total === 1 ? "1 supplier onboarded" : `${total} suppliers onboarded`,
      },
      {
        label: "Active",
        count: active,
        icon: CheckCircle2,
        color: "bg-emerald-50",
        borderColor: "border-emerald-200",
        iconColor: "text-emerald-600",
        displayTitle: "Active",
        footer: active === 1 ? "1 active supplier" : `${active} active suppliers`,
      },
      {
        label: "Pending",
        count: pending,
        icon: Truck,
        color: "bg-blue-50",
        borderColor: "border-blue-200",
        iconColor: "text-blue-600",
        displayTitle: "Pending",
        footer: pending === 0 ? "No pending suppliers" : `${pending} pending approvals`,
      },
      {
        label: "Risk",
        count: lowOnTime,
        icon: AlertTriangle,
        color: "bg-yellow-50",
        borderColor: "border-yellow-200",
        iconColor: "text-yellow-600",
        displayTitle: "Fulfilment risk",
        footer: lowOnTime === 0 ? "All above 90% on-time" : `${lowOnTime} below 90% on-time`,
      },
    ];
  }, [baseList]);

  const hasActiveFilters = typeFilter !== "all" || searchQuery.trim().length > 0;

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage supplier relationships, contacts, and fulfilment reliability."
        actions={
          <Button variant="primary" asChild>
            <a href="/suppliers/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </a>
          </Button>
        }
      />

      <StockKPIs statusStats={supplierKpis} />

      <SuppliersSecondaryBar
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => router.push("/suppliers/add")}
        onFilterClick={() => {}}
        onColumnVisibilityClick={() => {}}
        onExportClick={() => {}}
        hasActiveFilters={hasActiveFilters}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <section className="min-w-0" aria-labelledby="suppliers-list-heading">

        <div className="min-w-0 space-y-4">
          <p className="text-sm text-zinc-500">
            Showing <strong>{filteredAndSorted.length}</strong>
            {hasActiveFilters ? (
              <>
                {" "}
                of <strong>{baseList.length}</strong>
              </>
            ) : null}{" "}
            result{filteredAndSorted.length !== 1 ? "s" : ""}
          </p>

          <div className="min-w-0 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
            <Table className="min-w-[1080px] table-fixed">
              <TableHead>
                <TableRow>
                  <TableHeader className="w-[30%] min-w-0">SUPPLIER</TableHeader>
                  <TableHeader className="w-[18%] min-w-0">TYPE</TableHeader>
                  <TableHeader className="w-[14%] min-w-0">CITY</TableHeader>
                  <TableHeader className="w-[12%] min-w-0">STATUS</TableHeader>
                  <TableHeader className="w-[16%] min-w-0">CONTACT</TableHeader>
                  <TableHeader className="w-[10%] min-w-0 text-right">OPEN ORDERS</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-zinc-500">
                      No suppliers match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSorted.map((supplier) => (
                    <TableRow
                      key={supplier.id}
                      className="cursor-pointer border-b border-zinc-100 bg-white"
                      onClick={() => router.push(`/suppliers/${supplier.id}`)}
                    >
                      <TableCell className="min-w-0 py-2 pl-4">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-900" title={supplier.name}>
                            {supplier.name}
                          </p>
                          <p className="truncate text-xs text-zinc-500" title={supplier.contactPerson}>
                            {supplier.contactPerson || "—"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell
                        className="truncate py-2 text-left text-sm text-zinc-700"
                        title={getSupplierTypeLabel(supplier.supplierType)}
                      >
                        {getSupplierTypeLabel(supplier.supplierType)}
                      </TableCell>
                      <TableCell className="truncate py-2 text-left text-sm text-zinc-700" title={supplier.city}>
                        {supplier.city}
                      </TableCell>
                      <TableCell className="py-2 text-left">
                        <Badge variant={statusColor(supplier.status)}>{supplier.status}</Badge>
                      </TableCell>
                      <TableCell className="truncate py-2 text-left text-sm text-zinc-700" title={supplier.phone}>
                        {supplier.phone || "—"}
                      </TableCell>
                      <TableCell className="py-2 text-right text-sm font-medium text-zinc-900">
                        {supplier.openOrders}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
}
