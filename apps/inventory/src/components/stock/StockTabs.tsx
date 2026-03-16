"use client";

import { Download, Eye, Filter, Plus, Search } from "lucide-react";
import { Input } from "@jewellery-retail/ui";

export type MovementFilter = "All" | "Inbound" | "Outbound" | "Transfer";

export interface StockTabItem {
  key: MovementFilter;
  label: string;
  count?: number;
}

interface StockTabsProps {
  tabItems: StockTabItem[];
  activeTab: MovementFilter;
  onTabChange: (tab: MovementFilter) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExportClick?: () => void;
  onFilterClick?: () => void;
  onColumnVisibilityClick?: () => void;
  onAddClick?: () => void;
  hasActiveFilters?: boolean;
}

export function StockTabs({
  tabItems,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onExportClick,
  onFilterClick,
  onColumnVisibilityClick,
  onAddClick,
  hasActiveFilters = false,
}: StockTabsProps) {
  return (
    <div className="rounded-xl bg-white shadow-md px-4 py-3 sm:px-4 sm:py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        {/* Left: Movement type tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {tabItems.map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              onClick={() => onTabChange(key)}
              className={`flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === key
                  ? "bg-amber-500 text-white shadow-lg"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
              }`}
            >
              {label}
              {count !== undefined && <span className="ml-1.5">{count}</span>}
            </button>
          ))}
        </div>

        {/* Right: Search + circular actions + Export */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 pl-10 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 shadow-md"
            />
          </div>

          {onAddClick && (
            <button
              type="button"
              onClick={onAddClick}
              title="Add"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-amber-500 shadow-md hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}

          {onFilterClick && (
            <button
              type="button"
              onClick={onFilterClick}
              title="Filter"
              className={`flex h-10 w-10 shrink-0 items-center shadow-md justify-center rounded-full border bg-white transition-colors ${
                hasActiveFilters
                  ? "border-amber-400 text-amber-600"
                  : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <Filter className="h-4 w-4" />
            </button>
          )}

          {onColumnVisibilityClick && (
            <button
              type="button"
              onClick={onColumnVisibilityClick}
              title="Column visibility"
              className="flex h-10 w-10 shrink-0 items-center shadow-md justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onExportClick ?? undefined}
            disabled={!onExportClick}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
