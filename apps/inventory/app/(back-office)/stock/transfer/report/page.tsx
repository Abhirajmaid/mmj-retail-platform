"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@jewellery-retail/ui";
import { useStockTransferStore } from "@/src/store/stockTransferStore";
import { useFirmStore } from "@/src/store/firm-store";
import { FirmSelectorBar } from "@/src/components/stock/transfer/FirmSelectorBar";
import { StockTransferDropdown } from "@/src/components/stock/transfer/StockTransferDropdown";

export default function StockTransferReportPage() {
  const transfers = useStockTransferStore((s) => s.transfers);
  const viewingFirmId = useStockTransferStore((s) => s.viewingFirmId);
  const { firms, fetchFirms } = useFirmStore();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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

  const summary = useMemo(() => {
    const byFirm: Record<
      string,
      { date: string; category: string; type: string; qty: number; gsWt: number; ntWt: number; fnWt: number; ffnWt: number }[]
    > = {};
    filteredTransfers.forEach((t) => {
      const key = `${t.newFirm}`;
      if (!byFirm[key]) byFirm[key] = [];
      t.items.forEach((item) => {
        const created = t.createdAt.slice(0, 10);
        let found = byFirm[key].find(
          (s) => s.date === created && s.category === item.category && s.type === item.type
        );
        if (!found) {
          found = { date: created, category: item.category, type: item.type, qty: 0, gsWt: 0, ntWt: 0, fnWt: 0, ffnWt: 0 };
          byFirm[key].push(found);
        }
        found.qty += item.qty;
        found.gsWt += item.grossWeight;
        found.ntWt += item.netWeight;
        found.fnWt += item.fineWeight;
        found.ffnWt += item.fineFineWeight;
      });
    });
    return byFirm;
  }, [filteredTransfers]);

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <ArrowLeftRight className="h-5 w-5" />
          </span>
          <h1 className="text-xl font-bold uppercase tracking-wide text-zinc-900">
            STOCK TRANSFER REPORT
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <FirmSelectorBar />
          <StockTransferDropdown />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <span className="text-sm font-semibold text-zinc-700">FROM</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded border border-slate-200 px-3 py-2 text-sm"
        />
        <span className="text-sm font-semibold text-zinc-700">TO</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded border border-slate-200 px-3 py-2 text-sm"
        />
        <Button className="min-h-[44px] bg-amber-500 text-white hover:bg-amber-600">GO</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100 font-bold uppercase tracking-wide">
              <th className="p-3 text-left">FIRM</th>
              <th className="p-3 text-left">DATE</th>
              <th className="p-3 text-left">CATEGORY</th>
              <th className="p-3 text-left">TYPE</th>
              <th className="p-3 text-right">QTY</th>
              <th className="p-3 text-right">GS WT</th>
              <th className="p-3 text-right">NT WT</th>
              <th className="p-3 text-right">FN WT</th>
              <th className="p-3 text-right">FFN WT</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary).map(([firm, rows]) =>
              rows.map((row, i) => (
                <tr key={`${firm}-${i}`} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-3">{firm}</td>
                  <td className="p-3">{row.date}</td>
                  <td className="p-3">{row.category}</td>
                  <td className="p-3">{row.type}</td>
                  <td className="p-3 text-right">{row.qty.toFixed(3)}</td>
                  <td className="p-3 text-right">{row.gsWt.toFixed(3)}</td>
                  <td className="p-3 text-right">{row.ntWt.toFixed(3)}</td>
                  <td className="p-3 text-right">{row.fnWt.toFixed(3)}</td>
                  <td className="p-3 text-right">{row.ffnWt.toFixed(3)}</td>
                </tr>
              ))
            )}
            {Object.keys(summary).length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-zinc-500">
                  No transfer data for report
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        {["Copy", "CSV", "Excel", "JSON", "PDF", "Print", "Column Visibility"].map((label) => (
          <button
            key={label}
            type="button"
            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-slate-50"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
