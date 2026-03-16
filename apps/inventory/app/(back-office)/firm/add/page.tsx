"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, HelpCircle } from "lucide-react";
import { Button, PageHeader } from "@jewellery-retail/ui";
import { useFirmStore } from "@/src/store/firm-store";
import { FirmForm } from "@/src/components/firm/FirmForm";
import type { Firm } from "@/src/types/firm";

const ADD_FIRM_BREADCRUMBS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Firm", href: "/firm" },
  { label: "Add New" },
];

export default function AddFirmPage() {
  const router = useRouter();
  const addFirm = useFirmStore((s) => s.addFirm);
  const error = useFirmStore((s) => s.error);
  const clearError = useFirmStore((s) => s.clearError);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (data: Partial<Firm>) => {
    clearError();
    setSubmitting(true);
    try {
      const firm = await addFirm({
        ...data,
        firmId: data.firmId ?? "",
        registrationNo: data.registrationNo ?? "",
        shopName: data.shopName ?? "",
        firmType: data.firmType ?? "SELF",
        status: data.status ?? "active",
      } as Omit<Firm, "id" | "createdAt" | "updatedAt">);

      if (firm) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/firm");
        }, 2000);
      } else if (!useFirmStore.getState().error) {
        router.push("/firm/review");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
          <h2 className="mb-2 text-2xl font-bold text-zinc-950">Success!</h2>
          <p className="mb-4 text-zinc-600">Firm added successfully</p>
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-amber-500" />
          <p className="mt-2 text-sm text-zinc-500">
            Redirecting to firm list...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        breadcrumbs={ADD_FIRM_BREADCRUMBS}
        title="Add New Firm"
        description="Create a new firm or branch with company information and form details."
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

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <FirmForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/firm")}
        submitLabel="Create Firm"
        disabled={submitting}
      />
    </div>
  );
}
