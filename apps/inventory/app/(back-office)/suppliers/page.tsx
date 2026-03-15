"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Truck } from "lucide-react";

import { useSuppliers } from "@jewellery-retail/hooks";
import { Badge, Card, PageHeader } from "@jewellery-retail/ui";
import { statusColor } from "@jewellery-retail/utils";

export default function SuppliersPage() {
  const { data } = useSuppliers();
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  useEffect(() => {
    if (data.length === 0) {
      setSelectedSupplierId(null);
      return;
    }

    const selectedStillExists = data.some((supplier) => supplier.id === selectedSupplierId);
    if (!selectedStillExists) {
      setSelectedSupplierId(data[0].id);
    }
  }, [data, selectedSupplierId]);

  const selectedSupplier = data.find((supplier) => supplier.id === selectedSupplierId) ?? data[0] ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage supplier relationships, contacts, and fulfilment reliability."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-4">
          {data.map((supplier) => {
            const isSelected = supplier.id === selectedSupplier?.id;

            return (
              <Card
                key={supplier.id}
                className={isSelected ? "cursor-pointer space-y-4 border-orange-100 bg-orange-50/30 p-6" : "cursor-pointer space-y-4 p-6"}
                onClick={() => setSelectedSupplierId(supplier.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950">{supplier.name}</h2>
                    <p className="text-sm text-zinc-500">{supplier.contactPerson}</p>
                  </div>
                  <Badge variant={statusColor(supplier.status)}>{supplier.status}</Badge>
                </div>
                <div className="grid gap-3 text-sm text-zinc-600 md:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {supplier.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {supplier.email}
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-zinc-100 p-4">
                    <p className="text-sm text-zinc-500">City</p>
                    <p className="mt-1 font-semibold text-zinc-950">{supplier.city}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-100 p-4">
                    <p className="text-sm text-zinc-500">On-time rate</p>
                    <p className="mt-1 font-semibold text-zinc-950">{supplier.onTimeRate}%</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-100 p-4">
                    <p className="text-sm text-zinc-500">Open orders</p>
                    <p className="mt-1 font-semibold text-zinc-950">{supplier.openOrders}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {selectedSupplier ? (
          <Card className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-zinc-100 p-3">
                <Truck className="h-5 w-5 text-zinc-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Supplier detail</h2>
                <p className="text-sm text-zinc-500">Selected account overview</p>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-5">
              <p className="text-sm text-zinc-500">Primary supplier</p>
              <p className="mt-1 text-xl font-semibold text-zinc-950">{selectedSupplier.name}</p>
              <p className="mt-3 text-sm text-zinc-600">
                {selectedSupplier.contactPerson} manages the active inbound pipeline for premium gold and diamond lines.
              </p>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-zinc-100 px-4 py-4">
                <p className="text-sm text-zinc-500">Open purchase orders</p>
                <p className="mt-1 text-lg font-semibold text-zinc-950">{selectedSupplier.openOrders}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-4">
                <p className="text-sm text-emerald-700">Fulfilment health</p>
                <p className="mt-1 text-lg font-semibold text-emerald-900">{selectedSupplier.onTimeRate}% on time</p>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
