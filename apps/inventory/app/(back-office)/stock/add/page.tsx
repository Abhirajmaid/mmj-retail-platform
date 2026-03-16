"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@jewellery-retail/ui";
import type { StockTab } from "@/src/types/stock";
import { STOCK_TAB_LABELS } from "@/src/types/stock";
import { FineStockTab } from "@/src/components/stock/tabs/FineStockTab";
import { RawMetalStockTab } from "@/src/components/stock/tabs/RawMetalStockTab";
import { CrystalStockTab } from "@/src/components/stock/tabs/CrystalStockTab";
import { StockReportsTab } from "@/src/components/stock/tabs/StockReportsTab";
import { OtherOptionsDropdown } from "@/src/components/stock/OtherOptionsDropdown";

/** Tabs shown in the bar. All content renders on this same page. */
const ADD_STOCK_TABS: StockTab[] = ["fine", "raw_metal", "crystal", "reports"];
const TABS_WITH_DROPDOWN: StockTab[] = ["reports"];

export default function AddStockPage() {
  const [activeTab, setActiveTab] = useState<StockTab>("fine");
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, height: 0, top: 0 });

  useLayoutEffect(() => {
    const i = ADD_STOCK_TABS.indexOf(activeTab);
    const el = tabRefs.current[i];
    const bar = tabBarRef.current;
    if (!el || !bar) return;
    const barRect = bar.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillStyle({
      left: elRect.left - barRect.left,
      width: elRect.width,
      height: elRect.height,
      top: elRect.top - barRect.top,
    });
  }, [activeTab]);

  useLayoutEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const ro = new ResizeObserver(() => {
      const i = ADD_STOCK_TABS.indexOf(activeTab);
      const el = tabRefs.current[i];
      if (!el) return;
      const barRect = bar.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setPillStyle({
        left: elRect.left - barRect.left,
        width: elRect.width,
        height: elRect.height,
        top: elRect.top - barRect.top,
      });
    });
    ro.observe(bar);
    return () => ro.disconnect();
  }, [activeTab]);

  return (
    <div className="min-w-0 space-y-0">
      <nav className="mb-2 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/stock" className="hover:text-amber-600">
          Stock
        </Link>
        <span>/</span>
        <span className="text-navy-800">Add Stock</span>
      </nav>
      <PageHeader
        title="Add Stock"
        description="Select stock type and fill in the details."
      />

      {/* Tab bar: sliding capsule indicator with smooth transition */}
      <div
        className="sticky top-0 z-20 mb-4 flex w-full justify-center overflow-visible border-b border-amber-300 px-4 py-1.5 sm:rounded-lg"
        style={{ background: "#F5B800" }}
      >
        <div ref={tabBarRef} className="relative flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
          {/* Sliding pill — smooth transition to active tab */}
          <div
            className="pointer-events-none absolute rounded-full bg-white shadow-sm transition-[left,width,top,height] duration-300 ease-out"
            style={{
              left: pillStyle.left,
              top: pillStyle.top,
              width: pillStyle.width,
              height: pillStyle.height,
            }}
          />
          {ADD_STOCK_TABS.map((tab, index) => {
            const label = STOCK_TAB_LABELS[tab];
            const hasDropdown = TABS_WITH_DROPDOWN.includes(tab);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 flex min-h-10 shrink-0 items-center gap-1 rounded-full px-3 py-3 text-sm font-bold uppercase tracking-wide transition-colors sm:px-4 md:px-5 ${
                  isActive ? "text-black" : "text-black hover:bg-[#FEF3C7]"
                }`}
              >
                {label}
                {hasDropdown && <span className="text-[10px]">▾</span>}
              </button>
            );
          })}
          <OtherOptionsDropdown
            onSelect={(option) => {
              // No page navigation — wire up per-option handlers as needed
              switch (option) {
                case "STOCK SETTING":
                  break;
                case "STOCK MASTER":
                  break;
                case "STOCK TRANSFER":
                  break;
                case "DISCOUNT OPTION":
                  break;
                case "SETUP OPTION":
                  break;
                case "MULTIPLE STOCK DELETE":
                  break;
                default:
                  break;
              }
            }}
          />
        </div>
      </div>

      <div className="min-w-0 rounded-xl border border-zinc-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)] sm:p-6">
        {activeTab === "fine" && <FineStockTab />}
        {activeTab === "raw_metal" && <RawMetalStockTab />}
        {activeTab === "crystal" && <CrystalStockTab />}
        {activeTab === "reports" && <StockReportsTab />}
      </div>
    </div>
  );
}
