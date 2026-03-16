"use client";

import { useMemo } from "react";
import { useStockMovements } from "@jewellery-retail/hooks";
import type { StockMovement } from "@jewellery-retail/types";
import type { StockMovementView } from "@/src/types/stock";
import { StockTable } from "../StockTable";

function toView(m: StockMovement): StockMovementView {
  return {
    ...m,
    status: m.status === "completed" || m.status === "pending" ? m.status : "pending",
  };
}

export function StockReportsTab() {
  const { data } = useStockMovements();
  const movements: StockMovementView[] = useMemo(() => data.map(toView), [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          className="min-h-10 rounded border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-navy-800 hover:bg-gray-50"
        >
          Export CSV
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-10 rounded border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-navy-800 hover:bg-gray-50"
        >
          Print
        </button>
      </div>
      <StockTable
        movements={movements}
        readOnly
      />
    </div>
  );
}
