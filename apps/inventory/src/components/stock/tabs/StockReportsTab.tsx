"use client";

import { useMemo } from "react";
import { FileBarChart } from "lucide-react";
import { Button, Card, CardBody, CardHeader, CardTitle } from "@jewellery-retail/ui";
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
    <div className="flex min-w-0 flex-col gap-6">
      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-4">
          <div className="flex flex-row items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FileBarChart className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg font-semibold text-zinc-900">Stock Reports</CardTitle>
              <p className="text-sm text-zinc-500">View and export stock movement reports</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-[44px] border-amber-200 text-amber-800 hover:bg-amber-50 sm:min-h-9"
            >
              Export CSV
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-[44px] border-amber-200 text-amber-800 hover:bg-amber-50 sm:min-h-9"
              onClick={() => window.print()}
            >
              Print
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <StockTable movements={movements} readOnly />
        </CardBody>
      </Card>
    </div>
  );
}
