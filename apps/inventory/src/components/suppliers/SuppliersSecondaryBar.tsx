"use client";

import { ChevronDown, Download, Eye, Filter, Plus, Search } from "lucide-react";

import type { SupplierType } from "@jewellery-retail/types";
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
} from "@jewellery-retail/ui";

import {
  SORT_OPTIONS,
  SUPPLIER_MORE_TYPE_OPTIONS,
  SUPPLIER_PRIMARY_TYPE_TABS,
  type SupplierSortOption,
} from "./SuppliersFilterBar";

function isMoreTypeFilter(value: SupplierType | "all"): value is SupplierType {
  return value === "diamond" || value === "stone" || value === "other";
}

const tabButtonClass = (active: boolean) =>
  cn(
    "flex shrink-0 items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap",
    active
      ? "bg-amber-500 text-white shadow-lg"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
  );

const dropdownPanelClass =
  "min-w-[220px] overflow-hidden rounded-xl border border-zinc-100 bg-white p-0 py-1 shadow-[0_10px_24px_rgba(15,23,42,0.06)]";

const dropdownItemClass =
  "cursor-pointer rounded-none px-4 py-2.5 text-sm font-medium text-zinc-700 focus:bg-amber-50 focus:text-amber-800";

interface SuppliersSecondaryBarProps {
  typeFilter: SupplierType | "all";
  onTypeFilterChange: (value: SupplierType | "all") => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters?: boolean;
  onAddClick?: () => void;
  onFilterClick?: () => void;
  onColumnVisibilityClick?: () => void;
  onExportClick?: () => void;
  sortBy: SupplierSortOption;
  onSortByChange: (value: SupplierSortOption) => void;
}

export function SuppliersSecondaryBar({
  typeFilter,
  onTypeFilterChange,
  searchQuery,
  onSearchChange,
  hasActiveFilters = false,
  onAddClick,
  onFilterClick,
  onColumnVisibilityClick,
  onExportClick,
  sortBy,
  onSortByChange,
}: SuppliersSecondaryBarProps) {
  const isMoreGroupActive = isMoreTypeFilter(typeFilter);
  const moreTriggerLabel = isMoreGroupActive
    ? SUPPLIER_MORE_TYPE_OPTIONS.find((o) => o.value === typeFilter)?.label ?? "More types"
    : "More types";

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Name";

  return (
    <div className="rounded-xl bg-white px-4 py-3 shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {SUPPLIER_PRIMARY_TYPE_TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onTypeFilterChange(value)}
              className={tabButtonClass(typeFilter === value)}
            >
              {label}
            </button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                  "[&[data-state=open]>svg:last-child]:rotate-180",
                  isMoreGroupActive
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 data-[state=open]:bg-amber-500 data-[state=open]:text-white data-[state=open]:shadow-md"
                )}
              >
                {moreTriggerLabel}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={4} className={dropdownPanelClass}>
              {SUPPLIER_MORE_TYPE_OPTIONS.map(({ value, label }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => onTypeFilterChange(value)}
                  className={dropdownItemClass}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              placeholder="Search supplier..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 rounded-xl border border-zinc-200 bg-white py-0 pl-10 pr-4 text-zinc-900 shadow-md placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
            />
          </div>
          {onAddClick ? (
            <button
              type="button"
              onClick={onAddClick}
              title="Add supplier"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-amber-500 shadow-md transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Plus className="h-5 w-5" />
            </button>
          ) : null}
          {onFilterClick ? (
            <button
              type="button"
              onClick={onFilterClick}
              title="Filter"
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white shadow-md transition-colors",
                hasActiveFilters
                  ? "border-amber-400 text-amber-600"
                  : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              )}
            >
              <Filter className="h-4 w-4" />
            </button>
          ) : null}
          {onColumnVisibilityClick ? (
            <button
              type="button"
              onClick={onColumnVisibilityClick}
              title="Column visibility"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-md transition-colors hover:bg-zinc-50"
            >
              <Eye className="h-4 w-4" />
            </button>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm",
                  "[&[data-state=open]>svg:last-child]:rotate-180",
                  "hover:bg-zinc-50 data-[state=open]:border-amber-500/50 data-[state=open]:ring-2 data-[state=open]:ring-amber-500/30"
                )}
              >
                {sortLabel}
                <ChevronDown className="h-4 w-4 shrink-0 opacity-60 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4} className={dropdownPanelClass}>
              {SORT_OPTIONS.map(({ value, label }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => onSortByChange(value)}
                  className={dropdownItemClass}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            onClick={onExportClick ?? undefined}
            disabled={!onExportClick}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
