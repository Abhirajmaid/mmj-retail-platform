"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useCustomers } from "@jewellery-retail/hooks";
import { Button, Card, Input, Loader, PageHeader } from "@jewellery-retail/ui";

const emptyForm = {
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
};

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: customers, isLoading } = useCustomers();
  const customer = customers.find((c) => c.id === id);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!customer) return;
    const parts = (customer.name ?? "").trim().split(/\s+/);
    const firstName = customer.firstName ?? parts[0] ?? "";
    const lastName = customer.lastName ?? parts.slice(1).join(" ") ?? "";
    setForm({
      firstName,
      lastName,
      mobile: customer.phone ?? "",
      title: (customer.title as "Mr" | "Mrs") ?? "Mr",
      gender: (customer.gender as "Male" | "Female") ?? "Male",
      dateOfBirth: customer.dateOfBirth ?? "",
      address: customer.address ?? "",
      email: customer.email ?? "",
      city: customer.city ?? "",
      state: customer.state ?? "",
      pin: customer.pincode ?? "",
      country: customer.country ?? "India",
      gst: customer.gstNumber ?? "",
      pan: customer.panNumber ?? "",
      aadhaar: customer.aadhaarNumber ?? "",
      type: customer.userType ?? "",
    });
  }, [customer]);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  if (isLoading || !customer) {
    if (!isLoading && !customer) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-zinc-700">
          <p className="font-medium">Customer not found</p>
          <Link href="/customers" className="text-sm text-[hsl(var(--primary))] hover:underline">
            Back to customers
          </Link>
        </div>
      );
    }
    return <Loader label="Loading customer…" size="lg" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Customer"
        description="Update customer details. Same fields as creation."
      />

      <Card className="p-6" padding="none">
        <div className="border-b border-zinc-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-zinc-950">
            {form.firstName || form.lastName
              ? [form.title, form.firstName, form.lastName].filter(Boolean).join(" ")
              : "Customer details"}
          </h2>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="First name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
          <Input label="Last name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
          <Input label="Mobile number" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} />
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
          <Input label="DOB" type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
          <Input label="Address" value={form.address} onChange={(e) => update("address", e.target.value)} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />

          <Input label="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
          <Input label="State" value={form.state} onChange={(e) => update("state", e.target.value)} />
          <Input label="Pin" value={form.pin} onChange={(e) => update("pin", e.target.value)} />
          <Input label="Country" value={form.country} onChange={(e) => update("country", e.target.value)} />

          <Input label="GST" value={form.gst} onChange={(e) => update("gst", e.target.value)} />
          <Input label="PAN" value={form.pan} onChange={(e) => update("pan", e.target.value)} />
          <Input label="Aadhaar" value={form.aadhaar} onChange={(e) => update("aadhaar", e.target.value)} />
          <Input label="Type" value={form.type} onChange={(e) => update("type", e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-100 p-6">
          <Button variant="outline" asChild>
            <Link href={`/customers/${id}`}>Cancel</Link>
          </Button>
          <Button
            className="bg-amber-500 hover:bg-amber-600"
            onClick={() => {
              // TODO: submit to API
              router.push(`/customers/${id}`);
            }}
          >
            Save changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
