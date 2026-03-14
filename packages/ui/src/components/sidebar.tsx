"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, LogOut, X } from "lucide-react";

import { BrandLogo } from "./brand-logo";
import { cn } from "../lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface SidebarProps {
  brand: {
    title: string;
    subtitle: string;
  };
  items: SidebarItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ brand, items, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-zinc-950/40 transition lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden border-r border-zinc-100 bg-white shadow-[24px_0_52px_-28px_rgba(15,23,42,0.28)]">
          <div className="flex items-start justify-between px-4 pb-4 pt-6">
            <div className="flex min-w-0 items-start gap-3">
              <BrandLogo className="h-11 w-11 rounded-[15px]" />
              <div className="min-w-0 space-y-1">
                <h2 className="text-[16px] font-semibold leading-[1.1] text-zinc-950">{brand.title}</h2>
                <p className="whitespace-normal text-[14px] leading-[1.2] text-zinc-500">{brand.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-400 hover:bg-white hover:text-zinc-950 lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-[36px] items-center justify-between rounded-xl px-2.5 py-2 text-[13px] font-medium transition",
                  isActive
                    ? "border border-orange-100 bg-orange-50 text-[var(--app-accent,#f97316)]"
                    : "text-zinc-600 hover:bg-zinc-50/70 hover:text-zinc-950"
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      isActive ? "bg-white text-[var(--app-accent,#f97316)]" : "text-zinc-400"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      isActive ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
                    )}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={cn("h-3.5 w-3.5", isActive ? "text-orange-300" : "text-zinc-300")} />
                )}
              </Link>
            );
          })}
          </nav>

          <div className="px-3 pb-3 pt-1">
            <button
              type="button"
              className="flex min-h-[36px] w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] font-medium text-zinc-500 transition hover:bg-zinc-50/70 hover:text-zinc-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400">
                <LogOut className="h-3.5 w-3.5" />
              </span>
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
