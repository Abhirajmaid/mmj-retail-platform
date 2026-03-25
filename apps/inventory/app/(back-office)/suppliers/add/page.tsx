"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { Button, PageHeader, useToast } from "@jewellery-retail/ui";
import type { Supplier } from "@jewellery-retail/types";
import { AddSupplierForm } from "@/src/components/suppliers/AddSupplierForm";
import { SUPPLIER_JUST_ADDED_KEY } from "@/src/components/suppliers/supplier-shared";

const ADD_SUPPLIER_BREADCRUMBS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Suppliers", href: "/suppliers" },
  { label: "Add Supplier" },
];

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
      <PageHeader
        breadcrumbs={ADD_SUPPLIER_BREADCRUMBS}
        title="Add Supplier"
        description="Fill in supplier details and submit."
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

      <AddSupplierForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/suppliers")}
        disabled={submitting}
      />
    </div>
  );
}
