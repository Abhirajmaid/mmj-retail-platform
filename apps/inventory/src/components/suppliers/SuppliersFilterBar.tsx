"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import type { SupplierType } from "@jewellery-retail/types";

export type SupplierStatusTab = "all" | "active" | "pending" | "inactive";

/** Shown as main tabs (stock bar style). */
export const SUPPLIER_PRIMARY_TYPE_TABS: { value: SupplierType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "gold", label: "Gold Supplier" },
  { value: "silver", label: "Silver Supplier" },
];

/** Diamond, stone, and other — opened from “More types” dropdown. */
export const SUPPLIER_MORE_TYPE_OPTIONS: { value: SupplierType; label: string }[] = [
  { value: "diamond", label: "Diamond Supplier" },
  { value: "stone", label: "Stone Supplier" },
  { value: "other", label: "Other" },
];

/** Full list for lookups (labels, etc.). */
export const SUPPLIER_TYPE_OPTIONS: { value: SupplierType | "all"; label: string }[] = [
  ...SUPPLIER_PRIMARY_TYPE_TABS,
  ...SUPPLIER_MORE_TYPE_OPTIONS,
];

export type SupplierSortOption = "name" | "city" | "onTimeRate" | "openOrders";

export const SORT_OPTIONS: { value: SupplierSortOption; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "city", label: "City" },
  { value: "onTimeRate", label: "On-time Rate" },
  { value: "openOrders", label: "Open Orders" },
];

interface SuppliersFilterBarProps {
  statusTab: SupplierStatusTab;
  onStatusTabChange: (tab: SupplierStatusTab) => void;
  statusCounts: { all: number; active: number; pending: number; inactive: number };
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SuppliersFilterBar({
  statusTab,
  onStatusTabChange,
  statusCounts,
  searchQuery,
  onSearchChange,
}: SuppliersFilterBarProps) {
  const tabs = [
    { key: "all" as const, label: "All Firms", count: statusCounts.all },
    { key: "active" as const, label: "Active", count: statusCounts.active },
    { key: "pending" as const, label: "Pending", count: statusCounts.pending },
    { key: "inactive" as const, label: "Inactive", count: statusCounts.inactive },
  ];

  return (
    <div className="rounded-xl border-b border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              onClick={() => onStatusTabChange(key)}
              className={`flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                statusTab === key
                  ? "bg-amber-500 text-white shadow-lg"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
              }`}
            >
              {label}
              <span className="ml-1.5">{count}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>
          <Link
            href="/suppliers/add"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-amber-500 shadow-md transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            title="Add supplier"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
