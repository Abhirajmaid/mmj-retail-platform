"use client";

import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@jewellery-retail/ui";
import { useFirmStore } from "@/src/store/firm-store";
import { FirmForm } from "@/src/components/firm/FirmForm";
import type { Firm } from "@/src/types/firm";

export default function EditFirmPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const firm = useFirmStore((s) => s.getFirmById(id));
  const updateFirm = useFirmStore((s) => s.updateFirm);

  const handleSubmit = (data: Partial<Firm>) => {
    if (!id) return;
    updateFirm(id, data);
    router.push("/firm");
  };

  if (id && !firm) {
    return (
      <div className="space-y-6">
        <PageHeader title="Firm not found" description="The requested firm may have been deleted." />
        <p className="text-zinc-500">Go back to <a href="/firm" className="text-amber-600 underline">Firm list</a>.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Firm / Company Panel"
        description="Edit firm or branch details. Fields marked in red are required."
      />

      <div className="min-w-0 rounded-xl border border-zinc-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06),0_24px_60px_-28px_rgba(15,23,42,0.14)] sm:p-6">
        <FirmForm
          initial={firm ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/firm")}
          submitLabel="Save / Update Firm"
        />
      </div>
    </div>
  );
}
