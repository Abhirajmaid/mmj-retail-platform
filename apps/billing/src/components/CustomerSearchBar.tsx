"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Home, FileText, Wallet, CreditCard } from "lucide-react";

import type { Customer, Invoice } from "@jewellery-retail/types";
import { useCustomers, useInvoices } from "@jewellery-retail/hooks";
import { Button, Card, Input } from "@jewellery-retail/ui";
import { formatCurrency } from "@jewellery-retail/utils";

const rightActions = [
  { label: "HOME", href: "/dashboard", icon: Home },
  { label: "SELL", href: "/bills/new", icon: FileText },
  { label: "LOAN", href: "/dashboard", icon: Wallet },
  { label: "UDHAAR", href: "/dashboard", icon: CreditCard },
];

type SearchMode = "customers" | "invoice";

export function CustomerSearchBar() {
  const { data: customers } = useCustomers();
  const { data: invoices } = useInvoices();
  const [mode, setMode] = useState<SearchMode>("customers");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState<"Mr" | "Mrs">("Mr");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [si, setSi] = useState("");

  // Invoice (Billing header style)
  const [billDate, setBillDate] = useState("");
  const [invCustomerName, setInvCustomerName] = useState("");
  const [invBillingName, setInvBillingName] = useState("");
  const [invPrefix, setInvPrefix] = useState("");
  const [invNo, setInvNo] = useState("");
  const [invFirmName, setInvFirmName] = useState("");
  const [invAccount, setInvAccount] = useState("");
  const [invSaleExecutive, setInvSaleExecutive] = useState("");
  const [invSaleMonth, setInvSaleMonth] = useState("");

  const hasCustomerSearchInput =
    firstName.trim() !== "" ||
    lastName.trim() !== "" ||
    mobile.trim() !== "" ||
    email.trim() !== "" ||
    aadhaar.trim() !== "" ||
    address.trim() !== "" ||
    pincode.trim() !== "" ||
    city.trim() !== "" ||
    state.trim() !== "" ||
    si.trim() !== "";

  const customerSearchTerms = useMemo(
    () =>
      [firstName, lastName, mobile, email, aadhaar, address, city, state].filter((s) => s.trim() !== ""),
    [firstName, lastName, mobile, email, aadhaar, address, city, state]
  );

  const matchingCustomers = useMemo(() => {
    if (mode !== "customers" || !hasCustomerSearchInput || customerSearchTerms.length === 0) return [];
    const lower = customerSearchTerms.map((t) => t.toLowerCase());
    return customers.filter((c) => {
      const searchable = `${c.name} ${c.phone} ${c.email} ${c.city} ${c.address ?? ""}`.toLowerCase();
      return lower.some((term) => searchable.includes(term));
    });
  }, [customers, mode, hasCustomerSearchInput, customerSearchTerms]);

  const hasInvoiceSearchInput =
    billDate !== "" ||
    invCustomerName.trim() !== "" ||
    invBillingName.trim() !== "" ||
    invPrefix.trim() !== "" ||
    invNo.trim() !== "" ||
    invFirmName.trim() !== "" ||
    invAccount.trim() !== "" ||
    invSaleExecutive.trim() !== "" ||
    invSaleMonth.trim() !== "";

  const matchingInvoices = useMemo(() => {
    if (mode !== "invoice") return [];
    let list = [...(invoices ?? [])];
    if (invCustomerName.trim()) {
      const q = invCustomerName.trim().toLowerCase();
      list = list.filter((inv) => inv.customerName.toLowerCase().includes(q));
    }

    // "Billing name" maps to invoice.customerName in our current Invoice type (no separate billingName field)
    if (invBillingName.trim()) {
      const q = invBillingName.trim().toLowerCase();
      list = list.filter((inv) => inv.customerName.toLowerCase().includes(q));
    }

    // Invoice prefix / number map to invoice.invoiceNumber (e.g. "IS-296")
    if (invPrefix.trim() || invNo.trim()) {
      const q = [invPrefix.trim(), invNo.trim()].filter(Boolean).join("-").toLowerCase();
      list = list.filter((inv) => inv.invoiceNumber.toLowerCase().includes(q));
    }

    // Bill date maps to issuedAt (YYYY-MM-DD match)
    if (billDate) {
      list = list.filter((inv) => inv.issuedAt?.slice(0, 10) === billDate);
    }

    // NOTE: firm/account/sale executive/month are UI-only for now (no backing fields on Invoice type).
    return list;
  }, [
    mode,
    invoices,
    billDate,
    invCustomerName,
    invBillingName,
    invPrefix,
    invNo,
    invFirmName,
    invAccount,
    invSaleExecutive,
    invSaleMonth,
  ]);

  const showCustomerResults = mode === "customers" && hasCustomerSearchInput;
  const showCustomerNoResults = showCustomerResults && matchingCustomers.length === 0;
  const showInvoiceResults = mode === "invoice" && hasInvoiceSearchInput;

  return (
    <div className="space-y-2">
      <Card className="p-4 md:p-5" padding="none">
        {/* Customers | Invoice toggle */}
        <div className="mb-4 flex gap-1 rounded-md border border-input p-0.5">
          <button
            type="button"
            onClick={() => setMode("customers")}
            className={`flex-1 rounded py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              mode === "customers"
                ? "border border-zinc-300 bg-transparent text-zinc-950"
                : "border-transparent bg-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Customers
          </button>
          <button
            type="button"
            onClick={() => setMode("invoice")}
            className={`flex-1 rounded py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              mode === "invoice"
                ? "border border-zinc-300 bg-transparent text-zinc-950"
                : "border-transparent bg-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Invoice
          </button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 xl:gap-4">
            {mode === "customers" ? (
              <div className="col-span-full grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-5">
                {/* Customers: 5, 4, 3 layout (12 fields) */}
                <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="min-w-0 min-h-[44px]" />
                <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="min-w-0 min-h-[44px]" />
                <div className="min-w-0 flex min-h-[44px] items-center">
                  <label className="sr-only" htmlFor="title-select">Title</label>
                  <select id="title-select" value={title} onChange={(e) => setTitle(e.target.value as "Mr" | "Mrs")} className="h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                  </select>
                </div>
                <div className="min-w-0 flex min-h-[44px] items-center">
                  <label className="sr-only" htmlFor="gender-select">Gender</label>
                  <select id="gender-select" value={gender} onChange={(e) => setGender(e.target.value as "Male" | "Female")} className="h-10 w-full min-w-0 min-h-[44px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <Input placeholder="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} className="min-w-0 min-h-[44px]" />
                <Input placeholder="Email ID" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="min-w-0 min-h-[44px]" />
                <Input placeholder="Aadhaar number" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} className="min-w-0 min-h-[44px]" />
                <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="min-w-0 min-h-[44px]" />
                <Input placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="min-w-0 min-h-[44px]" />
                <Input placeholder="City / Village" value={city} onChange={(e) => setCity(e.target.value)} className="min-w-0 min-h-[44px]" />
                <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="min-w-0 min-h-[44px]" />
                <Input placeholder="SI" value={si} onChange={(e) => setSi(e.target.value)} className="min-w-0 min-h-[44px]" />
              </div>
            ) : (
              <div className="col-span-full grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-5">
                {/* Invoice: same styling as customers (placeholder only, min-h-[44px]) */}
                <Input
                  placeholder="Bill date"
                  type="date"
                  value={billDate}
                  onChange={(e) => setBillDate(e.target.value)}
                  className="min-w-0 min-h-[44px]"
                />
                <Input
                  placeholder="Search or type"
                  value={invCustomerName}
                  onChange={(e) => setInvCustomerName(e.target.value)}
                  className="min-w-0 min-h-[44px]"
                />
                <Input
                  placeholder="Billing name"
                  value={invBillingName}
                  onChange={(e) => setInvBillingName(e.target.value)}
                  className="min-w-0 min-h-[44px]"
                />
                <Input
                  placeholder="Invoice prefix"
                  value={invPrefix}
                  onChange={(e) => setInvPrefix(e.target.value)}
                  className="min-w-0 min-h-[44px]"
                />
                <Input
                  placeholder="Invoice no."
                  value={invNo}
                  onChange={(e) => setInvNo(e.target.value)}
                  className="min-w-0 min-h-[44px]"
                />
                <Input
                  placeholder="Firm name"
                  value={invFirmName}
                  onChange={(e) => setInvFirmName(e.target.value)}
                  className="min-w-0 min-h-[44px]"
                />
                <Input
                  placeholder="Account"
                  value={invAccount}
                  onChange={(e) => setInvAccount(e.target.value)}
                  className="min-w-0 min-h-[44px]"
                />
                <Input
                  placeholder="Sale executive"
                  value={invSaleExecutive}
                  onChange={(e) => setInvSaleExecutive(e.target.value)}
                  className="min-w-0 min-h-[44px]"
                />
                <Input
                  placeholder="Sale month"
                  value={invSaleMonth}
                  onChange={(e) => setInvSaleMonth(e.target.value)}
                  className="min-w-0 min-h-[44px]"
                />
              </div>
            )}
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-zinc-100 pt-4 lg:border-l lg:border-t-0 lg:pt-0 lg:pl-4">
            {rightActions.map((action) => (
              <Button key={action.label} variant="outline" className="min-h-[44px] border-black bg-white text-black hover:bg-zinc-100 hover:text-black" asChild>
                <Link href={action.href}>
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {(mode === "customers" && hasCustomerSearchInput) || (mode === "invoice" && hasInvoiceSearchInput) ? (
        <p className="text-xs text-zinc-500">
          {mode === "customers"
            ? "Search by mobile number to find an existing customer or fill details to create a new one."
            : "Search by invoice number, customer, amount, or status. Click a row to open the invoice."}
        </p>
      ) : null}

      {showCustomerResults && (
        <Card className="overflow-hidden p-0" padding="none">
          {matchingCustomers.length > 0 ? (
            <ul className="max-h-[280px] overflow-auto">
              {matchingCustomers.map((c) => (
                <CustomerRow key={c.id} customer={c} />
              ))}
            </ul>
          ) : showCustomerNoResults ? (
            <div className="flex flex-col gap-4 p-6">
              <p className="text-sm font-medium text-zinc-700">No customer found</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="min-h-[44px] border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-primary/5 hover:text-[hsl(var(--primary))]" asChild>
                  <Link href="/customers/new">Create New Customer</Link>
                </Button>
                <Button className="min-h-[44px] bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-500" asChild>
                  <Link href="/bills/new">Create New Bill</Link>
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      )}

      {showInvoiceResults && (
        <Card className="overflow-hidden p-0" padding="none">
          {matchingInvoices.length > 0 ? (
            <ul className="max-h-[280px] overflow-auto">
              {matchingInvoices.map((inv) => (
                <InvoiceRow key={inv.id} invoice={inv} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-4 p-6">
              <p className="text-sm font-medium text-zinc-700">No invoice found</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="min-h-[44px] border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-primary/5 hover:text-[hsl(var(--primary))]"
                  asChild
                >
                  <Link href="/invoices">View Invoices</Link>
                </Button>
                <Button className="min-h-[44px] bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-500" asChild>
                  <Link href="/bills/new">Create New Bill</Link>
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function CustomerRow({ customer }: { customer: Customer }) {
  return (
    <li>
      <Link
        href={`/customers/${customer.id}`}
        className="flex min-h-[44px] items-center justify-between gap-4 border-b border-zinc-100 px-4 py-3 transition-colors hover:bg-zinc-50 last:border-b-0"
      >
        <span className="font-medium text-zinc-950">{customer.name}</span>
        <span className="text-sm text-zinc-500">{customer.phone}</span>
        <span className="text-sm text-zinc-500">{customer.city}</span>
      </Link>
    </li>
  );
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  return (
    <li>
      <Link
        href={`/invoices/${invoice.id}`}
        className="flex min-h-[44px] items-center justify-between gap-4 border-b border-zinc-100 px-4 py-3 transition-colors hover:bg-zinc-50 last:border-b-0"
      >
        <span className="font-medium text-zinc-950">{invoice.invoiceNumber}</span>
        <span className="text-sm text-zinc-500">{invoice.customerName}</span>
        <span className="text-sm text-zinc-500">{formatCurrency(invoice.amount)}</span>
        <span className="text-sm text-zinc-500">{invoice.status}</span>
      </Link>
    </li>
  );
}
