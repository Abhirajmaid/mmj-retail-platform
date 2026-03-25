"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useStockTransferStore } from "@/src/store/stockTransferStore";

const COUNTER_OPTIONS = ["Counter A", "Counter B", "Counter C"];
const UNSELECT_LABEL = "Unselect";

export function CounterSelectorBar() {
  const activeCounter = useStockTransferStore((s) => s.activeCounter);
  const setActiveCounter = useStockTransferStore((s) => s.setActiveCounter);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const display = activeCounter ?? "SELECT COUNTER";

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-200 bg-[#1E3A8A] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm hover:bg-[#1E3A8A]/90"
      >
        {display}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[200px] max-h-[280px] overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setActiveCounter(null);
              setOpen(false);
            }}
            className={`w-full px-4 py-2.5 text-left text-sm font-semibold ${
              activeCounter === null ? "bg-amber-100 text-amber-800" : "text-zinc-800 hover:bg-amber-50"
            }`}
          >
            {UNSELECT_LABEL}
          </button>

          {COUNTER_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setActiveCounter(c);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm font-semibold ${
                activeCounter === c ? "bg-amber-100 text-amber-800" : "text-zinc-800 hover:bg-amber-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

