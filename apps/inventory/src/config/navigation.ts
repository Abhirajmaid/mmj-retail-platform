import {
  BarChart3,
  Boxes,
  Building2,
  LayoutDashboard,
  LayoutGrid,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";

import type { SidebarItem } from "@jewellery-retail/ui";

export const inventoryNavigation: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Stock", href: "/stock", icon: Boxes },
  { label: "Stock Tally", href: "/stock-tally", icon: LayoutGrid },
  { label: "Firm", href: "/firm", icon: Building2 },
  { label: "Suppliers", href: "/suppliers", icon: Truck },
  { label: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];
