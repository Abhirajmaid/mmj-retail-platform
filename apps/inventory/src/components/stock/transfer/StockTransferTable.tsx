"use client";

import { useMemo, useState, useCallback } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Modal,
  Button,
} from "@jewellery-retail/ui";
import { Trash2, CheckCircle, Circle, PackageCheck } from "lucide-react";
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingReceiveId, setPendingReceiveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...items];
    if (statusFilter) {
      list = list.filter((i) => i.status === statusFilter);
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
  }, [items, statusFilter, globalSearch]) as StockTransferTableItem[];

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

  return (
    <div className="min-w-0 space-y-4 overflow-hidden">
      {/* Toolbar: label above input like ref form (Bill Date, Firm, etc.) – no scroll */}
      <div className="flex flex-wrap items-end gap-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Show entries</label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="min-h-[36px] w-full min-w-0 rounded border border-slate-200 bg-white px-2 py-1.5 text-sm sm:w-[120px]"
          >
            {rowsPerPageOptions.map((n) => (
              <option key={n} value={n}>{n} entries</option>
            ))}
          </select>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:min-w-[200px]">
          <label className="text-sm font-medium text-zinc-700">Search</label>
          <input
            type="search"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Product, name, category, firm…"
            className="min-h-[36px] w-full min-w-0 rounded border border-slate-200 bg-white px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="min-w-0 max-w-full rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm [&_td]:break-words [&_td]:px-1 [&_td]:py-1.5 [&_td]:align-top" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "2.5%" }} />
            {COLS.map((col) => (
              <col key={col.key} style={{ width: "5.7%" }} />
            ))}
          </colgroup>
          <TableHead>
            <TableRow className="bg-slate-100">
              <TableHeader className="text-xs font-bold uppercase tracking-wide px-1">
                <input
                  type="checkbox"
                  checked={paginated.length > 0 && selectedIds.size === paginated.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
              </TableHeader>
              {COLS.map((col) => (
                <TableHeader
                  key={col.key}
                  className="text-xs font-bold uppercase tracking-wide px-1 py-2 text-left align-top whitespace-normal"
                  style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                >
                  {col.label}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Totals row */}
            {filtered.length > 0 && (
              <TableRow className="border-b border-slate-200 bg-slate-50/50">
                <TableCell className="text-sm font-semibold text-red-500">&nbsp;</TableCell>
                <TableCell colSpan={9} className="text-right text-sm font-semibold text-red-500">
                  &nbsp;
                </TableCell>
                <TableCell className="text-right text-sm font-semibold text-red-500">{totals.qty.toFixed(3)}</TableCell>
                <TableCell className="text-right text-sm font-semibold text-red-500">{totals.grossWeight.toFixed(3)}</TableCell>
                <TableCell className="text-right text-sm font-semibold text-red-500">{totals.netWeight.toFixed(3)}</TableCell>
                <TableCell className="text-sm font-semibold text-red-500">&nbsp;</TableCell>
                <TableCell className="text-right text-sm font-semibold text-red-500">{totals.fineWeight.toFixed(3)}</TableCell>
                <TableCell className="text-right text-sm font-semibold text-red-500">{totals.fineFineWeight.toFixed(3)}</TableCell>
                <TableCell colSpan={2} className="text-sm font-semibold text-red-500">&nbsp;</TableCell>
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
                  className="border-b border-slate-100 hover:bg-amber-50/40 even:bg-slate-50/30"
                >
                  <TableCell className="w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(rowId(row))}
                      onChange={() => toggleSelected(rowId(row))}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                  </TableCell>
                  <TableCell className="text-xs">{row.prodId}</TableCell>
                  <TableCell className="text-xs">{row.date}</TableCell>
                  <TableCell className="text-xs">{row.transferDate}</TableCell>
                  <TableCell className="text-xs">{row.prevFirm}</TableCell>
                  <TableCell className="text-xs">{row.firm}</TableCell>
                  <TableCell className="text-xs">{row.type}</TableCell>
                  <TableCell className="text-xs">{row.category}</TableCell>
                  <TableCell className="text-xs">{row.name}</TableCell>
                  <TableCell className="text-xs">{row.hsn}</TableCell>
                  <TableCell className="text-right text-xs">{row.qty}</TableCell>
                  <TableCell className="text-right text-xs">{row.grossWeight.toFixed(3)}</TableCell>
                  <TableCell className="text-right text-xs">{row.netWeight.toFixed(3)}</TableCell>
                  <TableCell className="text-xs">{row.purity}</TableCell>
                  <TableCell className="text-right text-xs">{row.fineWeight.toFixed(3)}</TableCell>
                  <TableCell className="text-right text-xs">{row.fineFineWeight.toFixed(3)}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusBadgeClass(row.status)}`}>
                      {TRANSFER_STATUS_LABELS[row.status]}
                    </span>
                  </TableCell>
                  <TableCell>
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
        </table>
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
