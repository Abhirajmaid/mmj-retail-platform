"use client";

import type { ReactNode } from "react";

import { Bell, Menu, Search } from "lucide-react";

import { cn } from "../lib/utils";
import { BrandLogo } from "./brand-logo";
import { Button } from "./button";

interface NavbarProps {
  brand?: {
    title: string;
    subtitle: string;
  };
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  searchPlaceholder?: string;
  onMenuClick?: () => void;
}

export function Navbar({
  brand,
  title,
  subtitle,
  actions,
  searchPlaceholder = "Search",
  onMenuClick,
}: NavbarProps) {
  const brandMeta = brand ?? { title: "MMJ Workspace", subtitle: "Workspace overview" };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white shadow-[0_24px_44px_-22px_rgba(15,23,42,0.24)]">
      <div className="flex min-h-[76px] flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <BrandLogo className="hidden h-11 w-11 rounded-[15px] shadow-none lg:flex" />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--app-accent,#f97316)]">
              Dashboard
            </p>
            <p className="text-[30px] font-semibold leading-none text-zinc-950">{title}</p>
            {subtitle ? <p className="text-[15px] leading-[1.25] text-zinc-500">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:w-[520px] xl:flex-row xl:items-center xl:justify-end">
          <div className="relative xl:flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              className="h-12 w-full rounded-2xl border border-zinc-100 bg-white pl-11 pr-4 text-sm text-zinc-950 outline-none transition focus:border-orange-200"
              placeholder={searchPlaceholder}
            />
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <button
              type="button"
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-100 bg-white text-zinc-500 transition hover:text-zinc-900"
              )}
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div className="hidden min-w-[220px] items-center gap-3 rounded-2xl border border-zinc-100 bg-white px-3 py-2 shadow-[0_18px_36px_-26px_rgba(15,23,42,0.2)] sm:flex">
              <BrandLogo className="h-10 w-10 rounded-[14px] shadow-none" />
              <div className="min-w-0 space-y-0.5">
                <p className="truncate text-[14px] font-semibold leading-[1.15] text-zinc-900">{brandMeta.title}</p>
                <p className="truncate text-[12px] leading-[1.2] text-zinc-500">{brandMeta.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
