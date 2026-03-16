"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ClipboardList,
  FileText,
  ImageIcon,
  Receipt,
} from "lucide-react";
import { Button, Card, CardBody, CardHeader, CardTitle, Input, Modal } from "@jewellery-retail/ui";
import type { Firm } from "@/src/types/firm";
import { FIRM_TYPE_OPTIONS, MONTHS } from "@/src/types/firm";
import { ImageUpload } from "./ImageUpload";
import { InvoicePreview } from "./InvoicePreview";

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";

interface FirmFormProps {
  initial?: Firm | null;
  onSubmit: (data: Partial<Firm>) => void | Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  disabled?: boolean;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);
const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

export function FirmForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save / Add Firm",
  disabled = false,
}: FirmFormProps) {
  const [images, setImages] = useState<Partial<Pick<Firm, "formLeftImage" | "formRightLogo" | "formRightImage" | "ownerSignature" | "qrCodeImage">>>({
    formLeftImage: initial?.formLeftImage,
    formRightLogo: initial?.formRightLogo,
    formRightImage: initial?.formRightImage,
    ownerSignature: initial?.ownerSignature,
    qrCodeImage: initial?.qrCodeImage,
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  const setImage = useCallback((key: keyof typeof images, value: string) => {
    setImages((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const get = (k: string) => (fd.get(k) as string) ?? "";
    const getNum = (k: string) => {
      const v = fd.get(k);
      return v === "" || v === null ? undefined : Number(v);
    };

    onSubmit({
      firmId: get("firmId"),
      registrationNo: get("registrationNo"),
      shopName: get("shopName"),
      firmDescription: get("firmDescription") || undefined,
      address: get("address") || undefined,
      city: get("city") || undefined,
      pincode: get("pincode") || undefined,
      phone: get("phone") || undefined,
      email: get("email") || undefined,
      website: get("website") || undefined,
      myFirms: get("myFirms") || undefined,
      firmType: (get("firmType") as Firm["firmType"]) || "SELF",
      commentsOtherInfo: get("commentsOtherInfo") || undefined,
      paymentBankDetails: get("paymentBankDetails") || undefined,
      paymentBankAcNo: get("paymentBankAcNo") || undefined,
      paymentBankIfsc: get("paymentBankIfsc") || undefined,
      paymentDeclaration: get("paymentDeclaration") || undefined,
      financialYearStart: [get("fyDay"), get("fyMonth"), get("fyYear")]
        .filter(Boolean)
        .join(" ") || undefined,
      cashBalance: getNum("cashBalance"),
      cashBalanceCr: fd.get("cashBalanceCr") === "on",
      gstinNo: get("gstinNo") || undefined,
      panNumber: get("panNumber") || undefined,
      principalAmtFrom: getNum("principalAmtFrom"),
      principalAmtTo: getNum("principalAmtTo"),
      formHeader: get("formHeader") || undefined,
      formFooter: get("formFooter") || undefined,
      principalStartAmount: getNum("principalStartAmount"),
      principalEndAmount: getNum("principalEndAmount"),
      status: (get("status") as Firm["status"]) || "active",
      formLeftImage: images.formLeftImage,
      formRightLogo: images.formRightLogo,
      formRightImage: images.formRightImage,
      ownerSignature: images.ownerSignature,
      qrCodeImage: images.qrCodeImage,
    });
  };

  return (
    <div className="relative flex min-w-0">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-6"
      >
        <p className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="inline-block h-4 w-4 rounded-full bg-amber-100 text-center text-[10px] leading-4 text-amber-600" aria-hidden>i</span>
          <span>Fields marked in <span className="font-medium text-red-500">red</span> are required.</span>
        </p>

        {/* Card 1: Company Information */}
        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg font-semibold text-zinc-900">Company Information</CardTitle>
              <p className="text-sm text-zinc-500">Basic information about the firm</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4 pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Firm ID (PP, RP, SR)"
              name="firmId"
              defaultValue={initial?.firmId}
              className={inputClass}
              hint="Firm Id should be unique"
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-red-500">Registration No</label>
              <input
                name="registrationNo"
                defaultValue={initial?.registrationNo}
                className={`${inputClass} ${!initial?.registrationNo ? "ring-1 ring-amber-300" : ""}`}
              />
            </div>
            <Input
              label="Shop Name"
              name="shopName"
              defaultValue={initial?.shopName}
              className={inputClass}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Firm Description</label>
              <input name="firmDescription" defaultValue={initial?.firmDescription} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Address</label>
              <textarea
                name="address"
                rows={2}
                defaultValue={initial?.address}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input label="City" name="city" defaultValue={initial?.city} className={inputClass} />
              <Input label="Pincode" name="pincode" defaultValue={initial?.pincode} className={inputClass} />
              <Input label="Phone Number" name="phone" defaultValue={initial?.phone} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Email ID" name="email" type="email" defaultValue={initial?.email} className={inputClass} />
              <Input label="Website Name" name="website" defaultValue={initial?.website} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">My Firms</label>
              <select
                name="myFirms"
                defaultValue={initial?.myFirms ?? "Self"}
                className={inputClass}
              >
                <option value="Self">Self</option>
                {FIRM_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Comments / Other Info</label>
              <textarea
                name="commentsOtherInfo"
                rows={2}
                defaultValue={initial?.commentsOtherInfo}
                className={inputClass}
              />
            </div>
            </div>
          </CardBody>
        </Card>

        {/* Card 2: Forms & Banking */}
        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg font-semibold text-zinc-900">Forms & Banking</CardTitle>
              <p className="text-sm text-zinc-500">Payment, tax and form settings</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4 pt-0">
            <Input label="Bank Name" name="paymentBankDetails" defaultValue={initial?.paymentBankDetails} className={inputClass} />
            <Input label="Payment Bank A/C No" name="paymentBankAcNo" defaultValue={initial?.paymentBankAcNo} className={inputClass} />
            <Input label="Payment Bank IFSC Code" name="paymentBankIfsc" defaultValue={initial?.paymentBankIfsc} className={inputClass} />
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Payment Declaration</label>
              <textarea name="paymentDeclaration" rows={2} defaultValue={initial?.paymentDeclaration} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Financial Year Start Date</label>
              <div className="flex gap-2">
                <select name="fyDay" defaultValue={initial?.financialYearStart?.split(" ")[0] ?? "01"} className={inputClass}>
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select name="fyMonth" defaultValue={initial?.financialYearStart?.split(" ")[1] ?? "APR"} className={inputClass}>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select name="fyYear" defaultValue={initial?.financialYearStart?.split(" ")[2] ?? "2024"} className={inputClass}>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Input label="Cash Balance" name="cashBalance" type="number" defaultValue={initial?.cashBalance} className={inputClass} />
              <div className="flex flex-col justify-end pb-2">
                <label className="flex h-10 min-w-[44px] cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium hover:bg-gray-50">
                  <input type="checkbox" name="cashBalanceCr" defaultChecked={initial?.cashBalanceCr} value="on" className="sr-only" />
                  <span className="pointer-events-none">CR</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">GSTIN No</label>
                <input name="gstinNo" defaultValue={initial?.gstinNo} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">PAN Number</label>
                <input name="panNumber" defaultValue={initial?.panNumber} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Principal Amt Limit From" name="principalAmtFrom" type="number" defaultValue={initial?.principalAmtFrom} className={inputClass} />
              <Input label="Principal Amt Limit To" name="principalAmtTo" type="number" defaultValue={initial?.principalAmtTo} className={inputClass} />
            </div>
            <Input label="Form Header Information" name="formHeader" defaultValue={initial?.formHeader ?? "SHUBH LABH"} className={inputClass} />
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Form Footer Information</label>
              <textarea
                name="formFooter"
                rows={3}
                defaultValue={initial?.formFooter ?? "NOTE: INTEREST SHOULD BE PAID AFTER 11 MONTHS WITHOUT FAIL"}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Principal Start Amount" name="principalStartAmount" type="number" defaultValue={initial?.principalStartAmount} className={inputClass} />
              <Input label="Principal End Amount" name="principalEndAmount" type="number" defaultValue={initial?.principalEndAmount} className={inputClass} />
            </div>
          </CardBody>
        </Card>

        {/* Card 3: Documents & Media */}
        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-4">
            <div className="flex flex-row items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-zinc-900">Documents & Media</CardTitle>
                <p className="text-sm text-zinc-500">Logos, signatures and QR code images</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 border-amber-200 text-amber-700 hover:bg-amber-50"
              onClick={() => setPreviewOpen(true)}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Preview Bill
            </Button>
          </CardHeader>
          <CardBody className="pt-0">
            <FirmFormImageUploads
              initial={initial}
              images={images}
              onImageChange={setImage}
            />
          </CardBody>
        </Card>

        {/* Card 4: Firm Status */}
        <Card className="min-w-0" padding="lg">
          <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg font-semibold text-zinc-900">Firm Status</CardTitle>
              <p className="text-sm text-zinc-500">Set the type and status for this firm</p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Firm Type</label>
                <select
                  name="firmType"
                  defaultValue={initial?.firmType ?? "SELF"}
                  className={inputClass}
                >
                  {FIRM_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">Status</label>
                <select
                  name="status"
                  defaultValue={initial?.status ?? "active"}
                  className={inputClass}
                >
                  <option value="active">Active</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Footer actions — Cancel (left), Submit for Review, Create (right, primary) */}
        <div className="flex flex-col gap-3 border-t border-zinc-100 bg-white pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="min-h-[44px] order-2 sm:order-1 sm:min-h-9"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <div className="flex flex-wrap items-center gap-3 order-1 sm:order-2">
            <Link href="/firm/review" className="w-full sm:w-auto">
              <Button type="button" variant="outline" className="w-full min-h-[44px] border-amber-400 text-amber-700 hover:bg-amber-50 sm:min-h-9 sm:w-auto">
                Submit for Review
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={disabled}
              className="w-full min-h-[44px] bg-amber-500 text-white hover:bg-amber-600 sm:min-h-9 sm:w-auto"
            >
              {submitLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Invoice preview"
        size="2xl"
      >
        <p className="mb-4 text-sm text-zinc-500">
          How your logos and images will appear on the bill or invoice.
        </p>
        <InvoicePreview images={images} />
      </Modal>
    </div>
  );
}

function FirmFormImageUploads({
  initial,
  images,
  onImageChange,
}: {
  initial?: Firm | null;
  images: Partial<Pick<Firm, "formLeftImage" | "formRightLogo" | "formRightImage" | "ownerSignature" | "qrCodeImage">>;
  onImageChange: (key: "formLeftImage" | "formRightLogo" | "formRightImage" | "ownerSignature" | "qrCodeImage", value: string) => void;
}) {
  const v = (k: keyof typeof images) => images[k] ?? initial?.[k];

  return (
    <div className="space-y-6">
      {/* Form images — 3-column grid */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Form images
        </h3>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ImageUpload
            label="Form Left Image"
            value={v("formLeftImage")}
            onChange={(val) => onImageChange("formLeftImage", val)}
          />
          <ImageUpload
            label="Form Right Logo"
            labelBold
            value={v("formRightLogo")}
            onChange={(val) => onImageChange("formRightLogo", val)}
          />
          <ImageUpload
            label="Form Right Image"
            value={v("formRightImage")}
            onChange={(val) => onImageChange("formRightImage", val)}
          />
        </div>
      </div>

      {/* Signature — single row */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Signature
        </h3>
        <ImageUpload
          label="Owner Signature"
          value={v("ownerSignature")}
          onChange={(val) => onImageChange("ownerSignature", val)}
        />
      </div>

      {/* QR Code — single row */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          QR Code
        </h3>
        <ImageUpload
          label="QR Code Image"
          value={v("qrCodeImage")}
          onChange={(val) => onImageChange("qrCodeImage", val)}
        />
      </div>
    </div>
  );
}
