"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";

import type { Invoice } from "@jewellery-retail/types";
import { useInvoices } from "@jewellery-retail/hooks";
import {
  Badge,
  Button,
  Card,
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

const initialForm = {
  customerName: "",
  amount: "",
  dueDate: "",
};

export default function InvoicesPage() {
  const { data } = useInvoices();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [form, setForm] = useState(initialForm);
  const [isOpen, setIsOpen] = useState(false);

  const mergedInvoices = useMemo(() => [...invoices, ...data], [data, invoices]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Create, monitor, and download customer invoices across the billing workspace."
        actions={
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create invoice
          </Button>
        }
      />

      <Card className="p-6">
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
            {mergedInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
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
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={invoice.downloadUrl ?? "#"} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

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
