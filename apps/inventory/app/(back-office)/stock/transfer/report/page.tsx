"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Button, Input, PageHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@jewellery-retail/ui";
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
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <PageHeader
        title="Stock Transfer Report"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <FirmSelectorBar />
            <StockTransferDropdown />
          </div>
        }
      />

      <div className="rounded-xl bg-white px-4 py-3 shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-zinc-700">From</span>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm sm:w-[180px]"
            />
            <span className="text-sm font-semibold text-zinc-700">To</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm sm:w-[180px]"
            />
            <Button className="h-10 rounded-xl bg-amber-500 px-5 text-white shadow-sm hover:bg-amber-600">
              Go
            </Button>
          </div>

          <div className="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              placeholder="Search firm, category, type..."
              className="h-10 rounded-xl border border-zinc-200 bg-white py-0 pl-10 pr-4 text-zinc-900 shadow-md placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>

      <div className="min-w-0 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <Table className="min-w-[900px] table-fixed">
          <TableHead>
            <TableRow>
              <TableHeader className="w-[18%] min-w-0 py-2">FIRM</TableHeader>
              <TableHeader className="w-[12%] min-w-0 py-2">DATE</TableHeader>
              <TableHeader className="w-[14%] min-w-0 py-2">CATEGORY</TableHeader>
              <TableHeader className="w-[14%] min-w-0 py-2">TYPE</TableHeader>
              <TableHeader className="w-[10%] min-w-0 py-2 text-right">QTY</TableHeader>
              <TableHeader className="w-[10%] min-w-0 py-2 text-right">GS WT</TableHeader>
              <TableHeader className="w-[10%] min-w-0 py-2 text-right">NT WT</TableHeader>
              <TableHeader className="w-[10%] min-w-0 py-2 text-right">FN WT</TableHeader>
              <TableHeader className="w-[10%] min-w-0 py-2 text-right">FFN WT</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(summary).length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-zinc-500">
                  No transfer data for report
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(summary).flatMap(([firm, rows]) =>
                rows.map((row, i) => (
                  <TableRow key={`${firm}-${i}`} className="border-b border-zinc-100 bg-white">
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{firm}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.date}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.category}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.type}</TableCell>
                    <TableCell className="py-2 text-right text-sm font-medium text-zinc-900">{row.qty.toFixed(3)}</TableCell>
                    <TableCell className="py-2 text-right text-sm text-zinc-700">{row.gsWt.toFixed(3)}</TableCell>
                    <TableCell className="py-2 text-right text-sm text-zinc-700">{row.ntWt.toFixed(3)}</TableCell>
                    <TableCell className="py-2 text-right text-sm text-zinc-700">{row.fnWt.toFixed(3)}</TableCell>
                    <TableCell className="py-2 text-right text-sm text-zinc-700">{row.ffnWt.toFixed(3)}</TableCell>
                  </TableRow>
                ))
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
