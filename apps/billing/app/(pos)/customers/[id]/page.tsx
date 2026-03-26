"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, FileText, Pencil, Trash2, UserRound } from "lucide-react";

import { useCustomers } from "@jewellery-retail/hooks";
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Loader, PageHeader } from "@jewellery-retail/ui";
import { dateFormat, formatCurrency } from "@jewellery-retail/utils";

const INFO_FIELDS: { key: string; label: string }[] = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "phone", label: "Mobile number" },
  { key: "title", label: "Title" },
  { key: "gender", label: "Gender" },
  { key: "dateOfBirth", label: "DOB" },
  { key: "address", label: "Address" },
  { key: "email", label: "Email" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "pincode", label: "Pin" },
  { key: "country", label: "Country" },
  { key: "gstNumber", label: "GST" },
  { key: "panNumber", label: "PAN" },
  { key: "aadhaarNumber", label: "Aadhaar" },
  { key: "userType", label: "Type" },
];

function getDisplayValue(customer: import("@jewellery-retail/types").Customer, key: string): string {
  const c = customer as Record<string, unknown>;
  if (key === "firstName" && !c.firstName && c.name) return (c.name as string).split(" ")[0] ?? "—";
  if (key === "lastName" && !c.lastName && c.name) return (c.name as string).split(" ").slice(1).join(" ") || "—";
  const v = c[key];
  if (v === undefined || v === null || v === "") return "—";
  return String(v);
}

const detailInputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-full min-h-[44px] bg-white";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-900">{label}</label>
      <input readOnly value={value} className={detailInputClass} />
    </div>
  );
}

export default function CustomerProfilePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: customers, isLoading, error } = useCustomers();
  const customer = customers.find((c) => c.id === id);

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-red-800">
        <p className="font-medium">Failed to load customer</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (isLoading || !customer) {
    if (!isLoading && !customer) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-zinc-700">
          <p className="font-medium">Customer not found</p>
          <Link href="/customers" className="text-sm text-[hsl(var(--primary))] hover:underline">
            Back to customers
          </Link>
        </div>
      );
    }
    return <Loader label="Loading customer…" size="lg" />;
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title={customer.name}
        description="Customer details in stock-add style layout."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Link href="/customers">
              <Button type="button" variant="outline" className="min-h-[44px] border-zinc-300 bg-zinc-100 px-6 text-zinc-900 hover:bg-zinc-200 sm:min-h-9">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={`/customers/${id}/edit`}>
              <Button type="button" variant="outline" className="min-h-[44px] border-amber-300 bg-amber-50 px-6 text-amber-700 hover:bg-amber-100 sm:min-h-9">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Link href={`/customers?deleted=${id}`}>
              <Button type="button" variant="outline" className="min-h-[44px] border-red-300 bg-red-50 px-6 text-red-600 hover:bg-red-100 sm:min-h-9">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </Link>
            <Badge variant="info">{customer.status}</Badge>
          </div>
        }
      />

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Customer Information</CardTitle>
            <p className="text-sm text-zinc-500">Identity and contact details</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INFO_FIELDS.map(({ key, label }) => (
              <DetailRow key={key} label={label} value={getDisplayValue(customer, key)} />
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Summary</CardTitle>
            <p className="text-sm text-zinc-500">Segment, spending and purchase history snapshot</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailRow label="Segment" value={customer.segment} />
            <DetailRow label="Lifetime spend" value={formatCurrency(customer.totalSpend)} />
            <DetailRow label="Outstanding balance" value={formatCurrency(customer.outstandingBalance)} />
            <DetailRow label="Last purchase" value={dateFormat(customer.lastPurchaseAt)} />
          </div>
          <div className="rounded-lg border border-zinc-200 bg-amber-50/30 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Purchase history</p>
            {customer.purchaseHistory.length === 0 ? (
              <p className="text-sm text-zinc-500">No purchases yet.</p>
            ) : (
              <div className="space-y-2">
                {customer.purchaseHistory.slice(0, 5).map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2">
                    <span className="text-sm font-medium text-zinc-900">{purchase.invoiceNumber}</span>
                    <span className="text-sm text-zinc-600">{formatCurrency(purchase.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-3 border-t border-zinc-100 bg-white pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-1 ml-auto flex justify-end sm:order-2">
          <Button type="button" className="min-h-[44px] w-full bg-amber-500 text-white hover:bg-amber-600 sm:min-h-9 sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
