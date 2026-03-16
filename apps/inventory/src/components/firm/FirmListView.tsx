"use client";

import { Building2, Plus } from "lucide-react";
import {
  Button,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import type { Firm } from "@/src/types/firm";
import type { FirmColumnConfig } from "./firmTableColumns";

/**
 * List view for firms table with glassmorphism table and empty state.
 * Matches LeadsListView structure from xtrawrkx.
 * @see https://github.com/Abhirajmaid/xtrawrkx_suits/blob/master/xtrawrkx-crm-portal/src/app/sales/lead-companies/components/LeadsListView.jsx
 */
interface FirmListViewProps {
  firms: Firm[];
  columns: FirmColumnConfig[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onRowClick?: (firm: Firm) => void;
  emptyMessage?: string;
  searchQuery?: string;
  onClearSearch?: () => void;
  onAddClick?: () => void;
}

export function FirmListView({
  firms,
  columns,
  totalCount,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onRowClick,
  emptyMessage = "No firms match the current filters.",
  searchQuery,
  onClearSearch,
  onAddClick,
}: FirmListViewProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const hasPagination = totalPages > 1;

  if (firms.length > 0) {
    return (
      <div className="min-w-0 space-y-4 overflow-hidden rounded-lg">
        <Table className="min-w-[1000px]">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableHeader
                  key={col.key}
                  className={col.key === "actions" ? "text-right" : ""}
                  style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                >
                  {col.label}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {firms.map((firm) => (
              <TableRow
                key={firm.id}
                className={onRowClick ? "cursor-pointer" : ""}
                onClick={() => onRowClick?.(firm)}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={col.key === "actions" ? "text-right" : ""}
                    style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                  >
                    {col.render(firm) as any}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {hasPagination && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/20 pt-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}–{Math.min(endIndex, totalCount)} of{" "}
              <strong>{totalCount}</strong> result{totalCount !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="rounded-lg border border-white/40 bg-white/70 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/90 disabled:pointer-events-none disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded-lg border border-white/40 bg-white/70 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/90 disabled:pointer-events-none disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/30 bg-gradient-to-br from-white/70 to-white/40 p-12 shadow-xl backdrop-blur-xl">
      <EmptyState
        icon={Building2}
        title="No firms found"
        description={
          searchQuery?.trim()
            ? `No firms match your search "${searchQuery}"`
            : emptyMessage
        }
        action={
          searchQuery?.trim() && onClearSearch ? (
            <Button variant="outline" onClick={onClearSearch} className="rounded-lg">
              Clear Search
            </Button>
          ) : onAddClick ? (
            <Button
              onClick={onAddClick}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:from-amber-600 hover:to-orange-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Firm
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
