"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Firm } from "@/src/types/firm";
import {
  type FilterTab,
  getFirmTableColumns,
} from "@/src/components/firm/firmTableColumns";
import { FirmTabs, type ViewMode } from "@/src/components/firm/FirmTabs";
import { FirmListView } from "@/src/components/firm/FirmListView";
import { ColumnVisibilityModal } from "@/src/components/firm/ColumnVisibilityModal";
import { FirmFilterModal, type FirmFilters } from "@/src/components/firm/FirmFilterModal";

const ITEMS_PER_PAGE = 15;
const STORAGE_KEY = "firmTableColumnVisibility";

interface FirmTableProps {
  firms: Firm[];
  onDelete: (id: string) => void;
  onExport?: (filtered: Firm[]) => void;
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onAddClick?: () => void;
}

function loadVisibleColumns(allKeys: string[]): string[] {
  if (typeof window === "undefined") return allKeys;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      const valid = parsed.filter((k) => allKeys.includes(k));
      if (valid.length > 0) return valid;
    }
  } catch {
    // ignore
  }
  return allKeys;
}

function saveVisibleColumns(keys: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // ignore
  }
}

export function FirmTable({
  firms,
  onDelete,
  onExport,
  activeView,
  onViewChange,
  onAddClick,
}: FirmTableProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<FirmFilters>({
    status: "",
    firmType: "",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const allColumns = useMemo(() => getFirmTableColumns(onDelete), [onDelete]);
  const allColumnKeys = useMemo(() => allColumns.map((c) => c.key), [allColumns]);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
    loadVisibleColumns(allColumnKeys)
  );

  useEffect(() => {
    setVisibleColumns((prev) => {
      const next = prev.filter((k) => allColumnKeys.includes(k));
      if (next.length === 0) return allColumnKeys;
      return next;
    });
  }, [allColumnKeys]);

  const visibleColumnsTable = useMemo(
    () => allColumns.filter((c) => visibleColumns.includes(c.key)),
    [allColumns, visibleColumns]
  );

  const columnOptions = useMemo(
    () => allColumns.map(({ key, label }) => ({ key, label })),
    [allColumns]
  );

  const filtered = useMemo(() => {
    let list = firms;
    if (filter !== "all") {
      list = list.filter((f) => f.status === filter);
    }
    if (appliedFilters.status) {
      list = list.filter((f) => f.status === appliedFilters.status);
    }
    if (appliedFilters.firmType) {
      list = list.filter((f) => f.firmType === appliedFilters.firmType);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (f) =>
          (f.shopName || "").toLowerCase().includes(q) ||
          (f.firmId || "").toLowerCase().includes(q) ||
          (f.email || "").toLowerCase().includes(q) ||
          (f.phone || "").includes(q) ||
          (f.registrationNo || "").toLowerCase().includes(q) ||
          (f.gstinNo || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [firms, filter, search, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFirms = useMemo(
    () => filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filtered, startIndex]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search, appliedFilters]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(totalPages, page)));
    },
    [totalPages]
  );

  const handleVisibilityChange = useCallback((keys: string[]) => {
    setVisibleColumns(keys);
    saveVisibleColumns(keys);
  }, []);

  const tabItems = useMemo(
    () => [
      { key: "all" as const, label: "All Firms", count: firms.length },
      {
        key: "active" as const,
        label: "Active",
        count: firms.filter((f) => f.status === "active").length,
      },
      {
        key: "pending_review" as const,
        label: "Pending",
        count: firms.filter((f) => f.status === "pending_review").length,
      },
      {
        key: "inactive" as const,
        label: "Inactive",
        count: firms.filter((f) => f.status === "inactive").length,
      },
    ],
    [firms]
  );

  const handleExportClick = useCallback(() => {
    if (onExport) onExport(filtered);
  }, [onExport, filtered]);

  const handleRowClick = useCallback(
    (firm: Firm) => {
      router.push(`/firm/edit/${firm.id}`);
    },
    [router]
  );

  const hasActiveFilters =
    Boolean(appliedFilters.status) || Boolean(appliedFilters.firmType);

  return (
    <div className="min-w-0 space-y-4">
      <FirmTabs
        tabItems={tabItems}
        activeTab={filter}
        onTabChange={setFilter}
        searchQuery={search}
        onSearchChange={setSearch}
        activeView={activeView}
        onViewChange={onViewChange}
        onExportClick={onExport ? handleExportClick : undefined}
        onFilterClick={() => setIsFilterModalOpen(true)}
        onColumnVisibilityClick={() => setIsColumnModalOpen(true)}
        onAddClick={onAddClick}
        hasActiveFilters={hasActiveFilters}
      />

      <p className="text-sm text-zinc-500">
        Showing <strong>{filtered.length}</strong> result
        {filtered.length !== 1 ? "s" : ""}
      </p>

      <FirmListView
        firms={paginatedFirms}
        columns={visibleColumnsTable}
        totalCount={filtered.length}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
        emptyMessage="No firms match the current filters."
        searchQuery={search}
        onClearSearch={() => setSearch("")}
        onAddClick={onAddClick}
      />

      <FirmFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={setAppliedFilters}
        appliedFilters={appliedFilters}
      />

      <ColumnVisibilityModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columnOptions}
        visibleColumns={visibleColumns}
        onVisibilityChange={handleVisibilityChange}
      />
    </div>
  );
}
