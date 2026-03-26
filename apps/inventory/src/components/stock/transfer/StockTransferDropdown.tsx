"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { STOCK_TRANSFER_MENU_ITEMS } from "@/src/types/stockTransfer";

export function StockTransferDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-200 bg-[#1E3A8A] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm hover:bg-[#1E3A8A]/90"
      >
        STOCK TRANSFER
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[320px] max-h-none overflow-visible rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {STOCK_TRANSFER_MENU_ITEMS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block border-l-4 py-2.5 px-4 text-sm font-bold uppercase tracking-wide ${
                  active
                    ? "border-l-amber-500 bg-amber-50 text-amber-900"
                    : "border-l-transparent text-zinc-900 hover:bg-amber-50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
