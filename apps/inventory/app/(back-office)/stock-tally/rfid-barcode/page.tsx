"use client";

import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
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
  Layers,
  Minus,
  Package,
  Plus,
  RotateCcw,
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

// Matches the `stock/add` tab input styling (see `FineStockTab`)
const stockAddInputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";

/** Bottom tally cards (AVAILABLE / TALLY): clean, consistent Card UI */
const tallyShellClass =
  "flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-zinc-100/60";

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
      <CardHeader className="mb-0 border-b border-zinc-100/80 p-4 sm:p-5">
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
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border shadow-none ${iconWrapClass}`}
          >
            <Icon className={`h-7 w-7 ${iconClass}`} />
          </div>
        </div>
      </CardHeader>
      <CardBody className="min-h-0 flex-1 overflow-y-auto bg-white p-3 sm:p-4">
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
          className="rounded-2xl border border-white/30 bg-gradient-to-br from-white/70 to-white/40 p-4 shadow-xl backdrop-blur-xl sm:p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: toggle, open/close, counter, location, category */}
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-zinc-700">MANUALLY</Label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={manually}
                    onClick={() => setManually(!manually)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      manually ? "bg-[#1E3A8A]" : "bg-[#1E3A8A]/20"
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
                >
                  OPEN STOCK
                </Button>
                <Button
                  variant="outline"
                  onClick={closeStock}
                >
                  CLOSE STOCK
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">
                    Counter Name
                  </label>
                  <input
                    type="text"
                    className={stockAddInputClass}
                    value={counterName}
                    onChange={(e) => setCounterName(e.target.value)}
                    placeholder="Counter"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">
                    Location Name
                  </label>
                  <input
                    type="text"
                    className={stockAddInputClass}
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
                      <input
                        type="text"
                        className={stockAddInputClass}
                        value={filterItemName}
                        onChange={(e) => setFilterItemName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="mb-1 block text-xs font-medium text-zinc-600">
                        Enter Item Id
                      </Label>
                      <input
                        type="text"
                        className={stockAddInputClass}
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
                    className={`${stockAddInputClass} shadow-none`}
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
                      className={`${stockAddInputClass} w-16 px-2 py-1.5`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded border border-slate-200 bg-white text-zinc-600 hover:bg-slate-50"
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
                  className="min-h-[44px] flex-1 rounded-lg bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 sm:min-h-9"
                  onClick={reset}
                >
                  RESET
                </Button>
                <Button
                  size="sm"
                  className="min-h-[44px] flex-1 bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 sm:min-h-9"
                  onClick={() => {}}
                >
                  REPORT
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
                      className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-sm transition hover:border-amber-300 hover:bg-amber-50/40 focus-visible:outline-none"
                    >
                      <div className="h-16 w-full rounded bg-slate-200 flex items-center justify-center text-slate-400 text-xs overflow-hidden">
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
                    <div className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white/80 px-4 py-8 text-center">
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
                      className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm text-left transition hover:border-amber-300 hover:bg-amber-50/40 focus-visible:outline-none"
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
                      className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-white p-3 text-left shadow-sm transition hover:border-red-300 hover:bg-red-50/40 focus-visible:outline-none"
                    >
                      <div className="h-16 w-full rounded bg-slate-200 flex items-center justify-center text-slate-400 text-xs overflow-hidden">
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
                    <div className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white/80 px-4 py-8 text-center">
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
                      className="flex flex-col gap-1 rounded-xl border border-emerald-200 bg-white p-3 shadow-sm text-left transition hover:border-red-300 hover:bg-red-50/40 focus-visible:outline-none"
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
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [globalSearch, setGlobalSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

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
    ["productId", "metalType", "category", "name"].forEach((col) => {
      const v = columnFilters[col];
      if (v?.trim()) {
        const q = v.toLowerCase();
        list = list.filter((r) => {
          const val = String((r as Record<string, unknown>)[col] ?? "").toLowerCase();
          return val.includes(q);
        });
      }
    });
    return list;
  }, [items, globalSearch, columnFilters]);

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

  // Matches the supplier detail page "value box" styling (min-h 44, rounded-lg, border-gray-200).
  const tableSearchInputClass =
    "min-h-[44px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400 focus:outline-none focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-0 focus-visible:outline-none";

  // Override the shared <Input /> focus-visible styling (it uses `ring-primary`, which is blue).
  // For this page's toolbar search, we keep the focus highlight but force it to be amber.
  const tableToolbarInputClass =
    "h-8 w-40 rounded-md border border-slate-200 bg-white px-2 text-xs text-zinc-900 shadow-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400 focus:outline-none focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-0 focus-visible:outline-none";

  const ACTIONS = ["Copy", "CSV", "Excel", "JSON", "PDF", "Print", "Column Visibility", "Print Selected"];

  return (
    <div className="space-y-3">
      {/* Toolbar bar — matches suppliers secondary bar style */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-100 bg-white px-4 py-3 shadow-md">
        {/* Left: search + rows per page */}
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="search"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search..."
            className={tableToolbarInputClass}
          />
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs shadow-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400 focus:outline-none focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-none"
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Right: actions select — same style as CategorySelect in this file */}
        <select
          defaultValue=""
          onChange={() => {}}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none min-h-[44px]"
        >
          <option value="">Actions</option>
          {ACTIONS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="rounded border border-slate-200 bg-white">
        {/* Column filters in a responsive horizontal grid (matches suppliers detail layout) */}
        <div className="p-4">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COLS.map((c) => (
              <div key={c.key}>
                <label className="mb-1 block text-xs font-medium text-zinc-900">{c.label}</label>
                <Input
                  type="text"
                  placeholder="Search"
                  value={columnFilters[c.key] ?? ""}
                  onChange={(e) => setColumnFilters((prev) => ({ ...prev, [c.key]: e.target.value }))}
                  className={tableSearchInputClass}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableBody>
              {filtered.length > 0 && (
                <TableRow className="bg-red-50/50">
                  {(side === "non-tally" || side === "tally") && <TableCell />}
                  <TableCell colSpan={4} className="text-right text-xs font-semibold text-red-500" />
                  <TableCell className="text-right text-xs font-semibold text-red-500">
                    {totals.qty.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold text-red-500">
                    {totals.grossWeight.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold text-red-500">
                    {totals.netWeight.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold text-red-500">
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
                  <TableRow key={row.id} className="border-b border-slate-100 hover:bg-amber-50/40">
                    {side === "non-tally" && (
                      <TableCell className="p-1">
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
                      <TableCell className="p-1">
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
                    <TableCell className="text-xs">{row.productId}</TableCell>
                    <TableCell className="text-xs">{row.metalType}</TableCell>
                    <TableCell className="text-xs">{row.category}</TableCell>
                    <TableCell className="text-xs">{row.name}</TableCell>
                    <TableCell className="text-right text-xs">{row.qty}</TableCell>
                    <TableCell className="text-right text-xs">{row.grossWeight.toFixed(3)}</TableCell>
                    <TableCell className="text-right text-xs">{row.netWeight.toFixed(3)}</TableCell>
                    <TableCell className="text-right text-xs">{row.fineWeight.toFixed(3)}</TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
          </Table>
        </div>
      </div>
      <p className="text-xs text-zinc-500">
        Showing {filtered.length === 0 ? 0 : start + 1} to{" "}
        {Math.min(start + rowsPerPage, filtered.length)} of {filtered.length} entries
        {items.length !== filtered.length ? ` (filtered from ${items.length} total)` : ""}.
      </p>
      <p className="text-xs text-zinc-400">
        Use the column search filters above the table. Multiple terms can be combined with pipe (|).
      </p>
    </div>
  );
}
