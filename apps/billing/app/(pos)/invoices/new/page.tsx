"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, FileText, HelpCircle, Receipt, UserRound } from "lucide-react";

import { Button, Card, CardBody, CardHeader, CardTitle, PageHeader } from "@jewellery-retail/ui";
import { formatCurrency } from "@jewellery-retail/utils";

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";
const selectClass = `${inputClass} appearance-none bg-white`;

export default function CreateInvoicePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: "",
    invoiceAmount: "",
    dueDate: new Date().toISOString().slice(0, 10),
    status: "draft",
    paymentMethod: "Manual",
    items: "1",
    notes: "",
  });

  const previewAmount = useMemo(() => {
    const value = Number(form.invoiceAmount);
    return Number.isFinite(value) && value > 0 ? formatCurrency(value) : formatCurrency(0);
  }, [form.invoiceAmount]);

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Invoices", href: "/invoices" },
          { label: "Create Invoice" },
        ]}
        title="Create Invoice"
        description="Fill invoice details in stock-add style workflow."
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-[44px] shrink-0 border-amber-200 bg-amber-50/50 text-amber-800 hover:bg-amber-100 sm:min-h-9"
          >
            <HelpCircle className="mr-1 h-4 w-4" />
            HELP
          </Button>
        }
      />

      <p className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="inline-block h-4 w-4 rounded-full bg-amber-100 text-center text-[10px] leading-4 text-amber-600" aria-hidden>
          i
        </span>
        <span>Fields marked in <span className="font-medium text-red-500">red</span> are required.</span>
      </p>

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Customer & Invoice Header</CardTitle>
            <p className="text-sm text-zinc-500">Customer, amount, due date and invoice status</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Customer Name</label>
              <input
                className={inputClass}
                placeholder="Customer name"
                value={form.customerName}
                onChange={(e) => setForm((c) => ({ ...c, customerName: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Invoice Amount</label>
              <input
                type="number"
                className={inputClass}
                placeholder="Amount"
                value={form.invoiceAmount}
                onChange={(e) => setForm((c) => ({ ...c, invoiceAmount: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Due Date</label>
              <input
                type="date"
                className={inputClass}
                value={form.dueDate}
                onChange={(e) => setForm((c) => ({ ...c, dueDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Status</label>
              <select
                className={selectClass}
                value={form.status}
                onChange={(e) => setForm((c) => ({ ...c, status: e.target.value }))}
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Billing Information</CardTitle>
            <p className="text-sm text-zinc-500">Payment method, item count and notes</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Payment Method</label>
              <input
                className={inputClass}
                placeholder="Payment method"
                value={form.paymentMethod}
                onChange={(e) => setForm((c) => ({ ...c, paymentMethod: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Items</label>
              <input
                type="number"
                className={inputClass}
                placeholder="Items"
                value={form.items}
                onChange={(e) => setForm((c) => ({ ...c, items: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="mb-1 block text-xs font-medium text-zinc-900">Notes</label>
              <input
                className={inputClass}
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm((c) => ({ ...c, notes: e.target.value }))}
              />
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-amber-50/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-amber-600">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Invoice Preview Amount</p>
                <p className="text-2xl font-semibold text-zinc-900">{previewAmount}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-3 border-t border-zinc-100 bg-white pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/invoices" className="order-2 sm:order-1">
          <Button type="button" variant="ghost" className="min-h-[44px] w-full sm:min-h-9 sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </Link>
        <div className="order-1 flex justify-end sm:order-2">
          <Button
            type="button"
            onClick={() => router.push("/invoices")}
            className="min-h-[44px] w-full bg-amber-500 text-white hover:bg-amber-600 sm:min-h-9 sm:w-auto"
          >
            Create Invoice
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
