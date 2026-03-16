"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  const fetchFirmById = useFirmStore((s) => s.fetchFirmById);
  const error = useFirmStore((s) => s.error);
  const clearError = useFirmStore((s) => s.clearError);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    if (firm) {
      setLoading(false);
      return;
    }
    fetchFirmById(id).then((f) => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id, firm, fetchFirmById]);

  const handleSubmit = async (data: Partial<Firm>) => {
    if (!id) return;
    clearError();
    setSubmitting(true);
    try {
      await updateFirm(id, data);
      router.push("/firm");
    } finally {
      setSubmitting(false);
    }
  };

  if (!id) {
    return (
      <div className="space-y-6">
        <PageHeader title="Invalid firm" description="Missing firm id." />
        <Link href="/firm" className="text-amber-600 underline">Back to Firm list</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Firm" description="Loading…" />
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="space-y-6">
        <PageHeader title="Firm not found" description="The requested firm may have been deleted." />
        <p className="text-zinc-500">Go back to <Link href="/firm" className="text-amber-600 underline">Firm list</Link>.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Edit Firm"
        description="Edit firm or branch details. Fields marked in red are required."
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="min-w-0 rounded-xl border border-zinc-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06),0_24px_60px_-28px_rgba(15,23,42,0.14)] sm:p-6">
        <FirmForm
          initial={firm}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/firm")}
          submitLabel="Save / Update Firm"
          disabled={submitting}
        />
      </div>
    </div>
  );
}
