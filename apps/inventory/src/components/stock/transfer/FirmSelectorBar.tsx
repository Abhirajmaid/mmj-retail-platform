"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useStockTransferStore } from "@/src/store/stockTransferStore";
import { useFirmStore } from "@/src/store/firm-store";

/**
 * Top-right firm context switcher. Selecting a firm updates the page content to that firm
 * (e.g. Firm1’s stock/transfers) without leaving the page. "ALL FIRMS" = no filter.
 */
export function FirmSelectorBar() {
  const viewingFirmId = useStockTransferStore((s) => s.viewingFirmId);
  const setViewingFirmId = useStockTransferStore((s) => s.setViewingFirmId);
  const { firms, fetchFirms } = useFirmStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const viewingFirm = viewingFirmId ? firms.find((f) => f.id === viewingFirmId) : null;
  const displayFirm = viewingFirm ? viewingFirm.shopName : "ALL FIRMS";

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-200 bg-[#1E3A8A] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm hover:bg-[#1E3A8A]/90"
      >
        {displayFirm}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[180px] max-h-[280px] overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setViewingFirmId(null);
              setOpen(false);
            }}
            className={`w-full px-4 py-2.5 text-left text-sm font-semibold ${
              !viewingFirmId ? "bg-amber-100 text-amber-800" : "text-zinc-800 hover:bg-amber-50"
            }`}
          >
            ALL FIRMS
          </button>
          {firms.map((firm) => {
            const isSelected = viewingFirmId === firm.id;
            return (
              <button
                key={firm.id}
                type="button"
                onClick={() => {
                  setViewingFirmId(firm.id);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm font-semibold ${
                  isSelected ? "bg-amber-100 text-amber-800" : "text-zinc-800 hover:bg-amber-50"
                }`}
              >
                {firm.shopName}
              </button>
            );
          })}
          {firms.length === 0 && (
            <p className="px-4 py-2 text-xs text-zinc-500">No firms. Create one on the Firm page.</p>
          )}
        </div>
      )}
    </div>
  );
}
