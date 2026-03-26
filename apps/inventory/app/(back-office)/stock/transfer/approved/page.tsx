"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PageHeader } from "@jewellery-retail/ui";
import { useStockTransferStore } from "@/src/store/stockTransferStore";
import { useFirmStore } from "@/src/store/firm-store";
import { FirmSelectorBar } from "@/src/components/stock/transfer/FirmSelectorBar";
import { StockTransferDropdown } from "@/src/components/stock/transfer/StockTransferDropdown";
import { StockTransferTable } from "@/src/components/stock/transfer/StockTransferTable";

export default function ApprovedListPage() {
  const getApproved = useStockTransferStore((s) => s.getApproved);
  const receiveTransfer = useStockTransferStore((s) => s.receiveTransfer);
  const viewingFirmId = useStockTransferStore((s) => s.viewingFirmId);
  const approved = getApproved();
  const { firms, fetchFirms } = useFirmStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleReceive = useCallback(
    (transferId: string) => {
      receiveTransfer(transferId, "Current User");
      setSuccessMessage("Transfer received. Items added to receiving firm stock.");
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    [receiveTransfer]
  );

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  const viewingShopName = viewingFirmId ? firms.find((f) => f.id === viewingFirmId)?.shopName : null;
  const filteredApproved = useMemo(() => {
    if (!viewingShopName) return approved;
    return approved.filter(
      (t) => t.prevFirm === viewingShopName || t.newFirm === viewingShopName
    );
  }, [approved, viewingShopName]);

  const allItems = filteredApproved.flatMap((t) =>
    t.items.map((item) => ({ ...item, _transferId: t.id }))
  );

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <PageHeader
        title="Stock Transfer - Approved List"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <FirmSelectorBar />
            <StockTransferDropdown />
          </div>
        }
      />

      {successMessage && (
        <div className="rounded-lg bg-emerald-100 px-4 py-3 text-center text-sm font-semibold text-emerald-800">
          {successMessage}
        </div>
      )}

      <StockTransferTable
        items={allItems}
        statusFilter="STOCK_APPROVED"
        showReceive
        onReceive={handleReceive}
      />
    </div>
  );
}
