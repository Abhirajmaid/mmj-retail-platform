"use client";

import { useMemo, useEffect } from "react";
import { PageHeader } from "@jewellery-retail/ui";
import { useStockTransferStore } from "@/src/store/stockTransferStore";
import { useFirmStore } from "@/src/store/firm-store";
import { FirmSelectorBar } from "@/src/components/stock/transfer/FirmSelectorBar";
import { StockTransferDropdown } from "@/src/components/stock/transfer/StockTransferDropdown";
import { StockTransferTable } from "@/src/components/stock/transfer/StockTransferTable";

export default function StockTransferListPage() {
  const transfers = useStockTransferStore((s) => s.transfers);
  const viewingFirmId = useStockTransferStore((s) => s.viewingFirmId);
  const deleteTransferItem = useStockTransferStore((s) => s.deleteTransferItem);
  const { firms, fetchFirms } = useFirmStore();

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  const viewingShopName = viewingFirmId ? firms.find((f) => f.id === viewingFirmId)?.shopName : null;
  const filteredTransfers = useMemo(() => {
    if (!viewingShopName) return transfers;
    return transfers.filter(
      (t) => t.prevFirm === viewingShopName || t.newFirm === viewingShopName
    );
  }, [transfers, viewingShopName]);

  const allItems = filteredTransfers.flatMap((t) =>
    t.items.map((item) => ({ ...item, _transferId: t.id }))
  );

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <PageHeader
        title="Stock Transfer List"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <FirmSelectorBar />
            <StockTransferDropdown />
          </div>
        }
      />

      <StockTransferTable
        items={allItems}
        showDelete
        onDelete={(transferId, prodId) => deleteTransferItem(transferId, prodId)}
      />
    </div>
  );
}
