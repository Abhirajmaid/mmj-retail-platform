"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@jewellery-retail/ui";
import { useFirmStore } from "@/src/store/firm-store";
import { FirmForm } from "@/src/components/firm/FirmForm";
import type { Firm } from "@/src/types/firm";

export default function AddFirmPage() {
  const router = useRouter();
  const addFirm = useFirmStore((s) => s.addFirm);

  const handleSubmit = (data: Partial<Firm>) => {
    const firm = addFirm({
      ...data,
      firmId: data.firmId ?? "",
      registrationNo: data.registrationNo ?? "",
      shopName: data.shopName ?? "",
      firmType: data.firmType ?? "SELF",
      status: data.status ?? "active",
    } as Omit<Firm, "id" | "createdAt" | "updatedAt">);
    if (firm) router.push("/firm");
    else router.push("/firm/review");
  };

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Firm / Company Panel"
        description="Add a new firm or branch. Fields marked in red are required."
      />

      <div className="min-w-0 rounded-xl border border-zinc-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06),0_24px_60px_-28px_rgba(15,23,42,0.14)] sm:p-6">
        <FirmForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/firm")}
          submitLabel="Save / Add Firm"
        />
      </div>
    </div>
  );
}
