"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  ClipboardList,
  Wrench,
  PiggyBank,
  BarChart3,
  LogOut,
  Gem,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/billing", label: "New Sale", icon: ShoppingCart },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/repairs", label: "Repairs", icon: Wrench },
  { href: "/schemes", label: "Schemes", icon: PiggyBank },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[hsl(223,84%,25%)] text-white flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <Gem size={22} className="text-[#E9B120]" />
        <div>
          <p className="font-bold text-sm leading-tight">MMJ Billing</p>
          <p className="text-xs text-white/60">POS & CRM</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white w-full transition-colors">
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
