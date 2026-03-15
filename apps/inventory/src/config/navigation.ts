import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";

import type { SidebarItem } from "@jewellery-retail/ui";

export const inventoryNavigation: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Stock", href: "/stock", icon: Boxes },
  { label: "Suppliers", href: "/suppliers", icon: Truck },
  { label: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];
