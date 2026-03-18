"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Download, Pencil, Plus } from "lucide-react";

import type { Invoice } from "@jewellery-retail/types";
import { useInvoices } from "@jewellery-retail/hooks";
import {
  Badge,
  Button,
  Input,
  Modal,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";
import { DeleteConfirmPopover } from "@/src/components/DeleteConfirmPopover";

const initialForm = {
  customerName: "",
  amount: "",
  dueDate: "",
};

export default function InvoicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useInvoices();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => {
    const id = searchParams.get("deleted");
    return id ? new Set([id]) : new Set();
  });
  const [form, setForm] = useState(initialForm);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const mergedInvoices = useMemo(
    () => [...invoices, ...data].filter((inv) => !deletedIds.has(inv.id)),
    [data, invoices, deletedIds]
  );

  const filteredInvoices = useMemo(
    () =>
      mergedInvoices.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
          invoice.customerName.toLowerCase().includes(query.toLowerCase()) ||
          formatCurrency(invoice.amount).toLowerCase().includes(query.toLowerCase()) ||
          invoice.status.toLowerCase().includes(query.toLowerCase())
      ),
    [mergedInvoices, query]
  );

  const handleDeleteInvoice = (invoice: Invoice) => {
    setDeletedIds((prev) => new Set(prev).add(invoice.id));
    setInvoices((prev) => prev.filter((i) => i.id !== invoice.id));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Create, monitor, and download customer invoices across the billing workspace. Click a row to open the invoice."
        actions={
          <Button className="bg-amber-500 hover:bg-amber-600" onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create invoice
          </Button>
        }
      />

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by invoice number, customer, amount, or status"
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Invoice</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Issued</TableHeader>
            <TableHeader>Due</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
            <TableHeader className="text-right">Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow
              key={invoice.id}
              className="cursor-pointer hover:bg-zinc-50"
              onClick={() => router.push(`/invoices/${invoice.id}`)}
            >
              <TableCell className="font-medium text-zinc-950">{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>
                <Badge variant={statusColor(invoice.status)}>{invoice.status.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell>{dateFormat(invoice.issuedAt)}</TableCell>
              <TableCell>{dateFormat(invoice.dueDate)}</TableCell>
              <TableCell className="text-right font-medium text-zinc-950">
                {formatCurrency(invoice.amount)}
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-950" asChild>
                    <Link href={`/invoices/${invoice.id}/edit`} aria-label="Edit invoice">
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteConfirmPopover onConfirm={() => handleDeleteInvoice(invoice)} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500" asChild>
                    <a href={invoice.downloadUrl ?? "#"} download aria-label="Download">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Create invoice" size="lg">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Customer name"
            value={form.customerName}
            onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))}
          />
          <Input
            label="Invoice amount"
            type="number"
            value={form.amount}
            onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
          />
          <Input
            label="Due date"
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-amber-500 hover:bg-amber-600"
            onClick={() => {
              if (!form.customerName || !form.amount || !form.dueDate) {
                return;
              }

              setInvoices((current) => [
                {
                  id: crypto.randomUUID(),
                  invoiceNumber: `MMJ-${new Date().getTime().toString().slice(-4)}`,
                  customerId: "draft-customer",
                  customerName: form.customerName,
                  amount: Number(form.amount),
                  status: "draft",
                  issuedAt: new Date().toISOString(),
                  dueDate: form.dueDate,
                  paymentMethod: "Manual",
                  items: 1,
                  downloadUrl: "#",
                },
                ...current,
              ]);
              setForm(initialForm);
              setIsOpen(false);
            }}
          >
            Save invoice
          </Button>
        </div>
      </Modal>
    </div>
  );
}
