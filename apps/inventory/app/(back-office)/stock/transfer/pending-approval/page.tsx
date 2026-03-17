"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useStockTransferStore } from "@/src/store/stockTransferStore";
import { useFirmStore } from "@/src/store/firm-store";
import { FirmSelectorBar } from "@/src/components/stock/transfer/FirmSelectorBar";
import { StockTransferDropdown } from "@/src/components/stock/transfer/StockTransferDropdown";
import { StockTransferTable } from "@/src/components/stock/transfer/StockTransferTable";

export default function PendingApprovalPage() {
  const getPendingApprovals = useStockTransferStore((s) => s.getPendingApprovals);
  const viewingFirmId = useStockTransferStore((s) => s.viewingFirmId);
  const approveTransfer = useStockTransferStore((s) => s.approveTransfer);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { firms, fetchFirms } = useFirmStore();

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  const pending = getPendingApprovals();
  const viewingShopName = viewingFirmId ? firms.find((f) => f.id === viewingFirmId)?.shopName : null;
  const filteredPending = useMemo(() => {
    if (!viewingShopName) return pending;
    return pending.filter(
      (t) => t.prevFirm === viewingShopName || t.newFirm === viewingShopName
    );
  }, [pending, viewingShopName]);

  const allItems = filteredPending.flatMap((t) =>
    t.items.map((item) => ({ ...item, _transferId: t.id }))
  );

  const handleApprove = useCallback(
    (transferId: string) => {
      approveTransfer(transferId, "Current User");
      setSuccessMessage("~ Stock Approved Successfully ~");
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    [approveTransfer]
  );

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center border-l-4 border-amber-500 pl-4">
          <h1 className="text-xl font-bold uppercase tracking-wide text-zinc-900">
            STOCK TRANSFER - PENDING APPROVAL LIST
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <FirmSelectorBar />
          <StockTransferDropdown />
        </div>
      </div>

      {successMessage && (
        <div className="rounded-lg bg-emerald-100 px-4 py-3 text-center text-sm font-semibold text-emerald-800">
          {successMessage}
        </div>
      )}

      <StockTransferTable
        items={allItems}
        statusFilter="APPROVAL_PENDING"
        showApprove
        onApprove={handleApprove}
      />
    </div>
  );
}
