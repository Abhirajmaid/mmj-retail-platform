"use client";

import { useMemo, useState, useCallback, Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, statusColor } from "@jewellery-retail/utils";
import type { StockMovementView } from "@/src/types/stock";

type MovementFilter = "All" | "Inbound" | "Outbound" | "Transfer";

interface StockTableProps {
  movements: StockMovementView[];
  /** Product key (productId|productName|sku) to scroll highlight */
  highlightedProductKey?: string | null;
  /** Read-only (e.g. Reports tab) — hide expand/collapse if needed */
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
  const [movementFilter, setMovementFilter] = useState<MovementFilter>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [productNameSearch, setProductNameSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

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
      if (dateFrom && m.updatedAt < dateFrom) return false;
      if (dateTo && m.updatedAt > dateTo) return false;
      return true;
    });
  }, [movements, movementFilter, productNameSearch, dateFrom, dateTo]);

  const groups = useMemo(() => {
    const byKey = new Map<string, StockMovementView[]>();
    for (const m of filtered) {
      const key = getProductKey(m);
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key)!.push(m);
    }
    return Array.from(byKey.entries()).map(([key, rows]) => {
      const first = rows[0];
      const totalQty = rows.reduce(
        (sum, r) => sum + (r.type === "outbound" ? -r.quantity : r.quantity),
        0
      );
      return {
        productKey: key,
        productName: first.productName,
        sku: first.sku,
        totalQty,
        rows,
      };
    });
  }, [filtered]);

  const toggleGroup = useCallback((productKey: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(productKey)) next.delete(productKey);
      else next.add(productKey);
      return next;
    });
  }, []);

  return (
    <div className="space-y-3">
      {/* Filter bar — movement: All | Inbound | Outbound | Transfer; date range; product name search on right */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
        {(["All", "Inbound", "Outbound", "Transfer"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setMovementFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              movementFilter === f
                ? "bg-amber-400 text-navy-800"
                : "bg-gray-100 text-gray-600 hover:bg-amber-100"
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-2 flex items-center gap-2 border-l border-gray-200 pl-3">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded border border-gray-200 px-2 py-1 text-xs focus:ring-1 focus:ring-amber-400"
          />
          <span className="text-gray-400">→</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded border border-gray-200 px-2 py-1 text-xs focus:ring-1 focus:ring-amber-400"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <input
            type="search"
            placeholder="Search by product name..."
            value={productNameSearch}
            onChange={(e) => setProductNameSearch(e.target.value)}
            className="w-48 rounded border border-gray-200 px-2 py-1.5 text-xs focus:ring-1 focus:ring-amber-400 sm:w-56"
          />
        </div>
      </div>

      <div className="min-w-0 w-full rounded-xl border border-zinc-100 bg-white">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="sticky top-0 z-10 bg-zinc-50/95 shadow-sm">
              <TableHeader className="w-8 shrink-0" />
              <TableHeader className="w-[25%] min-w-0 text-left">Product</TableHeader>
              <TableHeader className="w-[12%] min-w-0 text-left">Movement</TableHeader>
              <TableHeader className="w-[20%] min-w-0 text-left">Location</TableHeader>
              <TableHeader className="w-[15%] min-w-0 text-left">Status</TableHeader>
              <TableHeader className="w-[15%] min-w-0 text-left">Date</TableHeader>
              <TableHeader className="w-[13%] min-w-0 text-right">Quantity</TableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map(({ productKey, productName, sku, totalQty, rows }) => {
              const isCollapsed = collapsedGroups.has(productKey);
              const groupId = `group-${productKey.replace(/\|/g, "-")}`;
              const isHighlighted = highlightedProductKey === productKey;

              return (
                <Fragment key={productKey}>
                  <TableRow
                    key={productKey}
                    data-group-id={groupId}
                    className={`cursor-pointer border-b border-amber-200/80 ${
                      isHighlighted ? "bg-amber-100/80" : "bg-amber-50"
                    }`}
                    onClick={() => !readOnly && toggleGroup(productKey)}
                  >
                    <TableCell className="w-8 shrink-0 py-2 pl-4">
                      {!readOnly && (
                        <span className="inline-flex text-amber-700">
                          {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </TableCell>
                    <TableCell colSpan={6} className="py-2 pl-2 min-w-0">
                      <div className="flex items-center justify-between min-w-0">
                        <div className="text-left min-w-0 truncate">
                          <span className="font-semibold text-navy-800">
                            {productName}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {sku}
                          </span>
                        </div>
                        <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-xs font-medium text-amber-900">
                          Qty: {totalQty}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {!isCollapsed &&
                    rows.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="w-8 shrink-0 pl-4" />
                        <TableCell className="pl-2 text-left min-w-0">
                          <div className="min-w-0 break-words">
                            <p className="font-medium text-zinc-950 truncate" title={m.productName}>
                              {m.productName}
                            </p>
                            <p className="text-xs text-zinc-500 truncate" title={m.sku}>{m.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-left min-w-0 capitalize truncate">{m.type}</TableCell>
                        <TableCell className="text-left min-w-0 truncate" title={m.location}>{m.location}</TableCell>
                        <TableCell className="text-left">
                          <Badge variant={getStatusBadgeVariant(m.status)}>
                            {m.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left">{dateFormat(m.updatedAt)}</TableCell>
                        <TableCell className="text-right font-medium text-zinc-950">
                          {m.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
