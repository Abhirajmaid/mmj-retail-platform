"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeftRight, Minus, Plus } from "lucide-react";

import { useStockMovements } from "@jewellery-retail/hooks";
import { Button, PageHeader } from "@jewellery-retail/ui";
import type { StockMovement } from "@jewellery-retail/types";
import type { StockMovementView } from "@/src/types/stock";
import { StockTable } from "@/src/components/stock/StockTable";

function toView(m: StockMovement): StockMovementView {
  return {
    ...m,
    status: m.status === "completed" || m.status === "pending" ? m.status : "pending",
  };
}

export default function StockPage() {
  const { data } = useStockMovements();

  const movements: StockMovementView[] = useMemo(
    () => data.map(toView),
    [data]
  );

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Stock"
        description="Review stock movements and trigger add, remove, or transfer workflows."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" className="min-h-[44px] sm:min-h-9" asChild>
              <Link href="/stock/add">
                <Plus className="mr-2 h-4 w-4" />
                Add stock
              </Link>
            </Button>
            <Button variant="outline" className="min-h-[44px] sm:min-h-9">
              <Minus className="mr-2 h-4 w-4" />
              Remove stock
            </Button>
            <Button className="min-h-[44px] sm:min-h-9">
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Transfer stock
            </Button>
          </div>
        }
      />

      {/* Single area: click a stock row to open; details (product, location, etc.) show exactly below it */}
      <div className="min-w-0">
        <StockTable movements={movements} readOnly={false} />
      </div>
    </div>
  );
}
