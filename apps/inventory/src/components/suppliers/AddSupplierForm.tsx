"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, FileText, MapPin, Landmark, Activity } from "lucide-react";
import { Button, Card, CardBody, CardHeader, CardTitle } from "@jewellery-retail/ui";
import type { Supplier, SupplierType } from "@jewellery-retail/types";

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";

const SUPPLIER_TYPES: { value: SupplierType; label: string }[] = [
  { value: "gold", label: "Gold Supplier" },
  { value: "diamond", label: "Diamond Supplier" },
  { value: "silver", label: "Silver Supplier" },
  { value: "stone", label: "Stone Supplier" },
  { value: "other", label: "Other" },
];

const PAYMENT_TERMS = [
  { value: "Immediate", label: "Immediate" },
  { value: "Net 15", label: "Net 15" },
  { value: "Net 30", label: "Net 30" },
  { value: "Net 45", label: "Net 45" },
  { value: "Net 60", label: "Net 60" },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
];

const METAL_TYPES = ["Gold", "Silver", "Diamond", "Platinum", "Stone", "Other"];
const ITEM_CATEGORIES = ["Ring", "Chain", "Necklace", "Bracelet", "Earring", "Pendant", "Bangle", "Other"];

const GST_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d][A-Z]\d{4}$/;

export interface AddSupplierFormValues {
  name: string;
  supplierType: SupplierType | "";
  businessRegistrationNumber: string;
  gstNumber: string;
  panNumber: string;
  status: "active" | "inactive" | "pending";
  contactPerson: string;
  phone: string;
  alternatePhone: string;
  email: string;
  website: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  paymentTerms: string;
  creditLimit: string;
  currency: string;
  metalTypes: string[];
  itemCategories: string[];
  onTimeRate: string;
  leadTimeDays: string;
  minimumOrderValue: string;
  notes: string;
}

const defaultValues: AddSupplierFormValues = {
  name: "",
  supplierType: "",
  businessRegistrationNumber: "",
  gstNumber: "",
  panNumber: "",
  status: "active",
  contactPerson: "",
  phone: "",
  alternatePhone: "",
  email: "",
  website: "",
  city: "",
  state: "",
  pincode: "",
  fullAddress: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  paymentTerms: "Net 30",
  creditLimit: "",
  currency: "INR",
  metalTypes: [],
  itemCategories: [],
  onTimeRate: "",
  leadTimeDays: "",
  minimumOrderValue: "",
  notes: "",
};

interface AddSupplierFormProps {
  onSubmit: (supplier: Supplier) => void;
  onCancel: () => void;
  disabled?: boolean;
  activeTab?: "supplier" | "contact" | "bank" | "performance";
}

export function AddSupplierForm({
  onSubmit,
  onCancel,
  disabled = false,
  activeTab = "supplier",
}: AddSupplierFormProps) {
  const [values, setValues] = useState<AddSupplierFormValues>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof AddSupplierFormValues, string>>>({});

  const set = useCallback((key: keyof AddSupplierFormValues, value: string | string[]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const e: Partial<Record<keyof AddSupplierFormValues, string>> = {};
    if (!values.name.trim()) e.name = "Supplier name is required.";
    if (!values.contactPerson.trim()) e.contactPerson = "Contact person is required.";
    if (!values.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^[\d\s+\-()]{10,15}$/.test(values.phone.replace(/\s/g, ""))) {
      e.phone = "Enter a valid phone number.";
    }
    if (!values.city.trim()) e.city = "City is required.";
    if (values.gstNumber.trim() && !GST_REGEX.test(values.gstNumber.replace(/\s/g, ""))) {
      e.gstNumber = "GST number must match standard Indian GST format.";
    }
    if (values.pincode.trim() && !/^\d{6}$/.test(values.pincode.trim())) {
      e.pincode = "Pincode must be exactly 6 digits.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [values]);

  const handleSubmit = useCallback(
    (asDraft: boolean) => (ev: React.FormEvent) => {
      ev.preventDefault();
      if (!validate()) return;
      const status = asDraft ? "pending" : "active";
      const supplierType = (values.supplierType || "other") as SupplierType;
      const supplier: Supplier = {
        id: `sup-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: values.name.trim(),
        contactPerson: values.contactPerson.trim(),
        email: values.email.trim() || "",
        phone: values.phone.trim(),
        city: values.city.trim(),
        status,
        supplierType,
        onTimeRate: values.onTimeRate.trim() ? Math.min(100, Math.max(0, Number(values.onTimeRate))) : 0,
        openOrders: 0,
        businessRegistrationNumber: values.businessRegistrationNumber.trim() || undefined,
        gstNumber: values.gstNumber.trim() || undefined,
        panNumber: values.panNumber.trim() || undefined,
        alternatePhone: values.alternatePhone.trim() || undefined,
        website: values.website.trim() || undefined,
        state: values.state.trim() || undefined,
        pincode: values.pincode.trim() || undefined,
        fullAddress: values.fullAddress.trim() || undefined,
        bankName: values.bankName.trim() || undefined,
        accountNumber: values.accountNumber.trim() || undefined,
        ifscCode: values.ifscCode.trim() || undefined,
        paymentTerms: values.paymentTerms.trim() || undefined,
        creditLimit: values.creditLimit.trim() ? Number(values.creditLimit) : undefined,
        currency: values.currency.trim() || undefined,
        metalTypes: values.metalTypes.length > 0 ? values.metalTypes : undefined,
        itemCategories: values.itemCategories.length > 0 ? values.itemCategories : undefined,
        leadTimeDays: values.leadTimeDays.trim() ? Number(values.leadTimeDays) : undefined,
        minimumOrderValue: values.minimumOrderValue.trim() ? Number(values.minimumOrderValue) : undefined,
        notes: values.notes.trim() || undefined,
      };
      onSubmit(supplier);
    },
    [values, validate, onSubmit]
  );

  const toggleMetal = (item: string) => {
    setValues((prev) => ({
      ...prev,
      metalTypes: prev.metalTypes.includes(item)
        ? prev.metalTypes.filter((x) => x !== item)
        : [...prev.metalTypes, item],
    }));
  };

  const toggleCategory = (item: string) => {
    setValues((prev) => ({
      ...prev,
      itemCategories: prev.itemCategories.includes(item)
        ? prev.itemCategories.filter((x) => x !== item)
        : [...prev.itemCategories, item],
    }));
  };

  return (
    <div className="min-w-0 space-y-6">
      <p className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="inline-block h-4 w-4 rounded-full bg-amber-100 text-center text-[10px] leading-4 text-amber-600" aria-hidden>i</span>
        <span>Fields marked in <span className="font-medium text-red-500">red</span> are required.</span>
      </p>

      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()} data-active-tab={activeTab}>
        {/* Render all supplier sections on a single page */}
        <Card className="min-w-0" padding="lg">
            <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-lg font-semibold text-zinc-900">Supplier Information</CardTitle>
                  <p className="text-sm text-zinc-500">Business identity and account status details</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                  SUPPLIER
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-4 pt-0">
              <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Supplier Name</label>
                  <input
                    className={inputClass}
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Supplier name"
                  />
                  {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Supplier Type</label>
                  <select
                    value={values.supplierType}
                    onChange={(e) => set("supplierType", e.target.value as SupplierType)}
                    className={inputClass}
                  >
                    <option value="">— Select type —</option>
                    {SUPPLIER_TYPES.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Business Reg. No</label>
                  <input
                    className={inputClass}
                    value={values.businessRegistrationNumber}
                    onChange={(e) => set("businessRegistrationNumber", e.target.value)}
                    placeholder="REG-XXXX"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">GST Number</label>
                  <input
                    className={inputClass}
                    value={values.gstNumber}
                    onChange={(e) => set("gstNumber", e.target.value)}
                    placeholder="GSTIN"
                  />
                  {errors.gstNumber ? <p className="mt-1 text-xs text-red-600">{errors.gstNumber}</p> : null}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">PAN Number</label>
                  <input
                    className={inputClass}
                    value={values.panNumber}
                    onChange={(e) => set("panNumber", e.target.value)}
                    placeholder="PAN"
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {(["active", "inactive", "pending"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set("status", s)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium capitalize ${
                          values.status === s
                            ? "bg-amber-500 text-white"
                            : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

        <Card className="min-w-0" padding="lg">
            <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-lg font-semibold text-zinc-900">Contact & Location</CardTitle>
                  <p className="text-sm text-zinc-500">Primary contact, address, and communication channels</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                  CONTACT
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-4 pt-0">
              <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Contact Person</label>
                  <input
                    className={inputClass}
                    value={values.contactPerson}
                    onChange={(e) => set("contactPerson", e.target.value)}
                    placeholder="Contact person"
                  />
                  {errors.contactPerson ? <p className="mt-1 text-xs text-red-600">{errors.contactPerson}</p> : null}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Phone</label>
                  <input
                    className={inputClass}
                    value={values.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 ..."
                  />
                  {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Alternate Phone</label>
                  <input
                    className={inputClass}
                    value={values.alternatePhone}
                    onChange={(e) => set("alternatePhone", e.target.value)}
                    placeholder="Alternate"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="email@domain.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Website</label>
                  <input
                    className={inputClass}
                    value={values.website}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="https://"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">City</label>
                  <input
                    className={inputClass}
                    value={values.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="City"
                  />
                  {errors.city ? <p className="mt-1 text-xs text-red-600">{errors.city}</p> : null}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">State</label>
                  <select
                    value={values.state}
                    onChange={(e) => set("state", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">— Select state —</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Pincode</label>
                  <input
                    className={inputClass}
                    value={values.pincode}
                    onChange={(e) => set("pincode", e.target.value)}
                    placeholder="6 digits"
                  />
                  {errors.pincode ? <p className="mt-1 text-xs text-red-600">{errors.pincode}</p> : null}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Full Address</label>
                <textarea
                  name="fullAddress"
                  rows={3}
                  value={values.fullAddress}
                  onChange={(e) => set("fullAddress", e.target.value)}
                  className={inputClass}
                />
              </div>
            </CardBody>
          </Card>

        <Card className="min-w-0" padding="lg">
            <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Landmark className="h-5 w-5" />
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-lg font-semibold text-zinc-900">Bank & Payment Details</CardTitle>
                  <p className="text-sm text-zinc-500">Bank accounts, payment terms, and credit preferences</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                  BANK
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-4 pt-0">
              <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Bank Name</label>
                  <input className={inputClass} value={values.bankName} onChange={(e) => set("bankName", e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Account Number</label>
                  <input className={inputClass} value={values.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">IFSC Code</label>
                  <input className={inputClass} value={values.ifscCode} onChange={(e) => set("ifscCode", e.target.value.toUpperCase())} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Payment Terms</label>
                  <select value={values.paymentTerms} onChange={(e) => set("paymentTerms", e.target.value)} className={inputClass}>
                    {PAYMENT_TERMS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Credit Limit (₹)</label>
                  <input className={inputClass} value={values.creditLimit} onChange={(e) => set("creditLimit", e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Currency</label>
                  <select value={values.currency} onChange={(e) => set("currency", e.target.value)} className={inputClass}>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
            </CardBody>
          </Card>

        <Card className="min-w-0" padding="lg">
            <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-lg font-semibold text-zinc-900">Performance & Catalog</CardTitle>
                  <p className="text-sm text-zinc-500">Fulfilment KPIs and catalog coverage</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                  KPI
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-4 pt-0">
              <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Metal Types Supplied</label>
                <div className="flex flex-wrap gap-2">
                  {METAL_TYPES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMetal(m)}
                      className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
                        values.metalTypes.includes(m)
                          ? "bg-amber-500 text-white"
                          : "border border-zinc-200 bg-white text-zinc-600 hover:bg-amber-50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Item Categories</label>
                <div className="flex flex-wrap gap-2">
                  {ITEM_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCategory(c)}
                      className={`rounded-xl px-3 py-1.5 text-sm font-medium ${
                        values.itemCategories.includes(c)
                          ? "bg-amber-500 text-white"
                          : "border border-zinc-200 bg-white text-zinc-600 hover:bg-amber-50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">On-time Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={inputClass}
                  value={values.onTimeRate}
                  onChange={(e) => set("onTimeRate", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Lead Time (days)</label>
                <input className={inputClass} value={values.leadTimeDays} onChange={(e) => set("leadTimeDays", e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Minimum Order Value (₹)</label>
                <input className={inputClass} value={values.minimumOrderValue} onChange={(e) => set("minimumOrderValue", e.target.value)} />
              </div>
              <div className="lg:col-span-4">
                <label className="mb-1 block text-xs font-medium text-zinc-900">Notes / Comments</label>
                <textarea
                  name="notes"
                  rows={3}
                  value={values.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  className={inputClass}
                />
              </div>
              </div>
            </CardBody>
          </Card>

        {/* Sticky footer */}
        <div className="sticky bottom-0 left-0 right-0 flex flex-col gap-3 border-t border-zinc-200 bg-white px-0 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="order-2 sm:order-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <div className="flex flex-wrap gap-3 order-1 sm:order-2">
            <Button
              type="button"
              variant="outline"
              className="border-amber-400 text-amber-700 hover:bg-amber-50"
              disabled={disabled}
              onClick={handleSubmit(true)}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              className="bg-amber-500 text-white hover:bg-amber-600"
              disabled={disabled}
              onClick={handleSubmit(false)}
            >
              Add Supplier
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
