"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, FileText, Landmark, Truck } from "lucide-react";
import type { PurchaseOrder } from "@jewellery-retail/types";
import { useSuppliers } from "@jewellery-retail/hooks";
import { Badge, Button, Card, CardBody, CardHeader, CardTitle } from "@jewellery-retail/ui";

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";

export interface AddPurchaseOrderFormValues {
  poNumber: string;
  supplierId: string;
  expectedDate: string; // yyyy-mm-dd
  items: string; // numeric input as string
  total: string; // numeric input as string
  notes: string;
}

interface AddPurchaseOrderFormProps {
  onSubmit: (po: PurchaseOrder) => void;
  onCancel: () => void;
  disabled?: boolean;
}

const defaultValues: AddPurchaseOrderFormValues = {
  poNumber: "",
  supplierId: "",
  expectedDate: "",
  items: "",
  total: "",
  notes: "",
};

function toNumberOrUndefined(v: string): number | undefined {
  const n = Number(v);
  if (!Number.isFinite(n)) return undefined;
  if (n < 0) return undefined;
  return n;
}

export function AddPurchaseOrderForm({ onSubmit, onCancel, disabled = false }: AddPurchaseOrderFormProps) {
  const { data: suppliers } = useSuppliers();
  const suppliersList = suppliers ?? [];

  const [values, setValues] = useState<AddPurchaseOrderFormValues>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof AddPurchaseOrderFormValues, string>>>({});

  const supplierById = useMemo(() => suppliersList.find((s) => s.id === values.supplierId) ?? null, [suppliersList, values.supplierId]);

  const set = useCallback((key: keyof AddPurchaseOrderFormValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const validate = useCallback(() => {
    const e: Partial<Record<keyof AddPurchaseOrderFormValues, string>> = {};
    if (!values.poNumber.trim()) e.poNumber = "PO number is required.";
    if (!values.supplierId.trim()) e.supplierId = "Supplier is required.";
    if (!values.expectedDate.trim()) e.expectedDate = "Expected date is required.";

    const items = toNumberOrUndefined(values.items);
    if (items == null) e.items = "Enter item count.";
    else if (!Number.isInteger(items) || items <= 0) e.items = "Items must be a positive integer.";

    const total = toNumberOrUndefined(values.total);
    if (total == null) e.total = "Enter total amount.";
    else if (total <= 0) e.total = "Total must be greater than 0.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [values]);

  const submit = useCallback(
    (asDraft: boolean) => {
      if (!validate()) return;

      const items = toNumberOrUndefined(values.items) ?? 0;
      const total = toNumberOrUndefined(values.total) ?? 0;

      const status = asDraft ? "draft" : "approved";
      const po: PurchaseOrder = {
        id: `po-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        poNumber: values.poNumber.trim(),
        supplierId: values.supplierId.trim(),
        supplierName: supplierById?.name ?? "—",
        total,
        status,
        expectedDate: values.expectedDate,
        createdAt: new Date().toISOString(),
        items,
      };

      onSubmit(po);
    },
    [onSubmit, supplierById, validate, values]
  );

  return (
    <div className="min-w-0 space-y-6">
      <p className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="inline-block h-4 w-4 rounded-full bg-amber-100 text-center text-[10px] leading-4 text-amber-600" aria-hidden>
          i
        </span>
        <span>
          Fields marked in <span className="font-medium text-red-500">red</span> are required.
        </span>
      </p>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">Purchase Order</CardTitle>
                <p className="text-sm text-zinc-500">Identifier, supplier, and expected delivery date</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                PO
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">PO Number</label>
                <input className={inputClass} value={values.poNumber} onChange={(e) => set("poNumber", e.target.value)} placeholder="PO-2305" />
                {errors.poNumber ? <p className="mt-1 text-xs text-red-600">{errors.poNumber}</p> : null}
              </div>

              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Supplier</label>
                <select className={inputClass} value={values.supplierId} onChange={(e) => set("supplierId", e.target.value)}>
                  <option value="">— Select supplier —</option>
                  {suppliersList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.supplierId ? <p className="mt-1 text-xs text-red-600">{errors.supplierId}</p> : null}
              </div>

              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Expected Date</label>
                <input type="date" className={inputClass} value={values.expectedDate} onChange={(e) => set("expectedDate", e.target.value)} />
                {errors.expectedDate ? <p className="mt-1 text-xs text-red-600">{errors.expectedDate}</p> : null}
              </div>

              {supplierById ? (
                <div className="lg:col-span-4">
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2">
                    <Badge variant="info" className="bg-amber-50 text-amber-800">
                      {supplierById.supplierType ? String(supplierById.supplierType).toUpperCase() : "Supplier"}
                    </Badge>
                    <span className="text-sm text-zinc-700">On-time rate: {supplierById.onTimeRate}%</span>
                    <span className="text-sm text-zinc-500">•</span>
                    <span className="text-sm text-zinc-700">Open orders: {supplierById.openOrders}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </CardBody>
        </Card>

        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Landmark className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">Items & Amount</CardTitle>
                <p className="text-sm text-zinc-500">Quantity and total purchase value</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                ITEMS
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Items (count)</label>
                <input className={inputClass} value={values.items} onChange={(e) => set("items", e.target.value)} placeholder="e.g. 8" />
                {errors.items ? <p className="mt-1 text-xs text-red-600">{errors.items}</p> : null}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Total Amount (₹)</label>
                <input className={inputClass} value={values.total} onChange={(e) => set("total", e.target.value)} placeholder="e.g. 560000" />
                {errors.total ? <p className="mt-1 text-xs text-red-600">{errors.total}</p> : null}
              </div>
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Notes (optional)</label>
                <textarea className={inputClass} rows={3} value={values.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Add any internal remarks..." />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Truck className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">Delivery & Tracking</CardTitle>
                <p className="text-sm text-zinc-500">Simplified overview for this PO draft</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                TRACK
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <p className="text-sm text-zinc-600">
              Once created, the PO will appear in <span className="font-medium text-zinc-900">Purchase orders</span> where you can approve and track delivery status.
            </p>
          </CardBody>
        </Card>

        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">Summary</CardTitle>
                <p className="text-sm text-zinc-500">Quick check before submit</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                REVIEW
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-2 pt-0">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700 space-y-1">
              <p>
                <span className="text-zinc-500">PO Number:</span> {values.poNumber.trim() ? values.poNumber : "—"}
              </p>
              <p>
                <span className="text-zinc-500">Supplier:</span> {supplierById?.name ?? "—"}
              </p>
              <p>
                <span className="text-zinc-500">Expected Date:</span> {values.expectedDate || "—"}
              </p>
              <p>
                <span className="text-zinc-500">Items:</span> {values.items || "—"}
              </p>
              <p>
                <span className="text-zinc-500">Total:</span> {values.total ? `₹${values.total}` : "—"}
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Sticky footer */}
        <div className="sticky bottom-0 left-0 right-0 flex flex-col gap-3 border-t border-zinc-200 bg-white px-0 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="ghost" onClick={onCancel} className="order-2 sm:order-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <div className="flex flex-wrap gap-3 order-1 sm:order-2">
            <Button type="button" variant="outline" disabled={disabled} onClick={() => submit(true)}>
              Save as Draft
            </Button>
            <Button
              type="button"
              className="bg-amber-500 text-white hover:bg-amber-600"
              disabled={disabled}
              onClick={() => submit(false)}
            >
              Create PO
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

