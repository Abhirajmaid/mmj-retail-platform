"use client";

import { useMemo, useRef, useCallback } from "react";
import type { StockMovementView } from "@/src/types/stock";

const AMBER_PILL =
  "inline-flex items-center justify-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800";

interface StockProductSidebarProps {
  movements: StockMovementView[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedProductKey: string | null;
  onSelectProduct: (productKey: string) => void;
  /** Ref for the table container so we can scroll to group by id */
  tableContainerRef?: React.RefObject<HTMLDivElement | null>;
  /** Map productKey -> group row element id (e.g. group-{productId}) */
  getGroupElementId?: (productKey: string) => string;
  /** Mobile: show as horizontal chips instead of sidebar */
  variant?: "sidebar" | "chips";
}

function getProductKey(m: StockMovementView): string {
  return `${m.productId}|${m.productName}|${m.sku}`;
}

function getProductSummary(movements: StockMovementView[]) {
  const byKey = new Map<string, { name: string; sku: string; totalQty: number }>();
  for (const m of movements) {
    const key = getProductKey(m);
    const cur = byKey.get(key);
    const qty = m.type === "outbound" ? -m.quantity : m.quantity;
    if (!cur) {
      byKey.set(key, { name: m.productName, sku: m.sku, totalQty: qty });
    } else {
      cur.totalQty += qty;
    }
  }
  return Array.from(byKey.entries()).map(([key, v]) => ({ key, ...v }));
}

export function StockProductSidebar({
  movements,
  searchQuery,
  onSearchChange,
  selectedProductKey,
  onSelectProduct,
  tableContainerRef,
  getGroupElementId,
  variant = "sidebar",
}: StockProductSidebarProps) {
  const summary = useMemo(() => getProductSummary(movements), [movements]);
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return summary;
    const q = searchQuery.toLowerCase();
    return summary.filter(
      (s) => s.name.toLowerCase().includes(q) || s.sku.toLowerCase().includes(q)
    );
  }, [summary, searchQuery]);

  const scrollToGroup = useCallback(
    (productKey: string) => {
      onSelectProduct(productKey);
      const id = getGroupElementId?.(productKey);
      const container = tableContainerRef?.current;
      if (id && container) {
        const el = container.querySelector(`[data-group-id="${id}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    [getGroupElementId, tableContainerRef, onSelectProduct]
  );

  const header = (
    <>
      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
        Products
      </span>
      <input
        type="search"
        placeholder="Search product..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mt-2 w-full rounded border border-gray-200 px-2 py-1.5 text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
      />
    </>
  );

  if (variant === "chips") {
    return (
      <div className="space-y-2">
        {header}
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 md:flex-wrap">
          {filtered.map(({ key, name, sku, totalQty }) => {
            const isActive = selectedProductKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => scrollToGroup(key)}
                className={`min-h-10 shrink-0 rounded-full border px-3 py-2 text-left text-xs transition-colors ${
                  isActive
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-amber-50"
                }`}
              >
                <span className="font-semibold">{name}</span>
                <span className="ml-1 text-gray-500">({sku})</span>
                <span className={`ml-2 ${AMBER_PILL}`}>{totalQty}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="border-b border-gray-100 p-3">
        {header}
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2">
          {filtered.map(({ key, name, sku, totalQty }) => {
            const isActive = selectedProductKey === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => scrollToGroup(key)}
                  className={`flex w-full items-center justify-between gap-2 border-l-2 px-3 py-2 text-left transition-colors ${
                    isActive
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">{name}</p>
                    <p className="truncate text-xs text-gray-500">{sku}</p>
                  </div>
                  <span className={AMBER_PILL}>{totalQty}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
