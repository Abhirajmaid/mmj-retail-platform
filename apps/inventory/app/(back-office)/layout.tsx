"use client";

import type { ReactNode } from "react";

import { DashboardLayout } from "@jewellery-retail/ui";

import { inventoryNavigation } from "@/src/config/navigation";

export default function InventoryLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout
      brand={{
        title: "Inventory Core",
        subtitle: "Stock and supplier operations",
      }}
      navigation={inventoryNavigation}
      title="Inventory Workspace"
      subtitle="Products, stock control, suppliers, and analytics"
    >
      {children}
    </DashboardLayout>
  );
}
