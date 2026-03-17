"use client";

import {
  SUPPLIER_TYPE_OPTIONS,
  SORT_OPTIONS,
  type SupplierSortOption,
  type SupplierType,
} from "./SuppliersFilterBar";

interface SuppliersSecondaryBarProps {
  typeFilter: SupplierType | "all";
  onTypeFilterChange: (value: SupplierType | "all") => void;
  sortBy: SupplierSortOption;
  onSortByChange: (value: SupplierSortOption) => void;
}

export function SuppliersSecondaryBar({
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortByChange,
}: SuppliersSecondaryBarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex overflow-x-auto pb-1 sm:overflow-visible sm:pb-0">
        <div className="flex min-w-0 gap-2 sm:flex-wrap">
          {SUPPLIER_TYPE_OPTIONS.map(({ value, label }) => {
            const isActive = typeFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onTypeFilterChange(value)}
                className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-amber-500 text-white"
                    : "text-zinc-600 hover:text-amber-600"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <label htmlFor="suppliers-sort" className="text-sm font-medium text-zinc-600">
          Sort By
        </label>
        <select
          id="suppliers-sort"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SupplierSortOption)}
          className="h-9 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
