"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { Button, PageHeader, useToast } from "@jewellery-retail/ui";
import type { PurchaseOrder } from "@jewellery-retail/types";

import { AddPurchaseOrderForm } from "@/src/components/purchase-orders/AddPurchaseOrderForm";

const ADD_PURCHASE_ORDERS_BREADCRUMBS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Purchase orders", href: "/purchase-orders" },
  { label: "Create PO" },
];

export default function AddPurchaseOrderPage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (po: PurchaseOrder) => {
    setSubmitting(true);
    try {
      // Currently PO submission is UI-only (no dedicated API endpoint in this project).
      // After creation we navigate back to the list.
      router.push("/purchase-orders");
      toast.toast("Purchase order created successfully.", "success");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        breadcrumbs={ADD_PURCHASE_ORDERS_BREADCRUMBS}
        title="Create PO"
        description="Fill in purchase order details and submit."
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

      <AddPurchaseOrderForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/purchase-orders")}
        disabled={submitting}
      />
    </div>
  );
}

