"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, FileText, HelpCircle, UserRound } from "lucide-react";

import { Button, Card, CardBody, CardHeader, CardTitle, PageHeader } from "@jewellery-retail/ui";

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";
const selectClass = `${inputClass} appearance-none bg-white`;

export default function CreateNewCustomerPage() {
  const router = useRouter();
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
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Customers", href: "/customers" },
          { label: "Create Customer" },
        ]}
        title="Create Customer"
        description="Fill customer details in stock-add style workflow."
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

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Customer Basic Details</CardTitle>
            <p className="text-sm text-zinc-500">Identity and contact details</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">First name</label><input className={inputClass} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">Last name</label><input className={inputClass} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">Mobile number</label><input className={inputClass} value={form.mobile} onChange={(e) => update("mobile", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">Title</label><select className={selectClass} value={form.title} onChange={(e) => update("title", e.target.value)}><option value="Mr">Mr</option><option value="Mrs">Mrs</option></select></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">Gender</label><select className={selectClass} value={form.gender} onChange={(e) => update("gender", e.target.value)}><option value="Male">Male</option><option value="Female">Female</option></select></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">DOB</label><input type="date" className={inputClass} value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">Email</label><input type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">Address</label><input className={inputClass} value={form.address} onChange={(e) => update("address", e.target.value)} /></div>
          </div>
        </CardBody>
      </Card>

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Additional Information</CardTitle>
            <p className="text-sm text-zinc-500">Location and compliance details</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">City</label><input className={inputClass} value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">State</label><input className={inputClass} value={form.state} onChange={(e) => update("state", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">Pin</label><input className={inputClass} value={form.pin} onChange={(e) => update("pin", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">Country</label><input className={inputClass} value={form.country} onChange={(e) => update("country", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">GST</label><input className={inputClass} value={form.gst} onChange={(e) => update("gst", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">PAN</label><input className={inputClass} value={form.pan} onChange={(e) => update("pan", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">Aadhaar</label><input className={inputClass} value={form.aadhaar} onChange={(e) => update("aadhaar", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-medium text-zinc-900">Type</label><input className={inputClass} value={form.type} onChange={(e) => update("type", e.target.value)} /></div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-3 border-t border-zinc-100 bg-white pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/customers" className="order-2 sm:order-1">
          <Button type="button" variant="ghost" className="min-h-[44px] w-full sm:min-h-9 sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </Link>
        <div className="order-1 flex justify-end sm:order-2">
          <Button type="button" className="min-h-[44px] w-full bg-amber-500 text-white hover:bg-amber-600 sm:min-h-9 sm:w-auto" onClick={() => router.push("/customers")}>
            Create Customer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
