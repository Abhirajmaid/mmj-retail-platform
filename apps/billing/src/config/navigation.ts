import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  Receipt,
  Users,
} from "lucide-react";

import type { SidebarItem } from "@jewellery-retail/ui";

export const billingNavigation: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Payments", href: "/payments", icon: Receipt },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];
