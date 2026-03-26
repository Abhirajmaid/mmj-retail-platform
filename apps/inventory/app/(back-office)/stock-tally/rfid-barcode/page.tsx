"use client";

import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Label,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import {
  CheckCircle2,
  ClipboardList,
  Download,
  ChevronDown,
  Filter,
  Layers,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { useStockTallyStore } from "@/src/store/stockTallyStore";
import { ReminderTab } from "@/src/components/stock-tally/ReminderTab";
import { STOCK_TALLY_CATEGORIES } from "@/src/types/stockTally";
import type { StockTallyMode } from "@/src/types/stockTally";

/** Item category dropdown: native select (matches add-stock/supplier dropdown UX) */
function CategoryDropdown({
  value,
  onChange,
  placeholder = "Chain, Ring, Sahajew...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]"
    >
      <option value="">{placeholder}</option>
      {STOCK_TALLY_CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}

/** Bottom tally cards (AVAILABLE / TALLY): clean, consistent Card UI */
const tallyShellClass =
  "flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35),0_10px_24px_-18px_rgba(15,23,42,0.22)]";

function TallyColumnShell({
  label,
  totalLine,
  weightLine,
  footerLabel,
  dotClass,
  icon: Icon,
  iconWrapClass,
  iconClass,
  children,
}: {
  label: string;
  totalLine: string;
  weightLine?: string | null;
  footerLabel: string;
  dotClass: string;
  icon: LucideIcon;
  iconWrapClass: string;
  iconClass: string;
  // `@jewellery-retail/ui` uses a separate React type surface; keep children permissive.
  children: any;
}) {
  return (
    <Card padding="none" className={tallyShellClass}>
      <CardHeader className="mb-0 border-b border-zinc-100 bg-gradient-to-b from-zinc-50/80 to-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
            <p className="text-3xl font-black tracking-tight text-zinc-900">{totalLine}</p>
            {weightLine != null && weightLine !== "" && (
              <p className="text-sm text-zinc-600">{weightLine}</p>
            )}
            <div className="flex items-center gap-2 pt-1">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} aria-hidden />
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{footerLabel}</p>
            </div>
          </div>
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border shadow-sm ${iconWrapClass}`}
          >
            <Icon className={`h-7 w-7 ${iconClass}`} />
          </div>
        </div>
      </CardHeader>
      <CardBody className="min-h-0 flex-1 overflow-y-auto bg-zinc-50/30 p-3 sm:p-4">
        {children}
      </CardBody>
    </Card>
  );
}

const MODES: { key: StockTallyMode; label: string }[] = [
  { key: "images", label: "TALLY WITH IMAGES" },
  { key: "tables", label: "TALLY WITH TABLES" },
  { key: "rfid", label: "STOCK TALLY WITH RFID" },
  { key: "multi-barcode", label: "STOCK TALLY WITH MULTI BARCODE" },
];

export default function StockTallyRfidBarcodePage() {
  const mode = useStockTallyStore((s) => s.mode);
  const setMode = useStockTallyStore((s) => s.setMode);
  const sessionOpen = useStockTallyStore((s) => s.sessionOpen);
  const manually = useStockTallyStore((s) => s.manually);
  const setManually = useStockTallyStore((s) => s.setManually);
  const counterName = useStockTallyStore((s) => s.counterName);
  const setCounterName = useStockTallyStore((s) => s.setCounterName);
  const locationName = useStockTallyStore((s) => s.locationName);
  const setLocationName = useStockTallyStore((s) => s.setLocationName);
  const categoryFilter = useStockTallyStore((s) => s.categoryFilter);
  const setCategoryFilter = useStockTallyStore((s) => s.setCategoryFilter);
  const tagsInput = useStockTallyStore((s) => s.tagsInput);
  const setTagsInput = useStockTallyStore((s) => s.setTagsInput);
  const openStock = useStockTallyStore((s) => s.openStock);
  const closeStock = useStockTallyStore((s) => s.closeStock);
  const reset = useStockTallyStore((s) => s.reset);
  const availableItems = useStockTallyStore((s) => s.availableItems);
  const scannedIds = useStockTallyStore((s) => s.scannedIds);
  const markAsScanned = useStockTallyStore((s) => s.markAsScanned);
  const unmarkScanned = useStockTallyStore((s) => s.unmarkScanned);
  const filterCategory = useStockTallyStore((s) => s.filterCategory);
  const setFilterCategory = useStockTallyStore((s) => s.setFilterCategory);
  const filterItemName = useStockTallyStore((s) => s.filterItemName);
  const setFilterItemName = useStockTallyStore((s) => s.setFilterItemName);
  const filterItemId = useStockTallyStore((s) => s.filterItemId);
  const setFilterItemId = useStockTallyStore((s) => s.setFilterItemId);
  const itemsPerPage = useStockTallyStore((s) => s.itemsPerPage);
  const setItemsPerPage = useStockTallyStore((s) => s.setItemsPerPage);

  // Apply category filter to available list for RFID/Multi Barcode
  // For Images/Tables: filter by category, name, id
  const filteredForImagesTables = useMemo(() => {
    let list = availableItems.filter((i) => !scannedIds.has(i.id));
    if (filterCategory.trim()) {
      list = list.filter(
        (i) =>
          i.category.toLowerCase().includes(filterCategory.trim().toLowerCase())
      );
    }
    if (filterItemName.trim()) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(filterItemName.trim().toLowerCase())
      );
    }
    if (filterItemId.trim()) {
      list = list.filter(
        (i) =>
          i.productId.toLowerCase().includes(filterItemId.trim().toLowerCase())
      );
    }
    return list;
  }, [
    availableItems,
    scannedIds,
    filterCategory,
    filterItemName,
    filterItemId,
  ]);

  const talliedForImagesTables = useMemo(
    () => availableItems.filter((i) => scannedIds.has(i.id)),
    [availableItems, scannedIds]
  );

  // For RFID/Multi Barcode: derive scanned set from tags in textarea (live as user types)
  const scannedIdsFromTags = useMemo(() => {
    if (mode !== "rfid" && mode !== "multi-barcode") return new Set<string>();
    const lines = tagsInput
      .split(/[\n,]+/)
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);
    const byTag = new Map<string, string>();
    availableItems.forEach((i) => {
      if (i.barcodeOrTag) byTag.set(i.barcodeOrTag.trim().toUpperCase(), i.id);
    });
    const ids = new Set<string>();
    lines.forEach((t) => {
      const id = byTag.get(t);
      if (id) ids.add(id);
    });
    return ids;
  }, [mode, tagsInput, availableItems]);

  // RFID/Multi-barcode UI should react to BOTH:
  // 1) typed tags in the textarea (`scannedIdsFromTags`)
  // 2) manual clicking cards (`scannedIds` from store)
  const effectiveScannedIds =
    mode === "rfid" || mode === "multi-barcode"
      ? new Set<string>([...scannedIdsFromTags, ...scannedIds])
      : scannedIds;

  const scannedItemsEffective = useMemo(
    () => availableItems.filter((i) => effectiveScannedIds.has(i.id)),
    [availableItems, effectiveScannedIds]
  );
  const filteredAvailableEffective = useMemo(
    () =>
      availableItems.filter(
        (i) =>
          !effectiveScannedIds.has(i.id) &&
          (!categoryFilter.trim() ||
            i.category.toLowerCase() === categoryFilter.trim().toLowerCase())
      ),
    [availableItems, effectiveScannedIds, categoryFilter]
  );

  const availableTotal = filteredAvailableEffective.length;
  const totalWeight = availableItems.reduce(
    (a, i) => a + i.grossWeight * i.qty,
    0
  );
  const availableWeight = filteredAvailableEffective.reduce(
    (a, i) => a + i.grossWeight * i.qty,
    0
  );
  const scannedTotal = scannedItemsEffective.length;
  const scannedWeight = scannedItemsEffective.reduce(
    (a, i) => a + i.grossWeight * i.qty,
    0
  );

  const isRfidOrBarcode = mode === "rfid" || mode === "multi-barcode";
  const isImages = mode === "images";
  const isTables = mode === "tables";

  return (
    <div className="relative min-w-0 max-w-full space-y-4 sm:space-y-6">
      <ReminderTab />

      <PageHeader
        title="RFID / Barcode stock tally"
        description="Reconcile physical stock with RFID, multi-barcode, images, or tables — same patterns as Stock and Firm."
      />

      {/* Mode options — matches `stock/add` active options tab bar */}
      <div className="sticky top-0 z-20 rounded-xl border border-zinc-100 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {MODES.map((m) => {
            const isActive = mode === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 space-y-4 sm:space-y-6">
        {/* Top control section — frosted panel like StockKPIs / FirmKPIs */}
        <Card
          padding="none"
          className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: toggle, open/close, counter, location, category */}
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold text-zinc-700">Manually</Label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={manually}
                    onClick={() => setManually(!manually)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      manually ? "bg-[#173684]" : "bg-[#173684]/20"
                    }`}
                  >
                    <span
                      className={`absolute top-[2px] h-5 w-5 rounded-full bg-white shadow transition ${
                        manually ? "left-6" : "left-0.5"
                      }`}
                    >
                      <span
                        className={`flex h-full w-full items-center justify-center text-[10px] font-bold leading-none ${
                          manually ? "text-white" : "text-[#1E3A8A]"
                        }`}
                      >
                        {manually ? "I" : "O"}
                      </span>
                    </span>
                  </button>
                </div>
                <Button
                  variant="outline"
                  onClick={openStock}
                  className="h-10 rounded-xl border-zinc-200 px-4 text-zinc-700 hover:bg-zinc-50"
                >
                  Open stock
                </Button>
                <Button
                  variant="outline"
                  onClick={closeStock}
                  className="h-10 rounded-xl border-zinc-200 px-4 text-zinc-700 hover:bg-zinc-50"
                >
                  Close stock
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">
                    Counter Name
                  </label>
                  <Input
                    type="text"
                    className="h-10 rounded-xl border border-zinc-200 bg-white px-3 py-0 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
                    value={counterName}
                    onChange={(e) => setCounterName(e.target.value)}
                    placeholder="Counter"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">
                    Location Name
                  </label>
                  <Input
                    type="text"
                    className="h-10 rounded-xl border border-zinc-200 bg-white px-3 py-0 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Location"
                  />
                </div>
              </div>
              {isRfidOrBarcode && (
                <div>
                  <Label className="mb-1 block text-xs font-medium text-zinc-600">
                    Item category
                  </Label>
                  <CategoryDropdown
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    placeholder="Chain, Ring, Sahajew..."
                  />
                </div>
              )}
              {(isImages || isTables) && (
                <>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div>
                      <Label className="mb-1 block text-xs font-medium text-zinc-600">
                        Enter Item Category
                      </Label>
                      <CategoryDropdown
                        value={filterCategory}
                        onChange={setFilterCategory}
                        placeholder="Select category..."
                      />
                    </div>
                    <div>
                      <Label className="mb-1 block text-xs font-medium text-zinc-600">
                        Enter Item Name
                      </Label>
                      <Input
                        type="text"
                        className="h-10 rounded-xl border border-zinc-200 bg-white px-3 py-0 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
                        value={filterItemName}
                        onChange={(e) => setFilterItemName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="mb-1 block text-xs font-medium text-zinc-600">
                        Enter Item Id
                      </Label>
                      <Input
                        type="text"
                        className="h-10 rounded-xl border border-zinc-200 bg-white px-3 py-0 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
                        value={filterItemId}
                        onChange={(e) => setFilterItemId(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right: textarea (RFID/Barcode) or filters (Images/Tables), RESET, REPORT */}
            <div className="flex flex-shrink-0 flex-col gap-2 lg:w-80">
              {isRfidOrBarcode && (
                <>
                  <Label className="text-xs font-medium text-zinc-600">
                    {mode === "rfid"
                      ? "Enter RFID Tags"
                      : "Enter Multi Barcode Tags"}
                  </Label>
                  <textarea
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    rows={6}
                    // Match the active border/ring styling of other fields (Counter/Location inputs).
                    className="min-h-[44px] w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
                    placeholder={
                      mode === "rfid"
                        ? "One tag per line"
                        : "One per line or comma separated"
                    }
                  />
                </>
              )}
              {(isImages || isTables) && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={itemsPerPage}
                      onChange={(e) =>
                        setItemsPerPage(Number(e.target.value) || 30)
                      }
                      className="h-10 w-16 rounded-xl border border-zinc-200 bg-white px-2 text-sm text-zinc-700 shadow-sm focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-md hover:bg-zinc-50"
                      title="Refresh"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="h-10 flex-1 rounded-xl bg-[#173684] text-white shadow-sm hover:bg-[#13317a]"
                  onClick={reset}
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  className="h-10 flex-1 rounded-xl bg-[#173684] text-white shadow-sm hover:bg-[#13317a]"
                  onClick={() => {}}
                >
                  Report
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom split panel */}
        <div className="grid min-h-[320px] grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {/* AVAILABLE / NON TALLY */}
          <TallyColumnShell
            label={
              isRfidOrBarcode
                ? "Available"
                : `Non tally stock (${filteredForImagesTables.length})`
            }
            totalLine={`Total: ${isRfidOrBarcode ? availableTotal : filteredForImagesTables.length}`}
            weightLine={
              isRfidOrBarcode
                ? `Wt: ${availableWeight.toFixed(2)} / ${totalWeight.toFixed(2)}`
                : null
            }
            footerLabel={isRfidOrBarcode ? "Available stock" : "Awaiting tally"}
            dotClass={isRfidOrBarcode ? "bg-blue-500" : "bg-amber-500"}
            icon={isRfidOrBarcode ? Package : Layers}
            iconWrapClass={
              isRfidOrBarcode
                ? "border-blue-200 bg-blue-50"
                : "border-amber-200 bg-amber-50"
            }
            iconClass={isRfidOrBarcode ? "text-blue-600" : "text-amber-600"}
          >
            <div className="space-y-3">
              {isImages && (
                <div className="grid grid-cols-2 gap-3">
                  {filteredForImagesTables.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => markAsScanned(item.id)}
                      className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md hover:bg-amber-50/30 focus-visible:outline-none"
                    >
                      <div className="h-16 w-full rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          "No image"
                        )}
                      </div>
                      <div className="min-w-0 w-full">
                        <p className="font-bold text-zinc-900 truncate">{item.category}</p>
                        <p className="text-xs text-zinc-700 truncate">{item.name}</p>
                        <p className="text-xs text-zinc-500">{item.productId}</p>
                        <p className="text-xs text-zinc-600">
                          Gross: {item.grossWeight}g Net: {item.netWeight}g
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {isTables && (
                <TallyTablesPanel
                  items={filteredForImagesTables}
                  onAdd={(id) => {
                    const item = filteredForImagesTables.find((i) => i.id === id);
                    markAsScanned(id);
                  }}
                  side="non-tally"
                />
              )}
              {isRfidOrBarcode && (
                <>
                  {filteredAvailableEffective.length === 0 ? (
                    <div className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-8 text-center shadow-sm">
                      <p className="text-sm font-medium text-zinc-600">No available lines</p>
                      <p className="mt-1 max-w-xs text-xs text-zinc-500">
                        Adjust category filter or enter tags on the right to move items to scanned.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {filteredAvailableEffective.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => markAsScanned(item.id)}
                      className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md hover:bg-amber-50/30 focus-visible:outline-none"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-zinc-900 truncate">{item.productId}</p>
                            <span className="shrink-0 font-mono text-xs text-zinc-400">
                              {item.barcodeOrTag ?? "—"}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-700 truncate">{item.name}</p>
                          <p className="text-xs text-zinc-500">Wt: {item.grossWeight}g</p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </TallyColumnShell>

          {/* SCANNED / TALLY */}
          <TallyColumnShell
            label={
              isRfidOrBarcode
                ? "Scanned"
                : `Tally stock (${talliedForImagesTables.length})`
            }
            totalLine={`Total: ${isRfidOrBarcode ? scannedTotal : talliedForImagesTables.length}`}
            weightLine={
              isRfidOrBarcode
                ? `Wt: ${scannedWeight.toFixed(2)} / ${totalWeight.toFixed(2)}`
                : null
            }
            footerLabel={isRfidOrBarcode ? "Scanned stock" : "Counted"}
            dotClass="bg-emerald-500"
            icon={isRfidOrBarcode ? CheckCircle2 : ClipboardList}
            iconWrapClass="border-emerald-200 bg-emerald-50"
            iconClass="text-emerald-600"
          >
            <div className="space-y-3">
              {isImages && (
                <div className="grid grid-cols-2 gap-3">
                  {talliedForImagesTables.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => unmarkScanned(item.id)}
                      className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-white p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md hover:bg-red-50/30 focus-visible:outline-none"
                    >
                      <div className="h-16 w-full rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          "No image"
                        )}
                      </div>
                      <div className="min-w-0 w-full">
                        <p className="font-bold text-zinc-900 truncate">{item.category}</p>
                        <p className="text-xs text-zinc-700 truncate">{item.name}</p>
                        <p className="text-xs text-zinc-500">{item.productId}</p>
                        <p className="text-xs text-zinc-600">
                          Gross: {item.grossWeight}g Net: {item.netWeight}g
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {isTables && (
                <TallyTablesPanel
                  items={talliedForImagesTables}
                  onAdd={() => {}}
                  onRemove={(id) => {
                    unmarkScanned(id);
                  }}
                  side="tally"
                />
              )}
              {isRfidOrBarcode && (
                <>
                  {scannedItemsEffective.length === 0 ? (
                    <div className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-8 text-center shadow-sm">
                      <p className="text-sm font-medium text-zinc-600">Nothing scanned yet</p>
                      <p className="mt-1 max-w-xs text-xs text-zinc-500">
                        Paste or type RFID / barcode tags in the panel above to match lines here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {scannedItemsEffective.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => unmarkScanned(item.id)}
                      className="flex flex-col gap-1 rounded-xl border border-emerald-200 bg-white p-3 shadow-sm text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md hover:bg-red-50/30 focus-visible:outline-none"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-zinc-900 truncate">{item.productId}</p>
                            <span className="shrink-0 font-mono text-xs text-zinc-400">
                              {item.barcodeOrTag ?? "—"}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-700 truncate">{item.name}</p>
                          <p className="text-xs text-zinc-500">Wt: {item.grossWeight}g</p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </TallyColumnShell>
        </div>
      </div>
    </div>
  );
}

function TallyTablesPanel({
  items,
  onAdd,
  onRemove,
  side,
}: {
  items: Array<{
    id: string;
    productId: string;
    name: string;
    category: string;
    metalType: string;
    qty: number;
    grossWeight: number;
    netWeight: number;
    fineWeight: number;
    fineFineWeight?: number;
  }>;
  onAdd: (id: string) => void;
  onRemove?: (id: string) => void;
  side: "non-tally" | "tally";
}) {
  const [globalSearch, setGlobalSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = [...items];
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      list = list.filter(
        (r) =>
          r.productId.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, globalSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (filterRef.current && !filterRef.current.contains(target)) setFilterOpen(false);
      if (exportRef.current && !exportRef.current.contains(target)) setExportOpen(false);
      if (actionsRef.current && !actionsRef.current.contains(target)) setActionsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, r) => ({
          qty: acc.qty + r.qty,
          grossWeight: acc.grossWeight + r.grossWeight,
          netWeight: acc.netWeight + r.netWeight,
          fineWeight: acc.fineWeight + r.fineWeight,
        }),
        { qty: 0, grossWeight: 0, netWeight: 0, fineWeight: 0 }
      ),
    [filtered]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const start = (page - 1) * rowsPerPage;
  const paginated = filtered.slice(start, start + rowsPerPage);
  const COLS = [
    { key: "productId", label: "PRODUCT ID" },
    { key: "metalType", label: "METAL TYPE" },
    { key: "category", label: "CATEGORY" },
    { key: "name", label: "PRODUCT NAME" },
    { key: "qty", label: "QTY" },
    { key: "grossWeight", label: "GS WT" },
    { key: "netWeight", label: "NT WT" },
    { key: "fineWeight", label: "FN WT" },
  ];

  const rowPerPageOptions = [10, 25, 50];

  type ExportFormat = "copy" | "csv" | "excel" | "json" | "pdf" | "print";
  const exportFormats: ExportFormat[] = ["copy", "csv", "excel", "json", "pdf", "print"];

  // Toolbar input styling (matches StockTransfer list/search input family).
  const tableToolbarInputClass =
    "h-10 rounded-xl border border-zinc-200 bg-white py-0 pl-10 pr-4 text-sm text-zinc-900 shadow-md placeholder:text-zinc-400 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0";

  const exportRows = useMemo(() => {
    return filtered.map((row) => ({
      productId: row.productId,
      metalType: row.metalType,
      category: row.category,
      name: row.name,
      qty: row.qty,
      grossWeight: row.grossWeight,
      netWeight: row.netWeight,
      fineWeight: row.fineWeight,
    }));
  }, [filtered]);

  const getCsvText = useCallback(() => {
    const header = ["PRODUCT ID", "METAL TYPE", "CATEGORY", "PRODUCT NAME", "QTY", "GS WT", "NT WT", "FN WT"];
    const csvRows = exportRows.map((r) =>
      [r.productId, r.metalType, r.category, r.name, r.qty, r.grossWeight, r.netWeight, r.fineWeight]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    return [header.join(","), ...csvRows].join("\n");
  }, [exportRows]);

  const downloadFile = useCallback((content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (exportRows.length === 0) {
        setExportOpen(false);
        return;
      }

      if (format === "copy") {
        await navigator.clipboard.writeText(getCsvText());
      } else if (format === "csv") {
        downloadFile(getCsvText(), "stock-tally.csv", "text/csv;charset=utf-8;");
      } else if (format === "excel") {
        downloadFile(getCsvText(), "stock-tally.xls", "application/vnd.ms-excel");
      } else if (format === "json") {
        downloadFile(JSON.stringify(exportRows, null, 2), "stock-tally.json", "application/json");
      } else if (format === "pdf" || format === "print") {
        window.print();
      }

      setExportOpen(false);
    },
    [downloadFile, exportRows, getCsvText]
  );

  return (
    <div className="space-y-3">
      {/* Toolbar bar — matches suppliers secondary bar style */}
      <div className="overflow-x-auto rounded-xl border border-zinc-100 bg-white px-3 py-3 shadow-md">
        <div className="flex min-w-max items-center gap-2">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search..."
              className={tableToolbarInputClass + " w-[170px] sm:w-[240px]"}
            />
          </div>

          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-md backdrop-blur-sm hover:bg-zinc-50"
              aria-label="Filter"
            >
              <Filter className="h-4 w-4" />
            </button>

            {filterOpen && (
              <div className="absolute left-0 top-full z-30 mt-2 min-w-[180px] rounded-xl border border-zinc-200 bg-white p-3 shadow-lg">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Show entries</p>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                    setFilterOpen(false);
                  }}
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700"
                >
                  {rowPerPageOptions.map((n) => (
                    <option key={n} value={n}>
                      {n} entries
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="relative" ref={actionsRef}>
            <button
              type="button"
              onClick={() => setActionsOpen((v) => !v)}
              className="flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white/90 px-3 text-sm font-medium text-zinc-700 shadow-md backdrop-blur-sm hover:bg-zinc-50"
            >
              Actions
              <ChevronDown className={`h-4 w-4 transition-transform ${actionsOpen ? "rotate-180" : ""}`} />
            </button>

            {actionsOpen && (
              <div className="absolute right-0 top-full z-30 mt-1 min-w-[220px] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
                {["Column Visibility", "Print Selected"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="block w-full border-l-4 border-l-transparent px-4 py-2.5 text-left text-sm font-bold uppercase tracking-wide text-zinc-900 hover:border-l-amber-500 hover:bg-amber-50"
                    onClick={() => {
                      if (label === "Print Selected") window.print();
                      setActionsOpen(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={exportRef}>
            <button
              type="button"
              onClick={() => setExportOpen((v) => !v)}
              className="flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm font-medium text-zinc-700 shadow-md backdrop-blur-sm transition-colors hover:bg-zinc-50"
            >
              <Download className="h-4 w-4" />
              Export
              <ChevronDown className={`h-4 w-4 transition-transform ${exportOpen ? "rotate-180" : ""}`} />
            </button>

            {exportOpen && (
              <div className="absolute right-0 top-full z-30 mt-1 min-w-[190px] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {[
                  { key: "copy" as const, label: "Copy" },
                  { key: "csv" as const, label: "CSV" },
                  { key: "excel" as const, label: "Excel" },
                  { key: "json" as const, label: "JSON" },
                  { key: "pdf" as const, label: "PDF" },
                  { key: "print" as const, label: "Print" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => void handleExport(item.key)}
                    className="block w-full border-l-4 border-l-transparent px-4 py-2.5 text-left text-sm font-bold uppercase tracking-wide text-zinc-900 hover:border-l-amber-500 hover:bg-amber-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-w-0 w-full overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
          <Table className="min-w-[900px] table-fixed">
            <TableHead>
              <TableRow>
                {(side === "non-tally" || side === "tally") && (
                  <TableHeader className="w-[8%] min-w-0 py-2 text-left">ACTION</TableHeader>
                )}
                <TableHeader className="w-[15%] min-w-0 py-2 text-left">PRODUCT ID</TableHeader>
                <TableHeader className="w-[12%] min-w-0 py-2 text-left">METAL TYPE</TableHeader>
                <TableHeader className="w-[12%] min-w-0 py-2 text-left">CATEGORY</TableHeader>
                <TableHeader className="w-[21%] min-w-0 py-2 text-left">PRODUCT NAME</TableHeader>
                <TableHeader className="w-[8%] min-w-0 py-2 text-right">QTY</TableHeader>
                <TableHeader className="w-[8%] min-w-0 py-2 text-right">GS WT</TableHeader>
                <TableHeader className="w-[8%] min-w-0 py-2 text-right">NT WT</TableHeader>
                <TableHeader className="w-[8%] min-w-0 py-2 text-right">FN WT</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length > 0 && (
                <TableRow className="border-b border-zinc-100 bg-zinc-50/60">
                  {(side === "non-tally" || side === "tally") && <TableCell />}
                  <TableCell colSpan={4} className="py-2 text-right text-xs font-semibold text-red-500" />
                  <TableCell className="py-2 text-right text-xs font-semibold text-red-500">
                    {totals.qty.toFixed(3)}
                  </TableCell>
                  <TableCell className="py-2 text-right text-xs font-semibold text-red-500">
                    {totals.grossWeight.toFixed(3)}
                  </TableCell>
                  <TableCell className="py-2 text-right text-xs font-semibold text-red-500">
                    {totals.netWeight.toFixed(3)}
                  </TableCell>
                  <TableCell className="py-2 text-right text-xs font-semibold text-red-500">
                    {totals.fineWeight.toFixed(3)}
                  </TableCell>
                </TableRow>
              )}
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLS.length + (side !== "tally" ? 0 : 1) + (side === "non-tally" ? 1 : 0)}
                    className="py-4 text-center text-zinc-500 text-xs"
                  >
                    No records
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((row) => (
                  <TableRow key={row.id} className="border-b border-zinc-100 bg-white">
                    {side === "non-tally" && (
                      <TableCell className="py-2">
                        <Button
                          type="button"
                          onClick={() => onAdd(row.id)}
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-md text-emerald-600 hover:bg-emerald-100"
                          title="Add to tally"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                    {side === "tally" && (
                      <TableCell className="py-2">
                        <Button
                          type="button"
                          onClick={() => onRemove?.(row.id)}
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-md text-red-500 hover:bg-red-50"
                          title="Remove from tally"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.productId}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.metalType}</TableCell>
                    <TableCell className="py-2 text-left text-sm text-zinc-700">{row.category}</TableCell>
                    <TableCell className="py-2 text-left text-sm font-medium text-zinc-900">{row.name}</TableCell>
                    <TableCell className="py-2 text-right text-sm font-medium text-zinc-900">{row.qty}</TableCell>
                    <TableCell className="py-2 text-right text-sm text-zinc-700">{row.grossWeight.toFixed(3)}</TableCell>
                    <TableCell className="py-2 text-right text-sm text-zinc-700">{row.netWeight.toFixed(3)}</TableCell>
                    <TableCell className="py-2 text-right text-sm text-zinc-700">{row.fineWeight.toFixed(3)}</TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
          </Table>
      </div>
      <p className="text-xs text-zinc-500">
        Showing {filtered.length === 0 ? 0 : start + 1} to{" "}
        {Math.min(start + rowsPerPage, filtered.length)} of {filtered.length} entries
        {items.length !== filtered.length ? ` (filtered from ${items.length} total)` : ""}.
      </p>
      <p className="text-xs text-zinc-400">
        Use the toolbar search above the table to filter records.
      </p>
    </div>
  );
}
