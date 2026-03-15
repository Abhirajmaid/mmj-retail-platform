"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { Button, Input } from "@jewellery-retail/ui";
import type { Firm } from "@/src/types/firm";
import { FIRM_TYPE_OPTIONS, MONTHS } from "@/src/types/firm";
import { ImageUpload } from "./ImageUpload";

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";

interface FirmFormProps {
  initial?: Firm | null;
  onSubmit: (data: Partial<Firm>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);
const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

export function FirmForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save / Add Firm",
}: FirmFormProps) {
  const [images, setImages] = useState<Partial<Pick<Firm, "formLeftImage" | "formRightLogo" | "formRightImage" | "ownerSignature" | "qrCodeImage">>>({
    formLeftImage: initial?.formLeftImage,
    formRightLogo: initial?.formRightLogo,
    formRightImage: initial?.formRightImage,
    ownerSignature: initial?.ownerSignature,
    qrCodeImage: initial?.qrCodeImage,
  });

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
      geoLat: get("geoLat") || undefined,
      geoLng: get("geoLng") || undefined,
      whatsappLink: get("whatsappLink") || undefined,
      facebookLink: get("facebookLink") || undefined,
      instagramLink: get("instagramLink") || undefined,
      smtpServer: get("smtpServer") || undefined,
      smtpPort: get("smtpPort") || undefined,
      smtpEmailId: get("smtpEmailId") || undefined,
      smtpEmailPassword: get("smtpEmailPassword") || undefined,
      smtpCcEmailId: get("smtpCcEmailId") || undefined,
      eInvoiceApiId: get("eInvoiceApiId") || undefined,
      eInvoiceApiKey: get("eInvoiceApiKey") || undefined,
      eInvoiceUsername: get("eInvoiceUsername") || undefined,
      eInvoicePassword: get("eInvoicePassword") || undefined,
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
        {/* Hint: Required fields + HELP */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="inline-block h-4 w-4 rounded-full bg-amber-100 text-center text-[10px] leading-4 text-amber-600" aria-hidden>i</span>
            <span>Fields marked in <span className="font-medium text-red-500">red</span> are required.</span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-[44px] shrink-0 border-amber-200 bg-amber-50/50 text-amber-800 hover:bg-amber-100 sm:min-h-9"
          >
            <HelpCircle className="mr-1 h-4 w-4" />
            HELP
          </Button>
        </div>

        <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[2fr_1.75fr_1.2fr]">
          {/* COLUMN 1 — FIRM / COMPANY DETAILS */}
          <div className="min-w-0 space-y-4">
            <h2 className="border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              FIRM / COMPANY DETAILS
            </h2>

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
            <div className="grid grid-cols-2 gap-2">
              <Input label="Geo Location Latitude" name="geoLat" defaultValue={initial?.geoLat} className={inputClass} />
              <Input label="Geo Location Longitude" name="geoLng" defaultValue={initial?.geoLng} className={inputClass} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input label="WhatsApp Link" name="whatsappLink" defaultValue={initial?.whatsappLink} className={inputClass} />
              <Input label="Facebook Link" name="facebookLink" defaultValue={initial?.facebookLink} className={inputClass} />
              <Input label="Instagram Link" name="instagramLink" defaultValue={initial?.instagramLink} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="SMTP Server" name="smtpServer" defaultValue={initial?.smtpServer} className={inputClass} />
              <Input label="SMTP Port" name="smtpPort" defaultValue={initial?.smtpPort} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="SMTP Email ID" name="smtpEmailId" defaultValue={initial?.smtpEmailId} className={inputClass} />
              <Input label="SMTP Email Password" name="smtpEmailPassword" type="password" defaultValue={initial?.smtpEmailPassword} className={inputClass} />
            </div>
            <Input label="SMTP CC Email ID" name="smtpCcEmailId" defaultValue={initial?.smtpCcEmailId} className={inputClass} />
            <div className="grid grid-cols-3 gap-2">
              <Input label="WhatsApp Link" name="whatsappLink2" defaultValue={initial?.whatsappLink} className={inputClass} />
              <Input label="Facebook Link" name="facebookLink2" defaultValue={initial?.facebookLink} className={inputClass} />
              <Input label="Instagram Link" name="instagramLink2" defaultValue={initial?.instagramLink} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="E-Invoice API ID" name="eInvoiceApiId" defaultValue={initial?.eInvoiceApiId} className={inputClass} />
              <Input label="E-Invoice API Key" name="eInvoiceApiKey" defaultValue={initial?.eInvoiceApiKey} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="E-Invoice Username" name="eInvoiceUsername" defaultValue={initial?.eInvoiceUsername} className={inputClass} />
              <Input label="E-Invoice Password" name="eInvoicePassword" type="password" defaultValue={initial?.eInvoicePassword} className={inputClass} />
            </div>
          </div>

          {/* COLUMN 2 — FORMS DETAILS */}
          <div className="min-w-0 space-y-4">
            <h2 className="border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              FORMS DETAILS
            </h2>

            <Input label="Payment Bank Details" name="paymentBankDetails" defaultValue={initial?.paymentBankDetails} className={inputClass} />
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
          </div>

          {/* COLUMN 3 — COMPANY LOGO & UPLOADS */}
          <div className="min-w-0 space-y-6">
            <h2 className="border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              COMPANY LOGO
            </h2>

            <FirmFormImageUploads
              initial={initial}
              images={images}
              onImageChange={setImage}
            />
          </div>
        </div>

        {/* Sticky footer buttons — stack on mobile, row on larger */}
        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-gray-200 bg-white py-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Button type="button" variant="ghost" onClick={onCancel} className="min-h-[44px] order-3 sm:order-1 sm:min-h-9">
            Cancel
          </Button>
          <Link href="/firm/review" className="order-2 w-full sm:order-2 sm:w-auto">
            <Button type="button" variant="outline" className="w-full min-h-[44px] border-amber-400 text-amber-700 hover:bg-amber-50 sm:min-h-9 sm:w-auto">
              Submit for Review
            </Button>
          </Link>
          <Button
            type="submit"
            className="order-1 w-full min-h-[44px] bg-amber-500 text-white hover:bg-amber-600 sm:order-3 sm:w-auto sm:min-h-9"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
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
    <>
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
      <ImageUpload
        label="Upload Owner Signature"
        value={v("ownerSignature")}
        onChange={(val) => onImageChange("ownerSignature", val)}
      />
      <p className="text-xs text-zinc-500">Owner Signature Im.</p>
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-600">QR Code</h3>
        <ImageUpload
          label=""
          value={v("qrCodeImage")}
          onChange={(val) => onImageChange("qrCodeImage", val)}
        />
        <p className="text-xs text-zinc-500">QR Code Image</p>
      </div>
    </>
  );
}
