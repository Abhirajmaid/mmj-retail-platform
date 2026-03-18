"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import type { Invoice } from "@jewellery-retail/types";
import { useInvoices } from "@jewellery-retail/hooks";
import { Button, Input, Loader, PageHeader } from "@jewellery-retail/ui";

const emptyForm = {
  customerName: "",
  amount: "",
  dueDate: "",
  status: "draft" as Invoice["status"],
};

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: invoices, isLoading } = useInvoices();
  const invoice = invoices.find((inv) => inv.id === id);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!invoice) return;
    setForm({
      customerName: invoice.customerName ?? "",
      amount: String(invoice.amount ?? ""),
      dueDate: invoice.dueDate ?? "",
      status: invoice.status ?? "draft",
    });
  }, [invoice]);

  if (isLoading || !invoice) {
    if (!isLoading && !invoice) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-zinc-700">
          <p className="font-medium">Invoice not found</p>
          <Link href="/invoices" className="text-sm text-[hsl(var(--primary))] hover:underline">
            Back to invoices
          </Link>
        </div>
      );
    }
    return <Loader label="Loading invoice…" size="lg" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Invoice"
        description="Update invoice details. Same fields as creation."
      />

      <div className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-6 sm:grid-cols-2">
        <Input
          label="Customer name"
          value={form.customerName}
          onChange={(e) => setForm((c) => ({ ...c, customerName: e.target.value }))}
        />
        <Input
          label="Invoice amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm((c) => ({ ...c, amount: e.target.value }))}
        />
        <Input
          label="Due date"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm((c) => ({ ...c, dueDate: e.target.value }))}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm((c) => ({ ...c, status: e.target.value as Invoice["status"] }))}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" asChild>
          <Link href={`/invoices/${id}`}>Cancel</Link>
        </Button>
        <Button
          className="bg-amber-500 hover:bg-amber-600"
          onClick={() => {
            // TODO: submit to API
            router.push(`/invoices/${id}`);
          }}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
