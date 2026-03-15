"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Package,
  QrCode,
  Factory,
  Users,
  ShoppingCart,
  Flame,
  BarChart3,
  LogOut,
  Gem,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/catalog", label: "Product Catalog", icon: BookOpen },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/barcode", label: "Barcode & Tags", icon: QrCode },
  { href: "/manufacturing", label: "Manufacturing", icon: Factory },
  { href: "/karigar", label: "Karigars", icon: Users },
  { href: "/purchase", label: "Purchase", icon: ShoppingCart },
  { href: "/melting", label: "Melting", icon: Flame },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[hsl(223,84%,20%)] text-white flex flex-col z-30">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <Gem size={22} className="text-[#E9B120]" />
        <div>
          <p className="font-bold text-sm leading-tight">MMJ Inventory</p>
          <p className="text-xs text-white/60">Back Office</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white w-full">
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
