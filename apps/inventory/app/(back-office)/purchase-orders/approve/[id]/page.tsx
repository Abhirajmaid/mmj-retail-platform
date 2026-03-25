"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, Truck } from "lucide-react";

import { usePurchaseOrders, useSuppliers } from "@jewellery-retail/hooks";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  PageHeader,
  useToast,
} from "@jewellery-retail/ui";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

function orDash(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

export default function ApprovePurchaseOrderPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const toast = useToast();

  const { data: purchaseOrders } = usePurchaseOrders();
  const { data: suppliers } = useSuppliers();

  const po = useMemo(
    () => (purchaseOrders ?? []).find((p) => p.id === params.id) ?? null,
    [purchaseOrders, params.id]
  );

  const supplier = useMemo(() => {
    if (!po) return null;
    return (suppliers ?? []).find((s) => s.id === po.supplierId) ?? null;
  }, [po, suppliers]);

  const [submitting, setSubmitting] = useState(false);
  const [approved, setApproved] = useState(false);

  const onCancel = () => router.push(`/purchase-orders/${params.id}`);

  const onApprove = () => {
    if (!po || submitting) return;
    setSubmitting(true);
    try {
      // UI-only approval: no dedicated API endpoint exists in this repo.
      setApproved(true);
      toast.toast("PO approved successfully.", "success");
    } finally {
      setSubmitting(false);
      // Navigate back after the user approves.
      router.push(`/purchase-orders/${po.id}`);
    }
  };

  if (!po) {
    return (
      <div className="min-w-0 space-y-4 sm:space-y-6">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Purchase orders", href: "/purchase-orders" },
            { label: "Approve PO" },
          ]}
          title="Approve PO"
          description="Purchase order not found in the current list."
          actions={
            <Button variant="outline" onClick={() => router.push("/purchase-orders")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to PO list
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Purchase orders", href: "/purchase-orders" },
          { label: po.poNumber, href: `/purchase-orders/${po.id}` },
          { label: "Approve PO" },
        ]}
        title={`Approve ${po.poNumber}`}
        description="Review details and confirm approval."
        actions={
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            {approved ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg font-semibold text-zinc-900">Approval Confirmation</CardTitle>
              <p className="text-sm text-zinc-500">Status: {po.status.replaceAll("_", " ")}</p>
            </div>
            <Badge variant={statusColor(po.status)}>{po.status.replaceAll("_", " ")}</Badge>
          </div>
        </CardHeader>

        <CardBody className="space-y-4 pt-0">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-zinc-900">Supplier</label>
              <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                {orDash(po.supplierName)}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Created</label>
              <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                {dateFormat(po.createdAt)}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Expected delivery</label>
              <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                {dateFormat(po.expectedDate)}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Items</label>
              <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                {po.items}
              </div>
            </div>
            <div className="lg:col-span-3">
              <label className="mb-1 block text-xs font-medium text-zinc-900">Total amount</label>
              <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                {formatCurrency(po.total)}
              </div>
            </div>
            <div className="lg:col-span-4">
              <label className="mb-1 block text-xs font-medium text-zinc-900">Delivery context</label>
              <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                {supplier ? (
                  <>
                    <Truck className="mr-2 h-4 w-4 text-zinc-600" />
                    Supplier on-time rate: <span className="font-medium text-zinc-950">{supplier.onTimeRate}%</span>
                    <span className="mx-2 text-zinc-300">•</span>
                    Open orders: <span className="font-medium text-zinc-950">{supplier.openOrders}</span>
                  </>
                ) : (
                  "—"
                )}
              </div>
            </div>
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
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={onCancel}
          >
            Back
          </Button>
          <Button
            type="button"
            className="bg-amber-500 text-white hover:bg-amber-600"
            disabled={submitting || po.status === "approved"}
            onClick={onApprove}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve PO
          </Button>
        </div>
      </div>
    </div>
  );
}

