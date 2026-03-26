"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ArrowLeft, Download, FileText, Pencil, Receipt, Trash2, UserRound } from "lucide-react";

import type { Payment } from "@jewellery-retail/types";
import { usePayments } from "@jewellery-retail/hooks";
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Loader, PageHeader } from "@jewellery-retail/ui";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

const detailInputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-full min-h-[44px] bg-white";

function DetailField({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-900">{label}</label>
      <input readOnly value={String(value)} className={detailInputClass} />
    </div>
  );
}

function PaymentPrintContent({ payment }: { payment: Payment }) {
  return (
    <div className="space-y-4 bg-white p-6 text-black">
      <h1 className="text-2xl font-semibold">Payment {payment.reference}</h1>
      <div className="space-y-3">
        <DetailField label="Reference" value={payment.reference} />
        <DetailField label="Customer" value={payment.customerName} />
        <DetailField label="Invoice" value={payment.invoiceNumber} />
        <DetailField label="Method" value={payment.method.toUpperCase()} />
        <DetailField label="Status" value={payment.status} />
        <DetailField label="Date" value={dateFormat(payment.createdAt)} />
        <DetailField label="Amount" value={formatCurrency(payment.amount)} />
      </div>
    </div>
  );
}

export default function PaymentDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: payments, isLoading, error } = usePayments();
  const payment = payments.find((p) => p.id === id);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: payment ? `Payment-${payment.reference}` : "Payment",
    pageStyle: `
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .payment-print-only { padding: 24px; }
    `,
  });

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-red-800">
        <p className="font-medium">Failed to load payment</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

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
        title={payment.reference}
        description="Payment details in stock-add style layout."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Link href="/payments">
              <Button type="button" variant="outline" className="min-h-[44px] border-zinc-300 bg-zinc-100 px-6 text-zinc-900 hover:bg-zinc-200 sm:min-h-9">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={`/payments/${id}/edit`}>
              <Button type="button" variant="outline" className="min-h-[44px] border-amber-300 bg-amber-50 px-6 text-amber-700 hover:bg-amber-100 sm:min-h-9">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Link href={`/payments?deleted=${id}`}>
              <Button type="button" variant="outline" className="min-h-[44px] border-red-300 bg-red-50 px-6 text-red-600 hover:bg-red-100 sm:min-h-9">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </Link>
            <Badge variant={statusColor(payment.status)}>{payment.status}</Badge>
          </div>
        }
      />

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Payment Header Information</CardTitle>
            <p className="text-sm text-zinc-500">Core payment metadata and timeline details</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField label="Reference" value={payment.reference} />
            <DetailField label="Invoice number" value={payment.invoiceNumber} />
            <DetailField label="Method" value={payment.method.toUpperCase()} />
            <DetailField label="Date" value={dateFormat(payment.createdAt)} />
          </div>
        </CardBody>
      </Card>

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Customer & Amount Summary</CardTitle>
            <p className="text-sm text-zinc-500">Customer, status and payment value snapshot</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField label="Customer name" value={payment.customerName} />
            <DetailField label="Status" value={payment.status} />
            <DetailField label="Method" value={payment.method.toUpperCase()} />
            <DetailField label="Amount" value={formatCurrency(payment.amount)} />
          </div>
          <div className="rounded-lg border border-zinc-200 bg-amber-50/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-amber-600">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Total payment amount</p>
                <p className="text-2xl font-semibold text-zinc-900">{formatCurrency(payment.amount)}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-3 border-t border-zinc-100 bg-white pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-1 ml-auto flex justify-end sm:order-2">
          <Button
            type="button"
            onClick={() => handlePrint()}
            className="min-h-[44px] w-full bg-amber-500 text-white hover:bg-amber-600 sm:min-h-9 sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="sr-only" aria-hidden>
        <div ref={printRef} className="payment-print-only">
          <PaymentPrintContent payment={payment} />
        </div>
      </div>
    </div>
  );
}
