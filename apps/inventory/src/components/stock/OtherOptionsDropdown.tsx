"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const OPTIONS: { value: string; label: string; href?: string }[] = [
  { value: "STOCK SETTING", label: "Stock setting" },
  { value: "STOCK MASTER", label: "Stock master" },
  { value: "STOCK TRANSFER", label: "Stock transfer", href: "/stock/transfer" },
  { value: "DISCOUNT OPTION", label: "Discount option" },
  { value: "SETUP OPTION", label: "Setup option" },
  { value: "MULTIPLE STOCK DELETE", label: "Multiple stock delete" },
];

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
        className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
          open
            ? "bg-amber-500 text-white shadow-md"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
        }`}
      >
        Other options
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel — matches app cards: rounded-xl, border-zinc-100, shadow */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[100] mt-1 min-w-[200px] overflow-hidden rounded-xl border border-zinc-100 bg-white py-1 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
            style={{ top: position.top, left: position.left }}
          >
            {OPTIONS.map(({ value, label, href }) =>
              href ? (
                <Link
                  key={value}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block w-full px-4 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-amber-50 hover:text-amber-800"
                >
                  {label}
                </Link>
              ) : (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    onSelect?.(value);
                    setOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-amber-50 hover:text-amber-800"
                >
                  {label}
                </button>
              )
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
