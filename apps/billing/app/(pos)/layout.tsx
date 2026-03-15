"use client";

import type { ReactNode } from "react";

import { DashboardLayout } from "@jewellery-retail/ui";

import { billingNavigation } from "@/src/config/navigation";

export default function BillingLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      brand={{
        title: "Billing Cloud",
        subtitle: "Revenue and customer ops",
      }}
      navigation={billingNavigation}
      title="Billing Workspace"
      subtitle="Invoices, subscriptions, payments, and reporting"
    >
      {children}
    </DashboardLayout>
  );
}
