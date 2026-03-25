"use client";

import { ChevronDown } from "lucide-react";
import type { SupplierType } from "@jewellery-retail/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from "@jewellery-retail/ui";

import {
  SUPPLIER_OTHER_SUBTYPE_OPTIONS,
  SUPPLIER_PRIMARY_TAB_OPTIONS,
} from "./SuppliersFilterBar";

const OTHER_VALUES = new Set<SupplierType>(["diamond", "stone", "other"]);

export interface SupplierTypeTabsRowProps {
  typeFilter: "all" | SupplierType;
  onTypeChange: (next: "all" | SupplierType) => void;
  countFor: (key: "all" | SupplierType) => number;
}

export function SupplierTypeTabsRow({ typeFilter, onTypeChange, countFor }: SupplierTypeTabsRowProps) {
  const dropdownActive = OTHER_VALUES.has(typeFilter as SupplierType);
  const otherGroupTotal = SUPPLIER_OTHER_SUBTYPE_OPTIONS.reduce((sum, o) => sum + countFor(o.value), 0);
  const selectedOtherLabel = SUPPLIER_OTHER_SUBTYPE_OPTIONS.find((o) => o.value === typeFilter)?.label;

  const triggerCount = dropdownActive ? countFor(typeFilter) : otherGroupTotal;
  const triggerText = dropdownActive && selectedOtherLabel ? selectedOtherLabel : "Other types";

  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Supplier type">
      {SUPPLIER_PRIMARY_TAB_OPTIONS.map(({ value, label }) => {
        const isActive = typeFilter === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTypeChange(value)}
            className={cn(
              "flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300",
              isActive
                ? "bg-amber-500 text-white shadow-lg ring-1 ring-amber-600/30"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
            )}
          >
            {label}
            <span className="ml-1.5">{countFor(value)}</span>
          </button>
        );
      })}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            role="tab"
            aria-expanded={undefined}
            aria-haspopup="menu"
            aria-selected={dropdownActive}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300",
              dropdownActive
                ? "bg-amber-500 text-white shadow-lg ring-1 ring-amber-600/30"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
            )}
          >
            {triggerText}
            <span className="ml-0.5">{triggerCount}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-[14rem] rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg"
        >
          {SUPPLIER_OTHER_SUBTYPE_OPTIONS.map(({ value, label }) => {
            const n = countFor(value);
            const isSel = typeFilter === value;
            return (
              <DropdownMenuItem
                key={value}
                onSelect={() => onTypeChange(value)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm focus:bg-zinc-100",
                  isSel && "bg-amber-50 text-amber-900"
                )}
              >
                <span>{label}</span>
                <span className="tabular-nums text-zinc-500">{n}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
