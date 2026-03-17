"use client";

import { useMemo, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { useStockTransferStore } from "@/src/store/stockTransferStore";
import { useFirmStore } from "@/src/store/firm-store";
import { FirmSelectorBar } from "@/src/components/stock/transfer/FirmSelectorBar";
import { StockTransferDropdown } from "@/src/components/stock/transfer/StockTransferDropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";

export default function StockTransferHistoryPage() {
  const history = useStockTransferStore((s) => s.history);
  const transfers = useStockTransferStore((s) => s.transfers);
  const viewingFirmId = useStockTransferStore((s) => s.viewingFirmId);
  const { firms, fetchFirms } = useFirmStore();

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  const viewingShopName = viewingFirmId ? firms.find((f) => f.id === viewingFirmId)?.shopName : null;
  const transferMap = Object.fromEntries(transfers.map((t) => [t.id, t]));
  const sortedHistory = useMemo(() => {
    let list = [...history];
    if (viewingShopName) {
      list = list.filter((h) => {
        const t = transferMap[h.transferId];
        return t && (t.prevFirm === viewingShopName || t.newFirm === viewingShopName);
      });
    }
    return list.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [history, viewingShopName, transferMap]);

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <ArrowLeftRight className="h-5 w-5" />
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wide text-zinc-900">
            STOCK TRANSFER HISTORY
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <FirmSelectorBar />
          <StockTransferDropdown />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHead>
            <TableRow className="bg-slate-100">
              <TableHeader className="font-bold uppercase">DATE / TIME</TableHeader>
              <TableHeader className="font-bold uppercase">TRANSFER (VOUCHER)</TableHeader>
              <TableHeader className="font-bold uppercase">ACTION</TableHeader>
              <TableHeader className="font-bold uppercase">BY</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-zinc-500">
                  No history yet
                </TableCell>
              </TableRow>
            ) : (
              sortedHistory.map((h) => {
                const t = transferMap[h.transferId];
                const voucher = t
                  ? `${t.voucherPrefix}-${t.voucherNumber}`
                  : h.transferId.slice(0, 8);
                return (
                  <TableRow key={`${h.transferId}-${h.at}`} className="hover:bg-amber-50/40">
                    <TableCell className="text-sm">
                      {new Date(h.at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm font-mono">{voucher}</TableCell>
                    <TableCell className="text-sm">{h.action}</TableCell>
                    <TableCell className="text-sm">{h.by}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
