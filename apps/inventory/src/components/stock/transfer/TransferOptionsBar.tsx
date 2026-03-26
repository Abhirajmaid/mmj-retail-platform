"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@jewellery-retail/ui";

const COUNTER_OPTIONS = ["Counter A", "Counter B", "Counter C"];
const STAFF_OPTIONS = ["Staff 1", "Staff 2", "Staff 3"];
const UNSELECT_LABEL = "Unselect";

/** Options for firm dropdown: id = firm.id, label = display name (e.g. shopName) */
export type FirmOption = { id: string; label: string };

/** SELECT COUNTER | SELECT STAFF | FIRM dropdowns + VOUCHER NUMBER row */
export interface TransferOptionsBarProps {
  counter: string | null;
  staff: string | null;
  firm: string | null;
  /** Firms from Firm page (created firms). firm prop is firm.id when selected. */
  firmOptions: FirmOption[];
  voucherPrefix: string;
  voucherNumber: number;
  onCounterSelect: (value: string | null) => void;
  onStaffSelect: (value: string | null) => void;
  onFirmChange: (firmId: string | null) => void;
}

function useDropdownClose(ref: React.RefObject<HTMLDivElement | null>, open: boolean, setOpen: (v: boolean) => void) {
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, ref]);
}

export function TransferOptionsBar({
  counter,
  staff,
  firm,
  firmOptions,
  voucherPrefix,
  voucherNumber,
  onCounterSelect,
  onStaffSelect,
  onFirmChange,
}: TransferOptionsBarProps) {
  const firmLabel = firm ? firmOptions.find((o) => o.id === firm)?.label ?? "SELECT FIRM" : "SELECT FIRM";
  const [counterOpen, setCounterOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [firmOpen, setFirmOpen] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  const staffRef = useRef<HTMLDivElement>(null);
  const firmRef = useRef<HTMLDivElement>(null);

  useDropdownClose(counterRef, counterOpen, setCounterOpen);
  useDropdownClose(staffRef, staffOpen, setStaffOpen);
  useDropdownClose(firmRef, firmOpen, setFirmOpen);

  const voucherDisplay = `${voucherPrefix}-${voucherNumber}`;

  return (
    <PageHeader
      title="Select Transfer Options"
      className="rounded-2xl border-0 bg-white shadow-[0_16px_36px_-24px_rgba(15,23,42,0.45),0_8px_18px_-12px_rgba(15,23,42,0.28)]"
      actions={
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. Counter dropdown */}
          <div className="relative" ref={counterRef}>
            <button
              type="button"
              onClick={() => {
                setCounterOpen((o) => !o);
                setStaffOpen(false);
                setFirmOpen(false);
              }}
              className="flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-zinc-900 transition-colors hover:bg-slate-50"
            >
              {counter ?? "SELECT COUNTER"}
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${counterOpen ? "rotate-180" : ""}`} />
            </button>
            {counterOpen && (
              <div className="absolute left-0 top-full z-20 mt-1 min-w-[180px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onCounterSelect(null);
                    setCounterOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm font-bold ${counter === null ? "bg-[#1E3A8A]/10 text-[#1E3A8A]" : "text-zinc-900 hover:bg-slate-50"}`}
                >
                  {UNSELECT_LABEL}
                </button>
                {COUNTER_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      onCounterSelect(c);
                      setCounterOpen(false);
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm font-bold ${counter === c ? "bg-[#1E3A8A]/10 text-[#1E3A8A]" : "text-zinc-900 hover:bg-slate-50"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Staff dropdown — includes Unselect */}
          <div className="relative" ref={staffRef}>
            <button
              type="button"
              onClick={() => {
                setStaffOpen((o) => !o);
                setCounterOpen(false);
                setFirmOpen(false);
              }}
              className="flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-zinc-900 transition-colors hover:bg-slate-50"
            >
              {staff ?? "SELECT STAFF"}
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${staffOpen ? "rotate-180" : ""}`} />
            </button>
            {staffOpen && (
              <div className="absolute left-0 top-full z-20 mt-1 min-w-[180px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onStaffSelect(null);
                    setStaffOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm font-bold ${staff === null ? "bg-[#1E3A8A]/10 text-[#1E3A8A]" : "text-zinc-900 hover:bg-slate-50"}`}
                >
                  {UNSELECT_LABEL}
                </button>
                {STAFF_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onStaffSelect(s);
                      setStaffOpen(false);
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm font-bold ${staff === s ? "bg-[#1E3A8A]/10 text-[#1E3A8A]" : "text-zinc-900 hover:bg-slate-50"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Firm dropdown */}
          <div className="relative" ref={firmRef}>
            <button
              type="button"
              onClick={() => {
                setFirmOpen((o) => !o);
                setCounterOpen(false);
                setStaffOpen(false);
              }}
              className="flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-zinc-900 transition-colors hover:bg-slate-50"
            >
              {firmLabel}
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${firmOpen ? "rotate-180" : ""}`} />
            </button>
            {firmOpen && (
              <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] max-h-[280px] overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onFirmChange(null);
                    setFirmOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm font-bold ${firm === null ? "bg-[#1E3A8A]/10 text-[#1E3A8A]" : "text-zinc-900 hover:bg-slate-50"}`}
                >
                  {UNSELECT_LABEL}
                </button>
                {firmOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onFirmChange(opt.id);
                      setFirmOpen(false);
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm font-bold ${firm === opt.id ? "bg-[#1E3A8A]/10 text-[#1E3A8A]" : "text-zinc-900 hover:bg-slate-50"}`}
                  >
                    {opt.label}
                  </button>
                ))}
                {firmOptions.length === 0 && (
                  <p className="px-4 py-2 text-xs text-zinc-500">No firms. Create one on the Firm page.</p>
                )}
              </div>
            )}
          </div>

          {/* Voucher number on the right of the bar */}
          <div className="ml-4 flex items-center gap-2 border-l border-slate-200 pl-4">
            <span className="text-sm font-semibold text-zinc-600">VOUCHER NUMBER</span>
            <span className="min-w-[4rem] rounded border border-slate-200 bg-slate-50 px-2 py-1.5 font-mono text-sm font-medium text-zinc-900">
              {voucherDisplay}
            </span>
          </div>
        </div>
      }
    />
  );
}
