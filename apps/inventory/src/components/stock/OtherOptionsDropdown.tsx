"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

const OPTIONS = [
  "STOCK SETTING",
  "STOCK MASTER",
  "STOCK TRANSFER",
  "DISCOUNT OPTION",
  "SETUP OPTION",
  "MULTIPLE STOCK DELETE",
] as const;

export function OtherOptionsDropdown({
  onSelect,
}: {
  onSelect?: (option: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideTrigger = containerRef.current?.contains(target);
      const insideDropdown = dropdownRef.current?.contains(target);
      if (!insideTrigger && !insideDropdown) setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({ top: rect.bottom, left: rect.left });
          }
          setOpen((p) => !p);
        }}
        className={`flex min-h-10 items-center gap-1.5 px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-all duration-150 md:px-6 ${
          open ? "bg-white text-black" : "text-black hover:bg-[#FEF3C7]"
        }`}
      >
        OTHER OPTIONS
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Render dropdown in portal so it's not clipped by tab bar overflow-x-auto */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[100] mt-0 min-w-0 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            <div className="border-l-4 border-amber-400 p-2">
              <div className="flex flex-col gap-1.5">
                {OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onSelect?.(opt);
                      setOpen(false);
                    }}
                    className="rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-gray-900 shadow-sm transition-colors duration-150 hover:border-amber-300 hover:bg-[#FEF3C7] hover:text-amber-700 sm:text-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
