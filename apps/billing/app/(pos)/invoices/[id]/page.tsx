"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ArrowLeft, Download, Pencil } from "lucide-react";

import type { Invoice } from "@jewellery-retail/types";
import { useInvoices } from "@jewellery-retail/hooks";
import { Badge, Button, Loader } from "@jewellery-retail/ui";
import { DeleteConfirmPopover } from "@/src/components/DeleteConfirmPopover";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-zinc-500">{label}</span>
      <span className="text-zinc-950">{value}</span>
    </div>
  );
}

function InvoicePrintContent({ invoice }: { invoice: Invoice }) {
  return (
    <div className="space-y-4 bg-white p-6 text-black">
      <h1 className="text-2xl font-semibold">Invoice {invoice.invoiceNumber}</h1>
      <div className="space-y-3">
        <DetailRow label="Customer" value={invoice.customerName} />
        <DetailRow label="Issued" value={dateFormat(invoice.issuedAt)} />
        <DetailRow label="Due date" value={dateFormat(invoice.dueDate)} />
        <DetailRow label="Payment method" value={invoice.paymentMethod} />
        <DetailRow label="Items" value={invoice.items} />
        <DetailRow label="Amount" value={formatCurrency(invoice.amount)} />
        <DetailRow label="Status" value={invoice.status} />
      </div>
    </div>
  );
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: invoices, isLoading, error } = useInvoices();
  const invoice = invoices.find((inv) => inv.id === id);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    router.push(`/invoices?deleted=${id}`);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: invoice ? `Invoice-${invoice.invoiceNumber}` : "Invoice",
    pageStyle: `
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .invoice-print-only { padding: 24px; }
    `,
  });

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-red-800">
        <p className="font-medium">Failed to load invoice</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

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
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            asChild
          >
            <Link href="/invoices" aria-label="Back to invoices">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-zinc-950">{invoice.invoiceNumber}</h1>
            <p className="text-sm text-zinc-500">Invoice details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusColor(invoice.status)}>{invoice.status}</Badge>
          <Button variant="outline" size="icon" className="h-9 w-9 text-zinc-600" asChild>
            <Link href={`/invoices/${id}/edit`} aria-label="Edit invoice">
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteConfirmPopover onConfirm={handleDelete} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailRow label="Customer" value={invoice.customerName} />
        <DetailRow label="Invoice number" value={invoice.invoiceNumber} />
        <DetailRow label="Issued" value={dateFormat(invoice.issuedAt)} />
        <DetailRow label="Due date" value={dateFormat(invoice.dueDate)} />
        <DetailRow label="Payment method" value={invoice.paymentMethod} />
        <DetailRow label="Items" value={invoice.items} />
        <DetailRow label="Amount" value={formatCurrency(invoice.amount)} />
        <DetailRow label="Status" value={invoice.status} />
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-100 pt-6">
        <Button variant="outline" asChild>
          <Link href="/invoices">Back to list</Link>
        </Button>
        <Button variant="outline" onClick={() => handlePrint()}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>

      <div className="sr-only" aria-hidden>
        <div ref={printRef} className="invoice-print-only">
          <InvoicePrintContent invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
