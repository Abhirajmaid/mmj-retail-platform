"use client";

import { useState } from "react";
import { ChevronDown, Gem } from "lucide-react";

import type { MetalRate } from "@/src/store/metal-rates";
import { formatCurrency } from "@jewellery-retail/utils";

function parseGmFromUnit(unit: string): number | null {
  // Expected formats like "10 gm", "1 gm", "100 gm"
  const match = unit.match(/(\d+(?:\.\d+)?)\s*gm/i);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function formatGmLabel(gm: number) {
  // Keep label stable: "1 gm", "10 gm", "100 gm"
  return `${gm} gm`;
}

function Sparkline({ data }: { data: number[] }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 48;
  const h = 24;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="text-white/70"
      />
    </svg>
  );
}

export function MetalRatesCard({ rates }: { rates: MetalRate[] }) {
  const goldBase = rates.find((r) => r.metal === "gold");
  const silverBase = rates.find((r) => r.metal === "silver");

  const goldBaseGm = goldBase ? parseGmFromUnit(goldBase.unit) ?? 10 : 10;
  const silverBaseGm = silverBase ? parseGmFromUnit(silverBase.unit) ?? 10 : 10;

  const [goldGm, setGoldGm] = useState<number>(goldBaseGm);
  const [silverGm, setSilverGm] = useState<number>(silverBaseGm);
  const [goldKarat, setGoldKarat] = useState<number>(24);

  const gmOptions = [1, 10, 100];
  const goldKaratOptions = [24, 22, 20, 18];

  return (
    <div
      className="overflow-hidden rounded-[28px] border-0 p-7 text-white shadow-[0_28px_56px_-34px_rgba(23,54,132,0.55)]"
      style={{ backgroundColor: "#173684" }}
    >
      <div className="space-y-5">
        {rates.map((r) => {
          const selectedGm = r.metal === "gold" ? goldGm : silverGm;
          const baseGm = parseGmFromUnit(r.unit) ?? 10;
          const basePerGm = r.ratePerUnit / baseGm;

          const karatFactor = r.metal === "gold" ? goldKarat / 24 : 1;
          const displayRate = basePerGm * selectedGm * karatFactor;

          return (
          <div key={r.metal} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Gem
                className={`h-5 w-5 shrink-0 ${r.metal === "gold" ? "text-amber-300" : "text-zinc-300"}`}
                aria-hidden
              />
              <span className="text-sm font-medium capitalize text-white/90">{r.metal}</span>
              <span className="text-xl font-semibold text-white">
                {formatCurrency(displayRate)} / {formatGmLabel(selectedGm)}
              </span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={selectedGm}
                    onChange={(e) =>
                      r.metal === "gold"
                        ? setGoldGm(Number(e.target.value))
                        : setSilverGm(Number(e.target.value))
                    }
                    className="h-8 appearance-none rounded-md border border-white/15 bg-transparent px-2.5 pr-7 text-xs font-medium text-white/90 outline-none transition-colors hover:border-white/25 focus:border-white/30 focus:ring-2 focus:ring-white/20"
                    aria-label={`${r.metal} grams`}
                  >
                    {gmOptions.map((gm) => (
                      <option key={gm} value={gm} className="text-zinc-900">
                        {formatGmLabel(gm)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                </div>

                {r.metal === "gold" ? (
                  <div className="relative">
                    <select
                      value={goldKarat}
                      onChange={(e) => setGoldKarat(Number(e.target.value))}
                      className="h-8 appearance-none rounded-md border border-white/15 bg-transparent px-2.5 pr-7 text-xs font-medium text-white/90 outline-none transition-colors hover:border-white/25 focus:border-white/30 focus:ring-2 focus:ring-white/20"
                      aria-label="Gold karat"
                    >
                      {goldKaratOptions.map((k) => (
                        <option key={k} value={k} className="text-zinc-900">
                          {k}k
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  r.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {r.changePercent >= 0 ? "+" : ""}
                {r.changePercent}%
              </span>
              <Sparkline data={r.sparkData} />
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
