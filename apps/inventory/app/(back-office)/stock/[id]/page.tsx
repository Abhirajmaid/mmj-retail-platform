"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Activity, ArrowLeft, FileText, MapPin, Pencil, Package, Trash2 } from "lucide-react";

import { useStockMovements } from "@jewellery-retail/hooks";
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, PageHeader } from "@jewellery-retail/ui";
import { dateFormat } from "@jewellery-retail/utils";
import type { StockMovementView } from "@/src/types/stock";

function getStatusBadgeVariant(status: string): "default" | "success" | "warning" | "danger" | "info" {
  if (status === "completed") return "success";
  if (status === "pending") return "warning";
  return "default";
}

function orDash(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

export default function StockDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data } = useStockMovements();

  const movement = useMemo<StockMovementView | null>(() => {
    const found = (data ?? []).find((m) => m.id === params.id) ?? null;
    if (!found) return null;
    return {
      ...found,
      status: found.status === "completed" || found.status === "pending" ? found.status : "pending",
    };
  }, [data, params.id]);

  if (!movement) {
    return (
      <div className="min-w-0 space-y-4 sm:space-y-6">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Stock", href: "/stock" },
            { label: "Stock detail" },
          ]}
          title="Stock detail"
          description="Stock movement not found."
          actions={
            <Button variant="outline" onClick={() => router.push("/stock")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to stock
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
          { label: "Stock", href: "/stock" },
          { label: movement.productName },
        ]}
        title={movement.productName}
        description="Stock movement profile and delivery status."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => router.push("/stock")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/stock/add?movementId=${movement.id}`)}
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
                <CardTitle className="text-lg font-semibold text-zinc-900">Stock Movement</CardTitle>
                <p className="text-sm text-zinc-500">Product, movement type, and account status</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                STOCK
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">SKU</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(movement.sku)}
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Movement Type</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center capitalize">
                  {movement.type}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Status</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 flex items-center">
                  <Badge variant={getStatusBadgeVariant(movement.status)}>{movement.status}</Badge>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Date</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {dateFormat(movement.updatedAt)}
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
                <CardTitle className="text-lg font-semibold text-zinc-900">Location</CardTitle>
                <p className="text-sm text-zinc-500">Warehouse/shop context for this movement</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg:bg-amber-50">
                PLACE
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Location</label>
              <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                {orDash(movement.location)}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">Quantity & Amount</CardTitle>
                <p className="text-sm text-zinc-500">Units and completion state</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg:bg-amber-50">
                TOTAL
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Quantity</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {movement.quantity}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Processed</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {movement.status === "completed" ? "Yes" : "No"}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Remaining</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {movement.status === "pending" ? movement.quantity : 0}
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
                <p className="text-sm text-zinc-500">Operational signal for this movement</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                KPI
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Movement summary</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {movement.type} on {dateFormat(movement.updatedAt)}
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Completion state</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {movement.status === "completed" ? "Completed" : "Pending"}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

