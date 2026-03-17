"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";

/** Gold Stock List row - matches Image 8 columns */
export interface GoldStockListRow {
  firmName: string;
  metalType: string;
  pCode: string;
  itemCategory: string;
  itemName: string;
  qty: number;
  grossWeight: number;
  lessWeight: number;
  packetWeight: number;
  netWeight: number;
  wTagWt: number;
  krtPrtPct: string;
  avgPrtyPct: string;
  avgRate: number;
}

const COLS = [
  { key: "firmName", label: "FIRM NAME" },
  { key: "metalType", label: "METAL TYPE" },
  { key: "pCode", label: "P.CODE" },
  { key: "itemCategory", label: "ITEM CATEGORY" },
  { key: "itemName", label: "ITEM NAME" },
  { key: "qty", label: "QTY" },
  { key: "grossWeight", label: "GROSS WEIGHT" },
  { key: "lessWeight", label: "LESS WEIGHT" },
  { key: "packetWeight", label: "PACKET WEIGHT" },
  { key: "netWeight", label: "NET WEIGHT" },
  { key: "wTagWt", label: "W.TAGWT" },
  { key: "krtPrtPct", label: "KRT/PRT%" },
  { key: "avgPrtyPct", label: "AVG PRTY%" },
  { key: "avgRate", label: "AVG RATE" },
] as const;

const MOCK_GOLD_ROWS: GoldStockListRow[] = [
  {
    firmName: "OM3",
    metalType: "Gold",
    pCode: "P001",
    itemCategory: "RING",
    itemName: "LRING",
    qty: 19,
    grossWeight: 185,
    lessWeight: 0.1,
    packetWeight: 0,
    netWeight: 184.9,
    wTagWt: 0,
    krtPrtPct: "92",
    avgPrtyPct: "92",
    avgRate: 6500,
  },
];

export interface GoldStockListTableProps {
  rows?: GoldStockListRow[];
  onBack?: () => void;
  showBackButton?: boolean;
}

export function GoldStockListTable({
  rows = MOCK_GOLD_ROWS,
  onBack,
  showBackButton = true,
}: GoldStockListTableProps) {
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [globalSearch, setGlobalSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...rows];
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      list = list.filter(
        (r) =>
          r.firmName.toLowerCase().includes(q) ||
          r.itemCategory.toLowerCase().includes(q) ||
          r.pCode.toLowerCase().includes(q) ||
          r.itemName.toLowerCase().includes(q)
      );
    }
    COLS.forEach((col) => {
      const v = columnFilters[col.key];
      if (v?.trim()) {
        const q = v.toLowerCase();
        list = list.filter((row) => {
          const val = String((row as Record<string, unknown>)[col.key] ?? "").toLowerCase();
          return val.includes(q);
        });
      }
    });
    return list;
  }, [rows, globalSearch, columnFilters]);

  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, r) => ({
          qty: acc.qty + r.qty,
          grossWeight: acc.grossWeight + r.grossWeight,
          netWeight: acc.netWeight + r.netWeight,
        }),
        { qty: 0, grossWeight: 0, netWeight: 0 }
      ),
    [filtered]
  );

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {showBackButton && (
            <button
              type="button"
              onClick={onBack}
              className="min-h-[44px] rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              « BACK
            </button>
          )}
        </div>
        <button
          type="button"
          className="min-h-[44px] rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-900 hover:bg-amber-600"
        >
          ALL GOLD STOCK LIST
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <input
          type="search"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Search..."
          className="min-h-[36px] w-48 rounded border border-slate-200 px-2 py-1.5 text-sm"
        />
        <div className="ml-auto flex gap-2">
          {["Copy", "CSV", "Excel", "JSON", "PDF", "Print", "Column Visibility", "Print Selected"].map(
            (l) => (
              <button
                key={l}
                type="button"
                className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-slate-50"
              >
                {l}
              </button>
            )
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow className="bg-slate-100">
              {COLS.map((col) => (
                <TableHead key={col.key} className="text-xs font-bold uppercase tracking-wide">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
            <TableRow className="bg-white">
              {COLS.map((col) => (
                <TableHead key={col.key} className="p-1">
                  <input
                    type="text"
                    placeholder={`Search`}
                    value={columnFilters[col.key] ?? ""}
                    onChange={(e) =>
                      setColumnFilters((prev) => ({ ...prev, [col.key]: e.target.value }))
                    }
                    className="h-7 w-full rounded border border-gray-200 px-1 text-xs"
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 && (
              <TableRow className="border-b border-slate-200 bg-red-50/30">
                <TableCell colSpan={5} className="text-right text-sm font-semibold text-red-500">
                  &nbsp;
                </TableCell>
                <TableCell className="text-right text-sm font-semibold text-red-500">
                  {totals.qty.toFixed(3)}
                </TableCell>
                <TableCell className="text-right text-sm font-semibold text-red-500">
                  {totals.grossWeight.toFixed(3)}
                </TableCell>
                <TableCell colSpan={3} className="text-sm font-semibold text-red-500">
                  &nbsp;
                </TableCell>
                <TableCell className="text-right text-sm font-semibold text-red-500">
                  {totals.netWeight.toFixed(3)}
                </TableCell>
                <TableCell colSpan={3} className="text-sm font-semibold text-red-500">
                  &nbsp;
                </TableCell>
              </TableRow>
            )}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLS.length} className="py-8 text-center text-zinc-500">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, idx) => (
                <TableRow
                  key={idx}
                  className="border-b border-slate-100 hover:bg-amber-50/40 even:bg-slate-50/30"
                >
                  <TableCell className="text-xs">{row.firmName}</TableCell>
                  <TableCell className="text-xs">{row.metalType}</TableCell>
                  <TableCell className="text-xs">
                    <Link
                      href="#"
                      className="font-medium text-amber-700 hover:underline"
                    >
                      {row.pCode}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs">
                    <Link
                      href="#"
                      className="font-medium text-amber-700 hover:underline"
                    >
                      {row.itemCategory}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs">{row.itemName}</TableCell>
                  <TableCell className="text-right text-xs">{row.qty}</TableCell>
                  <TableCell className="text-right text-xs">{row.grossWeight.toFixed(3)}</TableCell>
                  <TableCell className="text-right text-xs">{row.lessWeight.toFixed(3)}</TableCell>
                  <TableCell className="text-right text-xs">{row.packetWeight.toFixed(3)}</TableCell>
                  <TableCell className="text-right text-xs">{row.netWeight.toFixed(3)}</TableCell>
                  <TableCell className="text-right text-xs">{row.wTagWt.toFixed(3)}</TableCell>
                  <TableCell className="text-xs">{row.krtPrtPct}</TableCell>
                  <TableCell className="text-xs">{row.avgPrtyPct}</TableCell>
                  <TableCell className="text-right text-xs">{row.avgRate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
