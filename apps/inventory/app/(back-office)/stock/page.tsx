"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeftRight, ArrowDownCircle, ArrowUpCircle, Clock, Minus, Package, Plus } from "lucide-react";

import { useStockMovements } from "@jewellery-retail/hooks";
import { Button, PageHeader } from "@jewellery-retail/ui";
import type { StockMovement } from "@jewellery-retail/types";
import type { StockMovementView } from "@/src/types/stock";
import { StockTable } from "@/src/components/stock/StockTable";
import { StockKPIs } from "@/src/components/stock/StockKPIs";

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

  const totalMovements = movements.length;
  const inboundCount = movements.filter((m) => m.type === "inbound").length;
  const outboundCount = movements.filter((m) => m.type === "outbound").length;
  const pendingCount = movements.filter((m) => m.status === "pending").length;

  const statusStats = useMemo(
    () => [
      {
        label: "Total",
        count: totalMovements,
        icon: Package,
        color: "bg-amber-50",
        borderColor: "border-amber-200",
        iconColor: "text-amber-600",
      },
      {
        label: "Inbound",
        count: inboundCount,
        icon: ArrowDownCircle,
        color: "bg-emerald-50",
        borderColor: "border-emerald-200",
        iconColor: "text-emerald-600",
      },
      {
        label: "Outbound",
        count: outboundCount,
        icon: ArrowUpCircle,
        color: "bg-blue-50",
        borderColor: "border-blue-200",
        iconColor: "text-blue-600",
      },
      {
        label: "Pending",
        count: pendingCount,
        icon: Clock,
        color: "bg-yellow-50",
        borderColor: "border-yellow-200",
        iconColor: "text-yellow-600",
      },
    ],
    [totalMovements, inboundCount, outboundCount, pendingCount]
  );

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title="Stock"
        description="Review stock movements and trigger add, remove, or transfer workflows."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="primary"
              asChild
            >
              <Link href="/stock/add">
                <Plus className="mr-2 h-4 w-4" />
                Add stock
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <Link href="/stock/transfer">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Transfer stock
              </Link>
            </Button>
          </div>
        }
      />

      <StockKPIs statusStats={statusStats} />

      {/* Single area: click a stock row to open; details (product, location, etc.) show exactly below it */}
      <div className="min-w-0">
        <StockTable movements={movements} readOnly={false} />
      </div>
    </div>
  );
}
