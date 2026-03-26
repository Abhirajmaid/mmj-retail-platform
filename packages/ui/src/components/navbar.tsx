"use client";

import type { ReactNode } from "react";

import { Bell, Menu, Search } from "lucide-react";

import { BrandLogo } from "./brand-logo";
import { Button } from "./button";
import { Input } from "./input";

interface NavbarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  searchPlaceholder?: string;
  onMenuClick?: () => void;
}

export function Navbar({
  title,
  subtitle,
  actions,
  searchPlaceholder = "Search",
  onMenuClick,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white shadow-[0_24px_44px_-22px_rgba(15,23,42,0.24)]">
      <div className="flex min-h-[72px] flex-col gap-3 px-4 py-3 sm:min-h-[76px] sm:gap-4 sm:px-6 sm:py-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-2xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <BrandLogo className="hidden h-11 w-11 rounded-[15px] shadow-none lg:flex" />
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--app-accent,#f97316)] sm:text-xs sm:tracking-[0.28em]">
              Dashboard
            </p>
            <p className="truncate text-xl font-semibold leading-tight text-zinc-950 sm:text-2xl xl:text-[30px] xl:leading-none">{title}</p>
            {subtitle ? <p className="line-clamp-2 text-sm leading-snug text-zinc-500 sm:text-[15px] sm:leading-[1.25]">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:w-[520px] xl:flex-row xl:items-center xl:justify-end">
          <div className="relative w-full min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              className="h-10 rounded-xl border border-zinc-200 bg-white py-0 pl-10 pr-4 text-zinc-900 shadow-md placeholder:text-zinc-400 transition focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
              placeholder={searchPlaceholder}
            />
          </div>
          <div className="flex min-h-[44px] items-center gap-2 sm:gap-3">
            {actions}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 min-h-[40px] min-w-[40px] shrink-0 rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-md transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-700"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
