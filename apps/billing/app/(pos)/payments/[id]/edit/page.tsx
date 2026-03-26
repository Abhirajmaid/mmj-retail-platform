"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown, FileText, Save, UserRound } from "lucide-react";

import type { Payment } from "@jewellery-retail/types";
import { usePayments } from "@jewellery-retail/hooks";
import { Button, Card, CardBody, CardHeader, CardTitle, Loader, PageHeader } from "@jewellery-retail/ui";

const emptyForm = {
  customerName: "",
  amount: "",
  method: "upi" as Payment["method"],
  status: "pending" as Payment["status"],
  invoiceNumber: "",
};

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";
const selectClass = `${inputClass} appearance-none bg-white pr-10`;

export default function EditPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: payments, isLoading } = usePayments();
  const payment = payments.find((p) => p.id === id);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!payment) return;
    setForm({
      customerName: payment.customerName ?? "",
      amount: String(payment.amount ?? ""),
      method: payment.method ?? "upi",
      status: payment.status ?? "pending",
      invoiceNumber: payment.invoiceNumber ?? "",
    });
  }, [payment]);

  if (isLoading || !payment) {
    if (!isLoading && !payment) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-zinc-700">
          <p className="font-medium">Payment not found</p>
          <Link href="/payments" className="text-sm text-[hsl(var(--primary))] hover:underline">
            Back to payments
          </Link>
        </div>
      );
    }
    return <Loader label="Loading payment…" size="lg" />;
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Edit Payment"
        description="Update payment details with stock-style form layout."
      />

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Customer & Payment Details</CardTitle>
            <p className="text-sm text-zinc-500">Edit customer, amount, method, status and invoice number</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Customer name</label>
              <input
                value={form.customerName}
                onChange={(e) => setForm((c) => ({ ...c, customerName: e.target.value }))}
                className={inputClass}
                placeholder="Customer name"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm((c) => ({ ...c, amount: e.target.value }))}
                className={inputClass}
                placeholder="Amount"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Invoice number</label>
              <input
                value={form.invoiceNumber}
                onChange={(e) => setForm((c) => ({ ...c, invoiceNumber: e.target.value }))}
                className={inputClass}
                placeholder="Invoice number"
              />
            </div>
            <div className="relative">
              <label className="mb-1 block text-xs font-medium text-zinc-900">Method</label>
              <select
                value={form.method}
                onChange={(e) => setForm((c) => ({ ...c, method: e.target.value as Payment["method"] }))}
                className={selectClass}
              >
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="bank">Bank</option>
                <option value="cash">Cash</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[38px] h-4 w-4 text-zinc-400" />
            </div>
            <div className="relative">
              <label className="mb-1 block text-xs font-medium text-zinc-900">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((c) => ({ ...c, status: e.target.value as Payment["status"] }))}
                className={selectClass}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[38px] h-4 w-4 text-zinc-400" />
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
            <CardTitle className="text-lg font-semibold text-zinc-900">Preview</CardTitle>
            <p className="text-sm text-zinc-500">Quick summary of updated payment values</p>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="rounded-lg border border-zinc-200 bg-amber-50/30 p-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p className="text-zinc-700"><span className="font-medium text-zinc-900">Customer:</span> {form.customerName || "—"}</p>
              <p className="text-zinc-700"><span className="font-medium text-zinc-900">Amount:</span> {form.amount || "0"}</p>
              <p className="text-zinc-700"><span className="font-medium text-zinc-900">Invoice:</span> {form.invoiceNumber || "—"}</p>
              <p className="text-zinc-700"><span className="font-medium text-zinc-900">Method:</span> {form.method.toUpperCase()}</p>
              <p className="text-zinc-700"><span className="font-medium text-zinc-900">Status:</span> {form.status}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-3 border-t border-zinc-100 bg-white pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`/payments/${id}`} className="order-2 sm:order-1">
          <Button type="button" variant="ghost" className="min-h-[44px] w-full sm:min-h-9 sm:w-auto">
            Cancel
          </Button>
        </Link>
        <div className="order-1 flex justify-end sm:order-2">
          <Button
            type="button"
            className="min-h-[44px] w-full bg-amber-500 text-white hover:bg-amber-600 sm:min-h-9 sm:w-auto"
            onClick={() => router.push(`/payments/${id}`)}
          >
            <Save className="mr-2 h-4 w-4" />
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
