"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { StockFilterModal, type StockFilters } from "@/src/components/stock/StockFilterModal";
import { StockTabs, type MovementFilter } from "@/src/components/stock/StockTabs";
import { dateFormat } from "@jewellery-retail/utils";
import type { StockMovementView } from "@/src/types/stock";

const ITEMS_PER_PAGE = 15;

interface StockTableProps {
  movements: StockMovementView[];
  /** Product key to highlight a specific row (optional) */
  highlightedProductKey?: string | null;
  /** Read-only (e.g. Reports tab) */
  readOnly?: boolean;
}

function getProductKey(m: StockMovementView): string {
  return `${m.productId}|${m.productName}|${m.sku}`;
}

function getStatusBadgeVariant(
  status: string
): "default" | "success" | "warning" | "danger" | "info" {
  if (status === "completed") return "success";
  if (status === "pending") return "warning";
  if (status === "cancelled") return "danger";
  return "default";
}

export function StockTable({
  movements,
  highlightedProductKey,
  readOnly = false,
}: StockTableProps) {
  const router = useRouter();
  const [movementFilter, setMovementFilter] = useState<MovementFilter>("All");
  const [productNameSearch, setProductNameSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<StockFilters>({
    dateFrom: "",
    dateTo: "",
  });

  const filtered = useMemo(() => {
    return movements.filter((m) => {
      if (movementFilter !== "All") {
        const want = movementFilter.toLowerCase();
        if (m.type !== want) return false;
      }
      if (productNameSearch.trim()) {
        const q = productNameSearch.toLowerCase();
        if (!m.productName.toLowerCase().includes(q) && !m.sku.toLowerCase().includes(q))
          return false;
      }
      if (appliedFilters.dateFrom && m.updatedAt < appliedFilters.dateFrom)
        return false;
      if (appliedFilters.dateTo && m.updatedAt > appliedFilters.dateTo)
        return false;
      return true;
    });
  }, [movements, movementFilter, productNameSearch, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = useMemo(
    () => filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filtered, startIndex]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [movementFilter, productNameSearch, appliedFilters]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(totalPages, page)));
    },
    [totalPages]
  );

  const tabItems = useMemo(
    () => [
      { key: "All" as const, label: "All", count: movements.length },
      {
        key: "Inbound" as const,
        label: "Inbound",
        count: movements.filter((m) => m.type === "inbound").length,
      },
      {
        key: "Outbound" as const,
        label: "Outbound",
        count: movements.filter((m) => m.type === "outbound").length,
      },
      {
        key: "Transfer" as const,
        label: "Transfer",
        count: movements.filter((m) => m.type === "transfer").length,
      },
    ],
    [movements]
  );

  const hasActiveFilters =
    Boolean(appliedFilters.dateFrom) || Boolean(appliedFilters.dateTo);
  const hasPagination = totalPages > 1;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filtered.length);

  return (
    <div className="min-w-0 space-y-4">
      <StockTabs
        tabItems={tabItems}
        activeTab={movementFilter}
        onTabChange={setMovementFilter}
        searchQuery={productNameSearch}
        onSearchChange={setProductNameSearch}
        onFilterClick={() => setIsFilterModalOpen(true)}
        onColumnVisibilityClick={readOnly ? undefined : () => {}}
        onAddClick={readOnly ? undefined : () => {}}
        onExportClick={() => {}}
        hasActiveFilters={hasActiveFilters}
      />

      <StockFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={setAppliedFilters}
        appliedFilters={appliedFilters}
      />

      <p className="text-sm text-zinc-500">
        Showing{" "}
        {hasPagination ? (
          <>
            <strong>{startIndex + 1}</strong>–<strong>{endIndex}</strong> of{" "}
            <strong>{filtered.length}</strong>
          </>
        ) : (
          <strong>{filtered.length}</strong>
        )}{" "}
        result{filtered.length !== 1 ? "s" : ""}
      </p>

      <div className="min-w-0 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <Table className="min-w-[1000px] table-fixed">
          <TableHead>
            <TableRow>
              <TableHeader className="w-[28%] min-w-0">PRODUCT</TableHeader>
              <TableHeader className="w-[14%] min-w-0">MOVEMENT</TableHeader>
              <TableHeader className="w-[20%] min-w-0">LOCATION</TableHeader>
              <TableHeader className="w-[14%] min-w-0">STATUS</TableHeader>
              <TableHeader className="w-[14%] min-w-0">DATE</TableHeader>
              <TableHeader className="w-[10%] min-w-0 text-right">QUANTITY</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-zinc-500">
                  No stock movements match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((m) => {
                const isHighlighted = highlightedProductKey === getProductKey(m);
                const isTransfer = m.type === "transfer";
                return (
                  <TableRow
                    key={m.id}
                    className={
                      isHighlighted
                        ? "border-b border-zinc-100 bg-amber-50"
                        : "border-b border-zinc-100 bg-white"
                    }
                    onClick={isTransfer ? () => router.push("/stock/transfer/list") : undefined}
                    role={isTransfer ? "button" : undefined}
                    style={isTransfer ? { cursor: "pointer" } : undefined}
                  >
                    <TableCell className="py-2 pl-4 min-w-0">
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-900 truncate" title={m.productName}>
                          {m.productName}
                        </p>
                        <p className="text-xs text-zinc-500 truncate" title={m.sku}>
                          {m.sku}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">
                      {isTransfer ? (
                        <Badge variant="info">Transfer</Badge>
                      ) : (
                        <span className="capitalize">{m.type}</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700 truncate" title={m.location}>
                      {m.location}
                    </TableCell>
                    <TableCell className="py-2 text-left">
                      <Badge variant={getStatusBadgeVariant(m.status)}>
                        {m.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">
                      {dateFormat(m.updatedAt)}
                    </TableCell>
                    <TableCell className="py-2 text-right text-sm font-medium text-zinc-900">
                      {m.quantity}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {hasPagination && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-4">
          <p className="text-sm text-zinc-500">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
