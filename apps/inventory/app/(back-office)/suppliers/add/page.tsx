"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@jewellery-retail/ui";
import type { Supplier } from "@jewellery-retail/types";
import { AddSupplierForm } from "@/src/components/suppliers/AddSupplierForm";

const SUPPLIER_JUST_ADDED_KEY = "supplierJustAdded";

export default function AddSupplierPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (supplier: Supplier) => {
    setSubmitting(true);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(SUPPLIER_JUST_ADDED_KEY, JSON.stringify(supplier));
      }
      router.push("/suppliers");
      toast.toast("Supplier added successfully.", "success");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <Link
        href="/suppliers"
        className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Suppliers
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">Add New Supplier</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fill in the supplier details to add them to your network.
        </p>
      </div>

      <AddSupplierForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/suppliers")}
        disabled={submitting}
      />
    </div>
  );
}
