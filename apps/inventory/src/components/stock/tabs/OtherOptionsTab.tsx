"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { OTHER_OPTIONS_ITEMS } from "@/src/types/stock";

export function OtherOptionsTab() {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4" ref={ref}>
      {/* OTHER OPTIONS bar — click opens dropdown below, no new page */}
      <div className="relative inline-block min-w-[200px]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-2 rounded border border-amber-200 bg-amber-400/90 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-navy-800 shadow-sm hover:bg-amber-300/90"
        >
          <span>Other Options</span>
          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {/* Dropdown opens in place below the bar — not a new page */}
        {open && (
          <div className="absolute left-0 top-full z-20 mt-1 min-w-[220px] rounded-md border border-gray-200 bg-white py-1 shadow-lg">
            {OTHER_OPTIONS_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedLabel(item.label);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-navy-800 hover:bg-amber-50"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {selectedLabel && (
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-navy-800">{selectedLabel}</span>
          {" — Coming Soon"}
        </p>
      )}
    </div>
  );
}
