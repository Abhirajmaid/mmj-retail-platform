"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Activity, ArrowLeft, CheckCircle2, FileText, Landmark, MapPin, Pencil, Trash2, Truck } from "lucide-react";

import { usePurchaseOrders, useSuppliers } from "@jewellery-retail/hooks";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  PageHeader,
} from "@jewellery-retail/ui";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

function orDash(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

export default function PurchaseOrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

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

  if (!po) {
    return (
      <div className="min-w-0 space-y-4 sm:space-y-6">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Purchase orders", href: "/purchase-orders" },
            { label: "Purchase order detail" },
          ]}
          title="Purchase order detail"
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
          { label: po.poNumber },
        ]}
        title={po.poNumber}
        description="Purchase order profile and delivery details."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => router.push("/purchase-orders")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {po.status !== "approved" ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/purchase-orders/approve/${po.id}`)}
                className="border-amber-200 text-amber-800 hover:bg-amber-50"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/purchase-orders/add")}
              className="border-amber-200 text-amber-800 hover:bg-amber-50"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="min-w-0 space-y-6">
        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">PO Information</CardTitle>
                <p className="text-sm text-zinc-500">Supplier, status, and expected delivery</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                PO
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">PO Number</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(po.poNumber)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Supplier</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(po.supplierName)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Status</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  <Badge variant={statusColor(po.status)}>{po.status.replaceAll("_", " ")}</Badge>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Created</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {dateFormat(po.createdAt)}
                </div>
              </div>
              <div className="lg:col-span-3">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Expected Delivery</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {dateFormat(po.expectedDate)}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">Supplier Contact & Location</CardTitle>
                <p className="text-sm text-zinc-500">Communication and address details</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                CONTACT
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Contact Person</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier ? orDash(supplier.contactPerson) : "—"}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Phone</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier ? orDash(supplier.phone) : "—"}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Alternate Phone</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier ? orDash(supplier.alternatePhone) : "—"}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Email</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier ? orDash(supplier.email) : "—"}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Website</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier ? orDash(supplier.website) : "—"}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">City</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier ? orDash(supplier.city) : "—"}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">State</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier ? orDash(supplier.state) : "—"}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Pincode</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier ? orDash(supplier.pincode) : "—"}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Address</label>
              <div className="min-h-[132px] rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-zinc-900 whitespace-pre-wrap">
                {supplier ? orDash(supplier.fullAddress) : "—"}
              </div>
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
                <CardTitle className="text-lg font-semibold text-zinc-900">Financials</CardTitle>
                <p className="text-sm text-zinc-500">Items count and total amount</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                TOTAL
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Items</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {po.items}
                </div>
              </div>
              <div className="lg:col-span-3">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Total Amount</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {formatCurrency(po.total)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Supplier On-time Rate</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier ? `${supplier.onTimeRate}%` : "—"}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Delivery Status</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {po.status.replaceAll("_", " ")}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">Performance</CardTitle>
                <p className="text-sm text-zinc-500">Fulfilment signal from supplier</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                KPI
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Expected Delivery</label>
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
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Fulfilment Health</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier && supplier.onTimeRate != null ? (
                    <span className={supplier.onTimeRate >= 90 ? "text-emerald-700" : "text-amber-700"}>
                      {supplier.onTimeRate}% on-time
                    </span>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
              <div className="lg:col-span-4">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Total</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {formatCurrency(po.total)}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

