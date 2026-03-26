"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Modal,
  Button,
  Input,
} from "@jewellery-retail/ui";
import { Trash2, CheckCircle, Circle, PackageCheck, Filter, Search, Download, ChevronDown } from "lucide-react";
import type { StockTransferItem, TransferStatus } from "@/src/types/stockTransfer";
import { TRANSFER_STATUS_LABELS } from "@/src/types/stockTransfer";

const COLS = [
  { key: "prodId", label: "PROD ID" },
  { key: "date", label: "DATE" },
  { key: "transferDate", label: "T.DATE" },
  { key: "prevFirm", label: "PREV FIRM" },
  { key: "firm", label: "FIRM" },
  { key: "type", label: "TYPE" },
  { key: "category", label: "CATEGORY" },
  { key: "name", label: "NAME" },
  { key: "hsn", label: "HSN" },
  { key: "qty", label: "QTY" },
  { key: "grossWeight", label: "GS WT" },
  { key: "netWeight", label: "NT WT" },
  { key: "purity", label: "PURITY" },
  { key: "fineWeight", label: "FN WT" },
  { key: "fineFineWeight", label: "FFN WT" },
  { key: "status", label: "STATUS" },
  { key: "return", label: "RETURN" },
] as const;

/** Item with optional transfer id for list views */
export type StockTransferTableItem = StockTransferItem & { _transferId?: string };

export interface StockTransferTableProps {
  items: StockTransferTableItem[] | StockTransferItem[];
  /** Flatten from transfers for list view */
  transferId?: string;
  statusFilter?: TransferStatus | null;
  showApprove?: boolean;
  showDelete?: boolean;
  onApprove?: (transferId: string) => void;
  onDelete?: (transferId: string, prodId: string) => void;
  /** Show receive control (approved list); on confirm, call onReceive(transferId) */
  showReceive?: boolean;
  onReceive?: (transferId: string) => void;
  rowsPerPageOptions?: number[];
}

type ListStatusTab = "ALL" | TransferStatus;

type ExportFormat = "copy" | "csv" | "excel" | "json" | "pdf" | "print";

function getStatusBadgeClass(status: TransferStatus): string {
  if (status === "STOCK_APPROVED") return "bg-emerald-100 text-emerald-800";
  if (status === "APPROVAL_PENDING") return "bg-amber-100 text-amber-800";
  if (status === "RETURN") return "bg-orange-100 text-orange-800";
  return "bg-slate-100 text-slate-800";
}

export function StockTransferTable({
  items,
  transferId,
  statusFilter,
  showApprove = false,
  showDelete = false,
  onApprove,
  onDelete,
  showReceive = false,
  onReceive,
  rowsPerPageOptions = [10, 25, 50, 100],
}: StockTransferTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0] ?? 10);
  const [page, setPage] = useState(1);
  const [globalSearch, setGlobalSearch] = useState("");
  const [activeStatusTab, setActiveStatusTab] = useState<ListStatusTab>("ALL");
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingReceiveId, setPendingReceiveId] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    }
    if (filterOpen || exportOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen, exportOpen]);

  const tabCounts = useMemo(() => {
    const typedItems = items as StockTransferTableItem[];
    return {
      ALL: typedItems.length,
      DRAFT: typedItems.filter((i) => i.status === "DRAFT").length,
      APPROVAL_PENDING: typedItems.filter((i) => i.status === "APPROVAL_PENDING").length,
      STOCK_APPROVED: typedItems.filter((i) => i.status === "STOCK_APPROVED").length,
      RETURN: typedItems.filter((i) => i.status === "RETURN").length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    const selectedStatus = statusFilter ?? (activeStatusTab === "ALL" ? null : activeStatusTab);
    if (selectedStatus) {
      list = list.filter((i) => i.status === selectedStatus);
    }
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      list = list.filter(
        (i) =>
          i.prodId.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.firm.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, statusFilter, activeStatusTab, globalSearch]) as StockTransferTableItem[];

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, i) => ({
        qty: acc.qty + i.qty,
        grossWeight: acc.grossWeight + i.grossWeight,
        netWeight: acc.netWeight + i.netWeight,
        fineWeight: acc.fineWeight + i.fineWeight,
        fineFineWeight: acc.fineFineWeight + i.fineFineWeight,
      }),
      { qty: 0, grossWeight: 0, netWeight: 0, fineWeight: 0, fineFineWeight: 0 }
    );
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const start = (page - 1) * rowsPerPage;
  const paginated = useMemo(
    () => filtered.slice(start, start + rowsPerPage),
    [filtered, start, rowsPerPage]
  );

  const getRowTransferId = (row: StockTransferTableItem) =>
    "_transferId" in row && row._transferId ? row._transferId : (transferId ?? "");

  const rowId = (row: StockTransferTableItem) => `${getRowTransferId(row)}-${row.prodId}`;
  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === paginated.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginated.map((r) => rowId(r))));
  }, [paginated, selectedIds.size]);

  const exportRows = useMemo(
    () =>
      filtered.map((row) => ({
        prodId: row.prodId,
        date: row.date,
        transferDate: row.transferDate,
        prevFirm: row.prevFirm,
        firm: row.firm,
        type: row.type,
        category: row.category,
        name: row.name,
        hsn: row.hsn,
        qty: row.qty,
        grossWeight: row.grossWeight,
        netWeight: row.netWeight,
        purity: row.purity,
        fineWeight: row.fineWeight,
        fineFineWeight: row.fineFineWeight,
        status: TRANSFER_STATUS_LABELS[row.status],
        return: row.returnFlag ? "Yes" : "No",
      })),
    [filtered]
  );

  const getCsvText = useCallback(() => {
    const header = [
      "PROD ID",
      "DATE",
      "T.DATE",
      "PREV FIRM",
      "FIRM",
      "TYPE",
      "CATEGORY",
      "NAME",
      "HSN",
      "QTY",
      "GS WT",
      "NT WT",
      "PURITY",
      "FN WT",
      "FFN WT",
      "STATUS",
      "RETURN",
    ];
    const csvRows = exportRows.map((row) =>
      [
        row.prodId,
        row.date,
        row.transferDate,
        row.prevFirm,
        row.firm,
        row.type,
        row.category,
        row.name,
        row.hsn,
        row.qty,
        row.grossWeight,
        row.netWeight,
        row.purity,
        row.fineWeight,
        row.fineFineWeight,
        row.status,
        row.return,
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    );
    return [header.join(","), ...csvRows].join("\n");
  }, [exportRows]);

  const downloadFile = useCallback((content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (exportRows.length === 0) {
        setExportOpen(false);
        return;
      }
      if (format === "copy") {
        const text = getCsvText();
        await navigator.clipboard.writeText(text);
      } else if (format === "csv") {
        downloadFile(getCsvText(), "stock-transfer-list.csv", "text/csv;charset=utf-8;");
      } else if (format === "excel") {
        downloadFile(getCsvText(), "stock-transfer-list.xls", "application/vnd.ms-excel");
      } else if (format === "json") {
        downloadFile(JSON.stringify(exportRows, null, 2), "stock-transfer-list.json", "application/json");
      } else if (format === "pdf" || format === "print") {
        window.print();
      }
      setExportOpen(false);
    },
    [exportRows, getCsvText, downloadFile]
  );

  return (
    <div className="min-w-0 space-y-4 overflow-visible">
      <div className="rounded-xl bg-transparent px-0 py-0 shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "ALL" as const, label: "All", count: tabCounts.ALL },
              { key: "DRAFT" as const, label: "Draft", count: tabCounts.DRAFT },
              { key: "APPROVAL_PENDING" as const, label: "Pending", count: tabCounts.APPROVAL_PENDING },
              { key: "STOCK_APPROVED" as const, label: "Approved", count: tabCounts.STOCK_APPROVED },
              { key: "RETURN" as const, label: "Return", count: tabCounts.RETURN },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveStatusTab(tab.key);
                  setPage(1);
                }}
                disabled={Boolean(statusFilter)}
                className={`flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeStatusTab === tab.key
                    ? "bg-amber-500 text-white shadow-lg"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
                } disabled:pointer-events-none disabled:opacity-60`}
              >
                {tab.label}
                <span className="ml-1.5">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search by product, category, firm..."
              className="h-10 rounded-xl border border-zinc-200 bg-white py-0 pl-10 pr-4 text-zinc-900 shadow-md placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
            />
          </div>

          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              title="Filter"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-md transition-colors hover:bg-zinc-50"
            >
              <Filter className="h-4 w-4" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 min-w-[180px] rounded-xl border border-zinc-200 bg-white p-3 shadow-lg">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Show entries
                </label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                    setFilterOpen(false);
                  }}
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700"
                >
                  {rowsPerPageOptions.map((n) => (
                    <option key={n} value={n}>
                      {n} entries
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="relative" ref={exportRef}>
            <button
              type="button"
              onClick={() => setExportOpen((v) => !v)}
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-700 shadow-md backdrop-blur-sm transition-colors hover:bg-zinc-50"
            >
              <Download className="h-4 w-4" />
              Export
              <ChevronDown className={`h-4 w-4 transition-transform ${exportOpen ? "rotate-180" : ""}`} />
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full z-30 mt-1 min-w-[180px] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {[
                  { key: "copy" as const, label: "Copy" },
                  { key: "csv" as const, label: "CSV" },
                  { key: "excel" as const, label: "Excel" },
                  { key: "json" as const, label: "JSON" },
                  { key: "pdf" as const, label: "PDF" },
                  { key: "print" as const, label: "Print" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => void handleExport(item.key)}
                    className="block w-full border-l-4 border-l-transparent px-4 py-2.5 text-left text-sm font-bold uppercase tracking-wide text-zinc-900 hover:border-l-amber-500 hover:bg-amber-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      <div className="min-w-0 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <Table className="min-w-[1500px] table-fixed">
          <TableHead>
            <TableRow>
              <TableHeader className="w-10 min-w-0 py-2 pl-4">
                <input
                  type="checkbox"
                  checked={paginated.length > 0 && selectedIds.size === paginated.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-zinc-300 text-amber-500"
                />
              </TableHeader>
              {COLS.map((col) => (
                <TableHeader key={col.key} className="min-w-0 py-2">
                  {col.label}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Totals row */}
            {filtered.length > 0 && (
              <TableRow className="border-b border-zinc-100 bg-zinc-50/50">
                <TableCell className="py-2 pl-4 text-sm font-semibold text-red-500">&nbsp;</TableCell>
                <TableCell colSpan={9} className="py-2 text-right text-sm font-semibold text-red-500">
                  &nbsp;
                </TableCell>
                <TableCell className="py-2 text-right text-sm font-semibold text-red-500">{totals.qty.toFixed(3)}</TableCell>
                <TableCell className="py-2 text-right text-sm font-semibold text-red-500">{totals.grossWeight.toFixed(3)}</TableCell>
                <TableCell className="py-2 text-right text-sm font-semibold text-red-500">{totals.netWeight.toFixed(3)}</TableCell>
                <TableCell className="py-2 text-sm font-semibold text-red-500">&nbsp;</TableCell>
                <TableCell className="py-2 text-right text-sm font-semibold text-red-500">{totals.fineWeight.toFixed(3)}</TableCell>
                <TableCell className="py-2 text-right text-sm font-semibold text-red-500">{totals.fineFineWeight.toFixed(3)}</TableCell>
                <TableCell colSpan={2} className="py-2 text-sm font-semibold text-red-500">&nbsp;</TableCell>
              </TableRow>
            )}

            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLS.length + 1} className="py-8 text-center text-zinc-500">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, idx) => {
                const transferId = getRowTransferId(row);
                const isFirstRowOfTransfer =
                  paginated.findIndex((r) => getRowTransferId(r) === transferId) === idx;
                return (
                  <TableRow
                    key={`${row.prodId}-${idx}`}
                    className="border-b border-zinc-100 bg-white"
                  >
                    <TableCell className="py-2 pl-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(rowId(row))}
                        onChange={() => toggleSelected(rowId(row))}
                        className="h-4 w-4 rounded border-zinc-300 text-amber-500"
                      />
                    </TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.prodId}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.date}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.transferDate}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.prevFirm}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.firm}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.type}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.category}</TableCell>
                    <TableCell className="py-2 pl-4 min-w-0">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-zinc-900" title={row.name}>
                          {row.name}
                        </p>
                        <p className="truncate text-xs text-zinc-500" title={row.prodId}>
                          {row.prodId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.hsn}</TableCell>
                    <TableCell className="py-2 text-right text-sm font-medium text-zinc-900">{row.qty}</TableCell>
                    <TableCell className="py-2 text-right text-sm text-zinc-700">{row.grossWeight.toFixed(3)}</TableCell>
                    <TableCell className="py-2 text-right text-sm text-zinc-700">{row.netWeight.toFixed(3)}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.purity}</TableCell>
                    <TableCell className="py-2 text-right text-sm text-zinc-700">{row.fineWeight.toFixed(3)}</TableCell>
                    <TableCell className="py-2 text-right text-sm text-zinc-700">{row.fineFineWeight.toFixed(3)}</TableCell>
                    <TableCell className="py-2 text-left">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusBadgeClass(row.status)}`}>
                        {TRANSFER_STATUS_LABELS[row.status]}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-left">
                      {(row.status === "RETURN" || row.returnFlag) && (
                        <span
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-200 text-orange-600"
                          title="Return"
                        >
                          <Circle className="h-3.5 w-3.5 fill-current" />
                        </span>
                      )}
                      {showApprove && row.status === "APPROVAL_PENDING" && (
                        <button
                          type="button"
                          onClick={() => onApprove?.(getRowTransferId(row))}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-amber-600 hover:bg-amber-100"
                          title="Approve"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      {showReceive && isFirstRowOfTransfer && (
                        <button
                          type="button"
                          onClick={() => setPendingReceiveId(transferId)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-emerald-600 hover:bg-emerald-100"
                          title="Receive (add to receiving firm stock)"
                        >
                          <PackageCheck className="h-5 w-5" />
                        </button>
                      )}
                      {showDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete?.(getRowTransferId(row), row.prodId)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-orange-600 hover:bg-orange-100"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {showReceive && onReceive && (
        <Modal
          open={pendingReceiveId != null}
          onClose={() => setPendingReceiveId(null)}
          title="Confirm receive"
          size="sm"
        >
          <p className="mb-4 text-sm text-zinc-600">
            Receive this transfer? Items will be added to the receiving firm stock.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setPendingReceiveId(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (pendingReceiveId) {
                  onReceive(pendingReceiveId);
                  setPendingReceiveId(null);
                }
              }}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Approved
            </Button>
          </div>
        </Modal>
      )}

      <p className="text-xs text-zinc-500">
        Showing {filtered.length === 0 ? 0 : start + 1} to {Math.min(start + rowsPerPage, filtered.length)} of {filtered.length} entries
        {items.length !== filtered.length ? ` (filtered from ${items.length} total entries)` : ""}.
      </p>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="rounded border border-slate-200 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Previous
        </button>
        {(() => {
          const maxVisible = 7;
          const pages: (number | "ellipsis")[] =
            totalPages <= maxVisible
              ? Array.from({ length: totalPages }, (_, i) => i + 1)
              : [
                  ...(page > 2 ? [1, "ellipsis" as const] : page > 1 ? [1] : []),
                  ...Array.from({ length: totalPages }, (_, i) => i + 1).filter(
                    (p) => p >= Math.max(1, page - 1) && p <= Math.min(totalPages, page + 1)
                  ),
                  ...(page < totalPages - 1 ? ["ellipsis" as const, totalPages] : page < totalPages ? [totalPages] : []),
                ];
          return pages.map((p, i) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-1 text-zinc-400">…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`min-w-[2rem] rounded border px-3 py-1.5 text-sm ${
                  p === page
                    ? "border-amber-500 bg-amber-50 text-amber-800 font-semibold"
                    : "border-slate-200 bg-white text-zinc-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            )
          );
        })()}
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="rounded border border-slate-200 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
