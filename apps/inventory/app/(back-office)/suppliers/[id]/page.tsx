"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Activity, ArrowLeft, ClipboardPlus, CheckCircle2, Clock, FileText, Landmark, MapPin, Package, Pencil, Trash2, Truck } from "lucide-react";

import { usePurchaseOrders, useSuppliers } from "@jewellery-retail/hooks";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

import { getSupplierTypeLabel } from "@/src/components/suppliers/supplier-shared";
import { StockKPIs } from "@/src/components/stock/StockKPIs";

function orDash(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data } = useSuppliers();

  const supplier = useMemo(
    () => (data ?? []).find((s) => s.id === params.id) ?? null,
    [data, params.id]
  );

  const { data: purchaseOrders } = usePurchaseOrders();

  const supplierPurchaseOrders = useMemo(() => {
    if (!supplier) return [];
    return (purchaseOrders ?? []).filter((po) => po.supplierId === supplier.id);
  }, [purchaseOrders, supplier]);

  const purchaseOrderKpis = useMemo(() => {
    const total = supplierPurchaseOrders.length;
    const pending = supplierPurchaseOrders.filter((po) => po.status === "draft" || po.status === "in_transit").length;
    const approved = supplierPurchaseOrders.filter((po) => po.status === "approved").length;
    const received = supplierPurchaseOrders.filter((po) => po.status === "received").length;

    return [
      {
        label: "Total",
        count: total,
        icon: Package,
        color: "bg-amber-50",
        borderColor: "border-amber-200",
        iconColor: "text-amber-600",
        footer: total === 0 ? "No purchase orders" : `${total} total purchase orders`,
      },
      {
        label: "Pending",
        count: pending,
        icon: Clock,
        color: "bg-yellow-50",
        borderColor: "border-yellow-200",
        iconColor: "text-yellow-600",
        footer: pending === 0 ? "No pending purchase orders" : `${pending} pending purchase orders`,
      },
      {
        label: "Approved",
        count: approved,
        icon: ClipboardPlus,
        color: "bg-emerald-50",
        borderColor: "border-emerald-200",
        iconColor: "text-emerald-600",
        footer: approved === 0 ? "No approved purchase orders" : `${approved} approved purchase orders`,
      },
      {
        label: "Received",
        count: received,
        icon: Truck,
        color: "bg-blue-50",
        borderColor: "border-blue-200",
        iconColor: "text-blue-600",
        footer: received === 0 ? "No received purchase orders" : `${received} received purchase orders`,
      },
    ];
  }, [supplierPurchaseOrders]);

  if (!supplier) {
    return (
      <div className="min-w-0 space-y-4 sm:space-y-6">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Suppliers", href: "/suppliers" },
            { label: "Supplier detail" },
          ]}
          title="Supplier detail"
          description="Supplier not found in the current list."
          actions={
            <Button variant="outline" onClick={() => router.push("/suppliers")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to suppliers
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
          { label: "Suppliers", href: "/suppliers" },
          { label: supplier.name },
        ]}
        title={supplier.name}
        description="Supplier profile and account details."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => router.push("/suppliers")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/suppliers/add?edit=${supplier.id}`)}
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

      <PageHeader
        title="Purchase orders"
        description="Create, approve, and track incoming purchase orders with suppliers."
        actions={
          <>
            <Button variant="outline">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve PO
            </Button>
            <Button>
              <ClipboardPlus className="mr-2 h-4 w-4" />
              Create PO
            </Button>
          </>
        }
      />

      <div className="space-y-4 sm:space-y-6">
        <StockKPIs statusStats={purchaseOrderKpis} />

        <Card className="p-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>PO number</TableHeader>
                <TableHeader>Supplier</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Created</TableHeader>
                <TableHeader>Expected delivery</TableHeader>
                <TableHeader>Items</TableHeader>
                <TableHeader className="text-right">Total</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {supplierPurchaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-zinc-500">
                    No purchase orders found for this supplier.
                  </TableCell>
                </TableRow>
              ) : (
                supplierPurchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium text-zinc-950">{po.poNumber}</TableCell>
                    <TableCell>{po.supplierName}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor(po.status)}>{po.status.replaceAll("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>{dateFormat(po.createdAt)}</TableCell>
                    <TableCell>{dateFormat(po.expectedDate)}</TableCell>
                    <TableCell>{po.items}</TableCell>
                    <TableCell className="text-right font-medium text-zinc-950">{formatCurrency(po.total)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="min-w-0 space-y-6">
        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">Supplier Information</CardTitle>
                <p className="text-sm text-zinc-500">Business identity and account status details</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                SUPPLIER
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Supplier Name</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.name)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Supplier Type</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {getSupplierTypeLabel(supplier.supplierType)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Business Reg. No</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.businessRegistrationNumber)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">GST Number</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.gstNumber)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">PAN Number</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.panNumber)}
                </div>
              </div>
              <div className="lg:col-span-3">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Status</label>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant={statusColor(supplier.status)}>{supplier.status}</Badge>
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
                <CardTitle className="text-lg font-semibold text-zinc-900">Contact & Location</CardTitle>
                <p className="text-sm text-zinc-500">Primary contact, address, and communication channels</p>
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
                  {orDash(supplier.contactPerson)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Phone</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.phone)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Alternate Phone</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.alternatePhone)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Email</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.email)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Website</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.website)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">City</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.city)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">State</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.state)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Pincode</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.pincode)}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Full Address</label>
              <div className="min-h-[132px] rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-zinc-900 whitespace-pre-wrap">
                {orDash(supplier.fullAddress)}
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
                <CardTitle className="text-lg font-semibold text-zinc-900">Bank & Payment Details</CardTitle>
                <p className="text-sm text-zinc-500">Bank accounts, payment terms, and credit preferences</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                BANK
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Bank Name</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.bankName)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Account Number</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.accountNumber)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">IFSC Code</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.ifscCode)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Payment Terms</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.paymentTerms)}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Credit Limit (₹)</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier.creditLimit != null ? `₹${supplier.creditLimit.toLocaleString()}` : "—"}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Currency</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {orDash(supplier.currency)}
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
                <CardTitle className="text-lg font-semibold text-zinc-900">Performance & Catalog</CardTitle>
                <p className="text-sm text-zinc-500">Fulfilment KPIs and catalog coverage</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                KPI
              </Button>
            </div>
          </CardHeader>

          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Metal Types Supplied</label>
                {supplier.metalTypes?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {supplier.metalTypes.map((m) => (
                      <span key={m} className="rounded-xl bg-amber-500 px-3 py-1.5 text-sm font-medium text-white">
                        {m}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-500 flex items-center">
                    —
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Item Categories</label>
                {supplier.itemCategories?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {supplier.itemCategories.map((c) => (
                      <span key={c} className="rounded-xl bg-amber-500 px-3 py-1.5 text-sm font-medium text-white">
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-500 flex items-center">
                    —
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">On-time Rate (%)</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier.onTimeRate != null ? `${supplier.onTimeRate}%` : "—"}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Lead Time (days)</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier.leadTimeDays != null ? supplier.leadTimeDays : "—"}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Minimum Order Value (₹)</label>
                <div className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 flex items-center">
                  {supplier.minimumOrderValue != null ? `₹${supplier.minimumOrderValue.toLocaleString()}` : "—"}
                </div>
              </div>

              <div className="lg:col-span-4">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Notes / Comments</label>
                <div className="min-h-[132px] rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-zinc-900 whitespace-pre-wrap">
                  {orDash(supplier.notes)}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
