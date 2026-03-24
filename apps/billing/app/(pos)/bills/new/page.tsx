"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, FileText, ShoppingBag, ClipboardCheck, Package, Wrench, Gift, MoreHorizontal } from "lucide-react";

import type { Invoice } from "@jewellery-retail/types";
import { useCustomers } from "@jewellery-retail/hooks";
import { Button, Card, Input, PageHeader } from "@jewellery-retail/ui";
import { formatCurrency } from "@jewellery-retail/utils";

const navTabs = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Sell", href: "/bills/new", icon: FileText, active: true },
  { label: "Purchase", href: "/dashboard", icon: ShoppingBag },
  { label: "Approval", href: "/dashboard", icon: ClipboardCheck },
  { label: "Order", href: "/dashboard", icon: Package },
  { label: "Repair", href: "/dashboard", icon: Wrench },
  { label: "Scheme", href: "/dashboard", icon: Gift },
  { label: "More", href: "/dashboard", icon: MoreHorizontal },
];

const emptyLineItem = {
  metal: "",
  category: "",
  name: "",
  productCode: "",
  qty: 1,
  grossWeight: "",
  packetWeight: "",
  netWeight: "",
  tagWeight: "",
  purity: "",
  wst: "",
  finePurchase: "",
  valuePerGram: "",
  fineWeight: "",
  valuePerGramWeight: "",
  fineFineWeight: "",
  cgst: "",
  sgst: "",
  igst: "",
  price: "",
  total: 0,
};

export default function CreateNewBillPage() {
  const router = useRouter();
  const { data: customers } = useCustomers();
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [returnProductSearch, setReturnProductSearch] = useState("");
  const [header, setHeader] = useState({
    billDate: new Date().toISOString().slice(0, 10),
    customerName: "",
    billingName: "",
    invoicePrefix: "IS",
    invoiceNumber: "296",
    firmName: "",
    account: "Sales Gold",
    saleExecutive: "STAFF",
    saleMonth: new Date().toLocaleString("en-IN", { month: "short" }).toUpperCase(),
  });
  const [lineItems, setLineItems] = useState([{ ...emptyLineItem, total: 0 }]);

  const selectedCustomer = selectedCustomerId
    ? customers.find((c) => c.id === selectedCustomerId)
    : null;
  const matchingCustomers = customerSearch.trim()
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
          c.phone.includes(customerSearch)
      )
    : [];

  const addLineItem = () => setLineItems((prev) => [...prev, { ...emptyLineItem, total: 0 }]);
  const updateLineItem = (index: number, field: string, value: string | number) => {
    setLineItems((prev) => {
      const next = [...prev];
      const row = { ...next[index], [field]: value };
      const price = Number(row.price) || 0;
      const qty = Number(row.qty) || 0;
      row.total = price * qty;
      next[index] = row;
      return next;
    });
  };

  const grandTotal = lineItems.reduce((sum, row) => sum + row.total, 0);

  const handleSubmit = () => {
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      invoiceNumber: `${header.invoicePrefix}-${header.invoiceNumber}`,
      customerId: selectedCustomerId ?? "guest",
      customerName: (header.billingName || header.customerName || selectedCustomer?.name) ?? "Walk-in",
      amount: grandTotal,
      status: "draft",
      issuedAt: new Date().toISOString(),
      dueDate: header.billDate,
      paymentMethod: "Manual",
      items: lineItems.length,
      downloadUrl: "#",
    };
    // In a real app you would call API to create invoice; here we rely on invoices page local state or global store.
    // Redirect to invoices so the new bill appears in the list (invoices page has mergedInvoices from state + API).
    router.push("/invoices");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Bill"
        description="Link to a customer and add line items. Submit to create an invoice."
      />

      <Card className="p-6" padding="none">
        <div className="border-b border-zinc-100 px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-zinc-950">
              {selectedCustomer ? selectedCustomer.name : "Select or enter customer"}
            </span>
            {selectedCustomerId && (
              <span className="text-sm text-zinc-500">Cust Id: {selectedCustomerId}</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-100 bg-zinc-50/50 px-6 py-3">
          {navTabs.map((tab) =>
            tab.active ? (
              <Button
                key={tab.label}
                size="sm"
                className="bg-amber-500 text-white hover:bg-amber-600"
                asChild
              >
                <Link href={tab.href}>
                  <tab.icon className="mr-1.5 h-4 w-4" />
                  {tab.label}
                </Link>
              </Button>
            ) : (
              <Button key={tab.label} variant="outline" size="sm" className="border-zinc-200" asChild>
                <Link href={tab.href}>
                  <tab.icon className="mr-1.5 h-4 w-4" />
                  {tab.label}
                </Link>
              </Button>
            )
          )}
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="flex gap-2">
            <Input
              placeholder="ADD PRODUCT ID / BARCODE / RFID"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="min-h-10 flex-1"
            />
            <Button size="sm" className="shrink-0 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90">
              GO
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="RETURN PRODUCT ID / BARCODE / RFID"
              value={returnProductSearch}
              onChange={(e) => setReturnProductSearch(e.target.value)}
              className="min-h-10 flex-1"
            />
            <Button variant="outline" size="sm" className="shrink-0 border-zinc-200">
              GO
            </Button>
          </div>
        </div>

        <div className="border-b border-zinc-200 bg-zinc-100/80 px-6 py-4">
          <p className="mb-3 text-sm font-medium text-zinc-500">Billing header</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
            <Input
              label="Bill date"
              type="date"
              value={header.billDate}
              onChange={(e) => setHeader((h) => ({ ...h, billDate: e.target.value }))}
              className="h-9 text-xs"
            />
            <div className="relative">
              <Input
                label="Customer name"
                placeholder="Search or type"
                value={customerSearch || header.customerName}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setHeader((h) => ({ ...h, customerName: e.target.value }));
                }}
                className="h-9 text-xs"
              />
              {matchingCustomers.length > 0 && (
                <ul className="absolute top-full left-0 right-0 z-10 mt-1 max-h-40 overflow-auto rounded-md border border-zinc-200 bg-white shadow-lg">
                  {matchingCustomers.slice(0, 5).map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-100"
                        onClick={() => {
                          setSelectedCustomerId(c.id);
                          setCustomerSearch(c.name);
                          setHeader((h) => ({
                            ...h,
                            customerName: c.name,
                            billingName: c.name,
                          }));
                        }}
                      >
                        {c.name} — {c.phone}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Input
              label="Billing name"
              value={header.billingName}
              onChange={(e) => setHeader((h) => ({ ...h, billingName: e.target.value }))}
              className="h-9 text-xs"
            />
            <div className="flex gap-1">
              <Input
                label="Invoice prefix"
                value={header.invoicePrefix}
                onChange={(e) => setHeader((h) => ({ ...h, invoicePrefix: e.target.value }))}
                className="h-9 text-xs"
              />
              <Input
                label="Invoice no."
                value={header.invoiceNumber}
                onChange={(e) => setHeader((h) => ({ ...h, invoiceNumber: e.target.value }))}
                className="h-9 text-xs"
              />
            </div>
            <Input
              label="Firm name"
              value={header.firmName}
              onChange={(e) => setHeader((h) => ({ ...h, firmName: e.target.value }))}
              className="h-9 text-xs"
            />
            <Input
              label="Account"
              value={header.account}
              onChange={(e) => setHeader((h) => ({ ...h, account: e.target.value }))}
              className="h-9 text-xs"
            />
            <Input
              label="Sale executive"
              value={header.saleExecutive}
              onChange={(e) => setHeader((h) => ({ ...h, saleExecutive: e.target.value }))}
              className="h-9 text-xs"
            />
            <Input
              label="Sale month"
              value={header.saleMonth}
              onChange={(e) => setHeader((h) => ({ ...h, saleMonth: e.target.value }))}
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="space-y-4 px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-700">Line items</p>
            <Button variant="outline" size="sm" onClick={addLineItem}>
              Add line
            </Button>
          </div>
          {lineItems.map((row, index) => (
            <div
              key={index}
              className="rounded-xl border border-zinc-200 bg-zinc-50/30 p-4"
            >
              <p className="mb-3 text-xs font-medium text-zinc-500">Item {index + 1}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {[
                  { key: "metal", label: "Metal" },
                  { key: "category", label: "Category" },
                  { key: "name", label: "Name" },
                  { key: "productCode", label: "Pro code" },
                  { key: "qty", label: "Qty" },
                  { key: "grossWeight", label: "GS WT" },
                  { key: "packetWeight", label: "Pkt WT" },
                  { key: "netWeight", label: "Net WT" },
                  { key: "tagWeight", label: "Tag WT" },
                  { key: "purity", label: "Purity" },
                  { key: "wst", label: "WST" },
                  { key: "finePurchase", label: "F.PUR" },
                  { key: "valuePerGram", label: "V/A" },
                  { key: "fineWeight", label: "F.WT" },
                  { key: "valuePerGramWeight", label: "V/A WT" },
                  { key: "fineFineWeight", label: "FF WT" },
                  { key: "cgst", label: "CGST" },
                  { key: "sgst", label: "SGST" },
                  { key: "igst", label: "IGST" },
                ].map(({ key, label }) => (
                  <Input
                    key={key}
                    label={label}
                    value={(row as Record<string, string | number>)[key] ?? ""}
                    onChange={(e) => updateLineItem(index, key, e.target.value)}
                    className="h-9 text-xs"
                  />
                ))}
                <Input
                  label="Price"
                  value={row.price}
                  onChange={(e) => updateLineItem(index, "price", e.target.value)}
                  className="h-9 text-xs"
                />
                <div className="flex flex-col justify-end">
                  <span className="text-xs text-zinc-500">Total</span>
                  <span className="text-sm font-semibold text-zinc-950">
                    {formatCurrency(row.total)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-end gap-4 border-t border-zinc-100 p-6 sm:flex-row sm:justify-end">
          <p className="text-2xl font-semibold text-zinc-950">{formatCurrency(grandTotal)}</p>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="min-h-[44px]" asChild>
              <Link href="/invoices">Cancel</Link>
            </Button>
            <Button
              size="lg"
              className="min-h-[44px] bg-amber-500 hover:bg-amber-600"
              onClick={handleSubmit}
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
