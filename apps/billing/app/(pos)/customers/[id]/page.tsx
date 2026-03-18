"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import { useCustomers } from "@jewellery-retail/hooks";
import { Badge, Button, Loader } from "@jewellery-retail/ui";
import { DeleteConfirmPopover } from "@/src/components/DeleteConfirmPopover";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-zinc-500">{label}</span>
      <span className="text-zinc-950">{value}</span>
    </div>
  );
}

export default function CustomerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: customers, isLoading, error } = useCustomers();
  const customer = customers.find((c) => c.id === id);

  const handleDelete = () => {
    router.push(`/customers?deleted=${id}`);
  };

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
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            asChild
          >
            <Link href="/customers" aria-label="Back to customers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-zinc-950">{customer.name}</h1>
            <p className="text-sm text-zinc-500">Customer profile</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusColor(customer.status)}>{customer.status}</Badge>
          <Button variant="outline" size="icon" className="h-9 w-9 text-zinc-600" asChild>
            <Link href={`/customers/${id}/edit`} aria-label="Edit customer">
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteConfirmPopover onConfirm={handleDelete} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INFO_FIELDS.map(({ key, label }) => (
          <DetailRow key={key} label={label} value={getDisplayValue(customer, key)} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailRow label="Lifetime spend" value={formatCurrency(customer.totalSpend)} />
        <DetailRow label="Outstanding balance" value={formatCurrency(customer.outstandingBalance)} />
      </div>

      <div>
        <span className="text-sm font-medium text-zinc-500">Segment</span>
        <Badge variant="info" className="mt-1">
          {customer.segment}
        </Badge>
      </div>

      <div className="border-t border-zinc-100 pt-6">
        <h2 className="mb-2 text-lg font-semibold text-zinc-950">Purchase history</h2>
        <p className="mb-4 text-sm text-zinc-500">Recent invoices and payments.</p>
        {customer.purchaseHistory.length === 0 ? (
          <p className="text-sm text-zinc-500">No purchases yet.</p>
        ) : (
          <div className="space-y-3">
            {customer.purchaseHistory.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between border-b border-zinc-100 py-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-zinc-950">{purchase.invoiceNumber}</p>
                  <p className="text-sm text-zinc-500">{dateFormat(purchase.date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-zinc-950">{formatCurrency(purchase.amount)}</p>
                  <Badge variant={statusColor(purchase.status)}>{purchase.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
