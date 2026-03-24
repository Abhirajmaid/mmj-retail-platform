"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, FileText, Wallet, CreditCard, Package, ClipboardCheck, ShoppingBag, Wrench, Gift, MoreHorizontal } from "lucide-react";

import { Button, Card, Input, PageHeader } from "@jewellery-retail/ui";

const navTabs = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Sell", href: "/bills/new", icon: FileText },
  { label: "Purchase", href: "/dashboard", icon: ShoppingBag },
  { label: "Approval", href: "/dashboard", icon: ClipboardCheck },
  { label: "Order", href: "/dashboard", icon: Package },
  { label: "Repair", href: "/dashboard", icon: Wrench },
  { label: "Scheme", href: "/dashboard", icon: Gift },
  { label: "More", href: "/dashboard", icon: MoreHorizontal },
];

const actionTabs = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Sell", href: "/bills/new", icon: FileText },
  { label: "Loan", href: "/dashboard", icon: Wallet },
  { label: "Udhaar", href: "/dashboard", icon: CreditCard },
];

export default function CreateNewCustomerPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    title: "Mr",
    gender: "Male",
    dateOfBirth: "",
    address: "",
    email: "",
    city: "",
    state: "",
    pin: "",
    country: "India",
    gst: "",
    pan: "",
    aadhaar: "",
    type: "",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Customer"
        description="Add a new customer with the required details for jewelry billing."
      />

      <Card className="p-6" padding="none">
        <div className="border-b border-zinc-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-zinc-950">
            {form.firstName || form.lastName
              ? [form.title, form.firstName, form.lastName].filter(Boolean).join(" ")
              : "Customer details"}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-100 bg-zinc-50/50 px-6 py-3">
          {navTabs.map((tab) => (
            <Button key={tab.label} variant="outline" size="sm" className="border-zinc-200" asChild>
              <Link href={tab.href}>
                <tab.icon className="mr-1.5 h-4 w-4" />
                {tab.label}
              </Link>
            </Button>
          ))}
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="flex gap-2">
            <Input
              placeholder="ADD PRODUCT ID / BARCODE / RFID"
              className="flex-1"
              readOnly
              aria-readonly
            />
            <Button size="sm" className="shrink-0 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90">
              GO
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="RETURN PRODUCT ID / BARCODE / RFID"
              className="flex-1"
              readOnly
              aria-readonly
            />
            <Button variant="outline" size="sm" className="shrink-0 border-zinc-200">
              GO
            </Button>
          </div>
        </div>

        <div className="grid gap-4 border-t border-zinc-100 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Row 1: First name, Last name, Mobile number, Mr/Mrs dropdown */}
          <Input
            label="First name"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
          <Input
            label="Last name"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
          <Input
            label="Mobile number"
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">Title</label>
            <select
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
            </select>
          </div>

          {/* Row 2: Gender, DOB, Address, Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700" htmlFor="gender-select">Gender</label>
            <select
              id="gender-select"
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <Input
            label="DOB"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
          />
          <Input
            label="Address"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />

          {/* Row 3: City, State, Pin, Country */}
          <Input
            label="City"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
          <Input
            label="State"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
          />
          <Input
            label="Pin"
            value={form.pin}
            onChange={(e) => update("pin", e.target.value)}
          />
          <Input
            label="Country"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
          />

          {/* Row 4: GST, PAN, Aadhaar, Type */}
          <Input
            label="GST"
            value={form.gst}
            onChange={(e) => update("gst", e.target.value)}
          />
          <Input
            label="PAN"
            value={form.pan}
            onChange={(e) => update("pan", e.target.value)}
          />
          <Input
            label="Aadhaar"
            value={form.aadhaar}
            onChange={(e) => update("aadhaar", e.target.value)}
          />
          <Input
            label="Type"
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
          />
        </div>

        <div className="border-t border-zinc-100 px-6 py-4">
          <p className="mb-3 text-sm font-medium text-zinc-500">Action types</p>
          <div className="flex flex-wrap gap-2">
            {actionTabs.map((tab) => (
              <Button
                key={tab.label}
                variant="outline"
                size="sm"
                className="border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
                asChild
              >
                <Link href={tab.href}>
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-100 p-6">
          <Button variant="outline" asChild>
            <Link href="/customers">Cancel</Link>
          </Button>
          <Button
            className="bg-amber-500 hover:bg-amber-600"
            onClick={() => {
              // TODO: submit to API and redirect to customer profile
            }}
          >
            Save customer
          </Button>
        </div>
      </Card>
    </div>
  );
}
