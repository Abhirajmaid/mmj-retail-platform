"use client";

import { Plus, Trash2 } from "lucide-react";
import type { StoneDetail } from "@/src/types/stock";
import { createEmptyStoneDetail } from "@/src/store/stock-store";

const inputClass =
  "h-7 w-full min-w-0 rounded border border-gray-200 bg-white px-2 py-0.5 text-xs focus:ring-1 focus:ring-amber-400 outline-none";

interface StockStoneRowProps {
  stones: StoneDetail[];
  onChange: (stones: StoneDetail[]) => void;
  categoryLabel?: string;
}

export function StockStoneRow({
  stones,
  onChange,
  categoryLabel = "CATEGORY",
}: StockStoneRowProps) {
  const addRow = () => {
    onChange([...stones, createEmptyStoneDetail()]);
  };

  const removeRow = (id: string) => {
    onChange(stones.filter((s) => s.id !== id));
  };

  const updateStone = (id: string, patch: Partial<StoneDetail>) => {
    onChange(
      stones.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  if (stones.length === 0) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50/50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-amber-800">
            Stone details
          </span>
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1 rounded bg-amber-200 px-2 py-1 text-xs font-medium text-amber-900 hover:bg-amber-300"
          >
            <Plus className="h-3.5 w-3.5" /> Add stone
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-amber-200 bg-amber-50">
      <div className="flex min-w-[900px]">
        {/* Left: CATEGORY pill spanning full height (header + rows) */}
        <div className="flex shrink-0 flex-col">
          <div className="flex h-9 items-center justify-center rounded-l border-r border-amber-200 bg-amber-100 px-2">
            <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-amber-800">
              {categoryLabel}
            </span>
          </div>
          {stones.map((_, i) => (
            <div
              key={i}
              className="flex min-h-[28px] items-center border-b border-r border-amber-200 bg-white px-2 last:border-b-0"
            >
              <span className="rounded bg-amber-200/90 px-2 py-0.5 text-[10px] font-medium text-amber-900">
                Stone
              </span>
            </div>
          ))}
        </div>

        {/* Center: Header row + data rows in a table grid */}
        <div className="flex-1">
          {/* Amber header bar */}
          <div className="flex h-9 items-center gap-1 border-b border-amber-200 bg-amber-100 px-2 py-1">
            <div className="min-w-[52px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">CRYSTAL ID</div>
            <div className="min-w-[72px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">CRYSTAL NAME</div>
            <div className="min-w-[52px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">CLARITY</div>
            <div className="min-w-[52px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">COLOR</div>
            <div className="min-w-[72px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">CERTIFICATE NO</div>
            <div className="min-w-[52px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">LABORATORY</div>
            <div className="min-w-[44px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">SIZE</div>
            <div className="min-w-[44px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">SHAPE</div>
            <div className="min-w-[40px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">QTY</div>
            <div className="min-w-[44px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">GS WT</div>
            <div className="min-w-[40px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">CT</div>
            <div className="min-w-[32px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">☐</div>
            <div className="min-w-[44px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">RATE</div>
            <div className="min-w-[32px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">CT</div>
            <div className="min-w-[52px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">SELL RATE</div>
            <div className="min-w-[32px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">CT</div>
            <div className="min-w-[56px] shrink-0 text-[10px] font-semibold uppercase text-navy-800">VALUATION</div>
            <div className="ml-auto flex shrink-0">
              <button
                type="button"
                onClick={addRow}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
                aria-label="Add stone row"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Data input rows */}
          {stones.map((stone) => (
            <div
              key={stone.id}
              className="flex items-center gap-1 border-b border-amber-100 bg-white px-2 py-1.5 last:border-b-0"
            >
              <input type="text" className={`${inputClass} min-w-[52px]`} value={stone.crystalId} onChange={(e) => updateStone(stone.id, { crystalId: e.target.value })} />
              <input type="text" className={`${inputClass} min-w-[72px]`} value={stone.crystalName} onChange={(e) => updateStone(stone.id, { crystalName: e.target.value })} />
              <input type="text" className={`${inputClass} min-w-[52px]`} value={stone.clarity} onChange={(e) => updateStone(stone.id, { clarity: e.target.value })} />
              <input type="text" className={`${inputClass} min-w-[52px]`} value={stone.color} onChange={(e) => updateStone(stone.id, { color: e.target.value })} />
              <input type="text" className={`${inputClass} min-w-[72px]`} value={stone.certificateNo ?? ""} onChange={(e) => updateStone(stone.id, { certificateNo: e.target.value })} />
              <input type="text" className={`${inputClass} min-w-[52px]`} value={stone.laboratory ?? ""} onChange={(e) => updateStone(stone.id, { laboratory: e.target.value })} />
              <input type="text" className={`${inputClass} min-w-[44px]`} value={stone.size} onChange={(e) => updateStone(stone.id, { size: e.target.value })} />
              <input type="text" className={`${inputClass} min-w-[44px]`} value={stone.shape} onChange={(e) => updateStone(stone.id, { shape: e.target.value })} />
              <input type="number" className={`${inputClass} min-w-[40px]`} value={stone.qty || ""} onChange={(e) => updateStone(stone.id, { qty: Number(e.target.value) || 0 })} />
              <input type="number" className={`${inputClass} min-w-[44px]`} value={stone.gsWt || ""} onChange={(e) => updateStone(stone.id, { gsWt: Number(e.target.value) || 0 })} />
              <input type="number" className={`${inputClass} min-w-[40px]`} value={stone.ct || ""} onChange={(e) => updateStone(stone.id, { ct: Number(e.target.value) || 0 })} />
              <input type="checkbox" className="h-4 w-4 shrink-0" />
              <input type="number" className={`${inputClass} min-w-[44px]`} value={stone.rate || ""} onChange={(e) => updateStone(stone.id, { rate: Number(e.target.value) || 0 })} />
              <span className="w-8 shrink-0 text-center text-[10px] text-gray-400">CT</span>
              <input type="number" className={`${inputClass} min-w-[52px]`} value={stone.sellRate || ""} onChange={(e) => updateStone(stone.id, { sellRate: Number(e.target.value) || 0 })} />
              <span className="w-8 shrink-0 text-center text-[10px] text-gray-400">CT</span>
              <input type="number" className={`${inputClass} min-w-[56px]`} value={stone.valuation || ""} readOnly />
              <div className="ml-auto flex shrink-0 items-center gap-1">
                <button type="button" onClick={addRow} className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600" aria-label="Add stone">
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => removeRow(stone.id)} className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200" aria-label="Remove stone">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
