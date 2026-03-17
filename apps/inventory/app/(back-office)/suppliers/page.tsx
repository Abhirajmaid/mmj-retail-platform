"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Mail, Phone, Plus, Search, Truck, Trash2 } from "lucide-react";

import { useSuppliers } from "@jewellery-retail/hooks";
import { Badge, Button, Card, Modal, PageHeader, useToast } from "@jewellery-retail/ui";
import { statusColor } from "@jewellery-retail/utils";
import type { Supplier } from "@jewellery-retail/types";

import {
  SUPPLIER_TYPE_OPTIONS,
  type SupplierSortOption,
} from "@/src/components/suppliers/SuppliersFilterBar";
import { SuppliersSecondaryBar } from "@/src/components/suppliers/SuppliersSecondaryBar";

const SUPPLIER_JUST_ADDED_KEY = "supplierJustAdded";

function getSupplierTypeLabel(supplierType: string | undefined): string {
  if (!supplierType) return "—";
  const option = SUPPLIER_TYPE_OPTIONS.find((o) => o.value === supplierType);
  return option?.label ?? "Other";
}

function orDash(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

/** Read supplierType from flat or Strapi-shaped supplier (attributes.supplierType). */
function getSupplierType(supplier: Supplier & { attributes?: { supplierType?: string } }): string | undefined {
  const t = supplier.attributes?.supplierType ?? supplier.supplierType;
  return t != null && t !== "" ? String(t).toLowerCase() : undefined;
}

export default function SuppliersPage() {
  const { data } = useSuppliers();
  const toast = useToast();

  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [addedSuppliers, setAddedSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Supplier["supplierType"]>("all");
  const [sortBy, setSortBy] = useState<SupplierSortOption>("name");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  const baseList = useMemo(() => {
    const fromApi = (data ?? []).filter((s) => !deletedIds.has(s.id));
    return [...fromApi, ...addedSuppliers];
  }, [data, deletedIds, addedSuppliers]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(SUPPLIER_JUST_ADDED_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Supplier;
      sessionStorage.removeItem(SUPPLIER_JUST_ADDED_KEY);
      setAddedSuppliers((prev) => [parsed, ...prev]);
      setSelectedSupplierId(parsed.id);
    } catch {
      sessionStorage.removeItem(SUPPLIER_JUST_ADDED_KEY);
    }
  }, []);

  useEffect(() => {
    if (baseList.length === 0) {
      setSelectedSupplierId(null);
      return;
    }
    const selectedStillExists = baseList.some((s) => s.id === selectedSupplierId);
    if (!selectedStillExists) {
      setSelectedSupplierId(baseList[0].id);
    }
  }, [baseList, selectedSupplierId]);

  const filteredAndSorted = useMemo(() => {
    let list = baseList;

    if (typeFilter !== "all") {
      const want = String(typeFilter).toLowerCase();
      list = list.filter((s) => {
        const t = getSupplierType(s) ?? "other";
        return t === want;
      });
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

    const sorted = [...list].sort((a, b) => {
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
    return sorted;
  }, [baseList, typeFilter, searchQuery, sortBy]);

  const selectedSupplier =
    filteredAndSorted.find((s) => s.id === selectedSupplierId) ??
    baseList.find((s) => s.id === selectedSupplierId) ??
    null;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSupplier) {
      setSupplierToDelete(selectedSupplier);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!supplierToDelete) return;
    const id = supplierToDelete.id;
    const wasAdded = addedSuppliers.some((s) => s.id === id);
    if (wasAdded) {
      setAddedSuppliers((prev) => prev.filter((s) => s.id !== id));
    } else {
      setDeletedIds((prev) => new Set(prev).add(id));
    }
    setSelectedSupplierId(null);
    setSupplierToDelete(null);
    setDeleteModalOpen(false);
    toast.toast("Supplier deleted successfully.", "success");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage supplier relationships, contacts, and fulfilment reliability."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <Button
              className="min-h-[44px] w-full bg-amber-500 text-white hover:bg-amber-600 sm:w-auto sm:min-h-9"
              asChild
            >
              <Link href="/suppliers/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Link>
            </Button>
          </div>
        }
      />

      <SuppliersSecondaryBar
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr] xl:items-start">
        <div className="min-h-0 grid gap-2 overflow-y-auto xl:max-h-[calc(100vh-18rem)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {filteredAndSorted.map((supplier) => {
            const isSelected = supplier.id === selectedSupplier?.id;
            return (
              <Card
                key={supplier.id}
                className={
                  isSelected
                    ? "cursor-pointer space-y-3 border-orange-100 bg-orange-50/30 p-4"
                    : "cursor-pointer space-y-3 p-4"
                }
                onClick={() => setSelectedSupplierId(supplier.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950">{supplier.name}</h2>
                    <p className="text-sm text-zinc-500">{supplier.contactPerson}</p>
                    <p className="mt-1 text-xs font-medium text-amber-700">
                      {getSupplierTypeLabel(supplier.supplierType)}
                    </p>
                  </div>
                  <Badge variant={statusColor(supplier.status)}>{supplier.status}</Badge>
                </div>
                <div className="grid gap-2 text-sm text-zinc-600 md:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" />
                    {supplier.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0" />
                    {supplier.email}
                  </p>
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="rounded-xl bg-zinc-100 p-3">
                    <p className="text-xs text-zinc-500">City</p>
                    <p className="mt-0.5 font-semibold text-zinc-950">{supplier.city}</p>
                  </div>
                  <div className="rounded-xl bg-zinc-100 p-3">
                    <p className="text-xs text-zinc-500">On-time rate</p>
                    <p className="mt-0.5 font-semibold text-zinc-950">{supplier.onTimeRate}%</p>
                  </div>
                  <div className="rounded-xl bg-zinc-100 p-3">
                    <p className="text-xs text-zinc-500">Open orders</p>
                    <p className="mt-0.5 font-semibold text-zinc-950">{supplier.openOrders}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {selectedSupplier ? (
          <Card className="space-y-5 p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-zinc-100 p-3">
                  <Truck className="h-5 w-5 text-zinc-700" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">Supplier detail</h2>
                  <p className="text-sm text-zinc-500">Selected account overview</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="shrink-0 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Delete supplier"
                aria-label="Delete supplier"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="border-b border-amber-200/60 pb-2 text-xs font-semibold uppercase tracking-wide text-amber-600">Supplier Information</p>
              <div className="rounded-2xl border border-zinc-200 p-4 space-y-2 text-sm">
                <p className="text-xl font-semibold text-zinc-950">{selectedSupplier.name}</p>
                <p className="text-amber-700 font-medium">{getSupplierTypeLabel(selectedSupplier.supplierType)}</p>
                <p><span className="text-zinc-500">Status:</span> {selectedSupplier.status}</p>
                <p><span className="text-zinc-500">Business Reg. No:</span> {orDash(selectedSupplier.businessRegistrationNumber)}</p>
                <p><span className="text-zinc-500">GST Number:</span> {orDash(selectedSupplier.gstNumber)}</p>
                <p><span className="text-zinc-500">PAN Number:</span> {orDash(selectedSupplier.panNumber)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="border-b border-amber-200/60 pb-2 text-xs font-semibold uppercase tracking-wide text-amber-600">Contact & Location</p>
              <div className="rounded-2xl border border-zinc-200 p-4 space-y-2 text-sm">
                <p><span className="text-zinc-500">Contact Person:</span> {selectedSupplier.contactPerson}</p>
                <p><span className="text-zinc-500">Phone:</span> {selectedSupplier.phone}</p>
                <p><span className="text-zinc-500">Alternate Phone:</span> {orDash(selectedSupplier.alternatePhone)}</p>
                <p><span className="text-zinc-500">Email:</span> {orDash(selectedSupplier.email)}</p>
                <p><span className="text-zinc-500">Website:</span> {orDash(selectedSupplier.website)}</p>
                <p><span className="text-zinc-500">City:</span> {selectedSupplier.city}</p>
                <p><span className="text-zinc-500">State:</span> {orDash(selectedSupplier.state)}</p>
                <p><span className="text-zinc-500">Pincode:</span> {orDash(selectedSupplier.pincode)}</p>
                <p><span className="text-zinc-500">Address:</span> {orDash(selectedSupplier.fullAddress)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="border-b border-amber-200/60 pb-2 text-xs font-semibold uppercase tracking-wide text-amber-600">Bank & Payment Details</p>
              <div className="rounded-2xl border border-zinc-200 p-4 space-y-2 text-sm">
                <p><span className="text-zinc-500">Bank Name:</span> {orDash(selectedSupplier.bankName)}</p>
                <p><span className="text-zinc-500">Account Number:</span> {orDash(selectedSupplier.accountNumber)}</p>
                <p><span className="text-zinc-500">IFSC Code:</span> {orDash(selectedSupplier.ifscCode)}</p>
                <p><span className="text-zinc-500">Payment Terms:</span> {orDash(selectedSupplier.paymentTerms)}</p>
                <p><span className="text-zinc-500">Credit Limit:</span> {selectedSupplier.creditLimit != null ? `₹${selectedSupplier.creditLimit.toLocaleString()}` : "—"}</p>
                <p><span className="text-zinc-500">Currency:</span> {orDash(selectedSupplier.currency)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="border-b border-amber-200/60 pb-2 text-xs font-semibold uppercase tracking-wide text-amber-600">Performance & Catalog</p>
              <div className="rounded-2xl border border-zinc-200 p-4 space-y-2 text-sm">
                <p><span className="text-zinc-500">Open purchase orders:</span> <span className="font-semibold text-zinc-950">{selectedSupplier.openOrders}</span></p>
                <p><span className="text-zinc-500">Fulfilment health:</span> <span className="font-semibold text-emerald-700">{selectedSupplier.onTimeRate}% on time</span></p>
                <p><span className="text-zinc-500">Lead Time:</span> {selectedSupplier.leadTimeDays != null ? `${selectedSupplier.leadTimeDays} days` : "—"}</p>
                <p><span className="text-zinc-500">Minimum Order Value:</span> {selectedSupplier.minimumOrderValue != null ? `₹${selectedSupplier.minimumOrderValue.toLocaleString()}` : "—"}</p>
                <p><span className="text-zinc-500">Metal Types:</span> {(selectedSupplier.metalTypes?.length ?? 0) > 0 ? selectedSupplier.metalTypes!.join(", ") : "—"}</p>
                <p><span className="text-zinc-500">Item Categories:</span> {(selectedSupplier.itemCategories?.length ?? 0) > 0 ? selectedSupplier.itemCategories!.join(", ") : "—"}</p>
                {selectedSupplier.notes ? <p><span className="text-zinc-500">Notes:</span> {selectedSupplier.notes}</p> : null}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center space-y-2 p-12 text-center">
            <Truck className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">Select a supplier to view details</p>
          </Card>
        )}
      </div>

      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSupplierToDelete(null);
        }}
        title="Delete supplier"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            Are you sure you want to delete {supplierToDelete?.name}? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setDeleteModalOpen(false);
                setSupplierToDelete(null);
              }}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
