"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button, PageHeader } from "@jewellery-retail/ui";
import type { StockTab } from "@/src/types/stock";
import { STOCK_TAB_LABELS } from "@/src/types/stock";
import { FineStockTab } from "@/src/components/stock/tabs/FineStockTab";
import { RawMetalStockTab } from "@/src/components/stock/tabs/RawMetalStockTab";
import { CrystalStockTab } from "@/src/components/stock/tabs/CrystalStockTab";
import { StockReportsTab } from "@/src/components/stock/tabs/StockReportsTab";
import { OtherOptionsDropdown } from "@/src/components/stock/OtherOptionsDropdown";

const ADD_STOCK_BREADCRUMBS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Stock", href: "/stock" },
  { label: "Add Stock" },
];

/** Tabs shown in the bar. All content renders on this same page. */
const ADD_STOCK_TABS: StockTab[] = ["fine", "raw_metal", "crystal", "reports"];
const TABS_WITH_DROPDOWN: StockTab[] = ["reports"];

export default function AddStockPage() {
  const [activeTab, setActiveTab] = useState<StockTab>("fine");

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        breadcrumbs={ADD_STOCK_BREADCRUMBS}
        title="Add Stock"
        description="Select stock type and fill in the details."
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-[44px] shrink-0 border-amber-200 bg-amber-50/50 text-amber-800 hover:bg-amber-100 sm:min-h-9"
          >
            <HelpCircle className="mr-1 h-4 w-4" />
            HELP
          </Button>
        }
      />

      {/* Tab bar — consistent with other stock tabs: single white card layer */}
      <div className="sticky top-0 z-20 rounded-xl bg-white px-4 py-3 shadow-md">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {ADD_STOCK_TABS.map((tab) => {
            const label = STOCK_TAB_LABELS[tab];
            const hasDropdown = TABS_WITH_DROPDOWN.includes(tab);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-amber-500 text-white shadow-lg"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
                }`}
              >
                {label}
                {hasDropdown && <span className="text-[10px] opacity-80">▾</span>}
              </button>
            );
          })}
          <OtherOptionsDropdown
            onSelect={(option) => {
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

      {/* Tab content — no single wrapper card; each tab uses card-based layout like Add Firm */}
      {activeTab === "fine" && <FineStockTab />}
      {activeTab === "raw_metal" && <RawMetalStockTab />}
      {activeTab === "crystal" && <CrystalStockTab />}
      {activeTab === "reports" && <StockReportsTab />}
    </div>
  );
}
