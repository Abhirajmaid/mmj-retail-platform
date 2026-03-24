"use client";

import type { LucideIcon } from "lucide-react";
import { useMemo, useState, useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";
import {
  Button,
  Card,
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
  ChevronDown,
  Layers,
  Package,
  Plus,
  RotateCcw,
} from "lucide-react";
import { useStockTallyStore } from "@/src/store/stockTallyStore";
import { ReminderTab } from "@/src/components/stock-tally/ReminderTab";
import { STOCK_TALLY_CATEGORIES } from "@/src/types/stockTally";
import type { StockTallyMode } from "@/src/types/stockTally";

/** Item category dropdown: input + white panel list, matches app dropdown pattern */
function CategoryDropdown({
  value,
  onChange,
  placeholder = "Chain, Ring, Sahajew...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [...STOCK_TALLY_CATEGORIES];
    return STOCK_TALLY_CATEGORIES.filter((c) =>
      c.toLowerCase().includes(q)
    );
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full" ref={ref}>
      <div className="flex min-h-[36px] w-full items-center rounded-lg border border-slate-200 bg-transparent shadow-sm focus-within:border-slate-300 focus-within:ring-1 focus-within:ring-slate-200">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full flex-1 rounded-lg border-0 bg-transparent px-2 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-0"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((o) => !o)}
          className="shrink-0 px-2 py-1.5 text-zinc-500 hover:bg-transparent hover:text-zinc-700"
          aria-label="Toggle list"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 max-h-60 min-w-[200px] overflow-y-auto rounded-lg border border-slate-200 bg-white/95 py-1 shadow-lg backdrop-blur-sm">
          {filtered.length === 0 ? (
            <div className="px-4 py-2 text-sm text-zinc-500">No match</div>
          ) : (
            filtered.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2.5 text-left text-sm font-medium ${
                  value === c ? "bg-[#1E3A8A]/10 text-[#1E3A8A]" : "bg-transparent text-zinc-900 hover:bg-[#1E3A8A]/5"
                }`}
              >
                {c}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/** Matches FirmKPIs / StockKPIs frosted card + icon treatment */
const tallyShellClass =
  "flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-white/70 to-white/40 shadow-xl backdrop-blur-xl";

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
  children: ReactNode;
}) {
  return (
    <Card padding="none" className={tallyShellClass}>
      <div className="border-b border-zinc-100/80 p-4 sm:p-5">
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
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border shadow-md backdrop-blur-sm ${iconWrapClass}`}
          >
            <Icon className={`h-7 w-7 ${iconClass}`} />
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-zinc-50/50 p-3 sm:p-4">{children}</div>
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

  const effectiveScannedIds =
    mode === "rfid" || mode === "multi-barcode" ? scannedIdsFromTags : scannedIds;

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
        actions={
          <div className="flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1">
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold uppercase transition sm:min-h-9 ${
                  mode === m.key
                    ? "bg-amber-500 text-white shadow-sm hover:bg-amber-600"
                    : "border-2 border-slate-200 border-l-4 border-l-amber-500 bg-white text-zinc-900 hover:bg-amber-50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        }
      />

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
                  <span className="text-sm font-medium text-zinc-700">
                    MANUALLY
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={manually}
                    onClick={() => setManually(!manually)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      manually ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        manually ? "left-6" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
                <Button
                  size="sm"
                  className="min-h-[44px] bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 sm:min-h-9"
                  onClick={openStock}
                >
                  OPEN STOCK
                </Button>
                <Button
                  size="sm"
                  className="min-h-[44px] bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 sm:min-h-9"
                  onClick={closeStock}
                >
                  CLOSE STOCK
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">
                    Counter Name
                  </label>
                  <input
                    type="text"
                    value={counterName}
                    onChange={(e) => setCounterName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm shadow-sm"
                    placeholder="Counter Name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm shadow-sm"
                    placeholder="Location Name"
                  />
                </div>
              </div>
              {isRfidOrBarcode && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-600">
                    Item category
                  </label>
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
                      <label className="mb-1 block text-xs font-medium text-zinc-600">
                        Enter Item Category
                      </label>
                      <CategoryDropdown
                        value={filterCategory}
                        onChange={setFilterCategory}
                        placeholder="Select category..."
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-600">
                        Enter Item Name
                      </label>
                      <input
                        type="text"
                        value={filterItemName}
                        onChange={(e) => setFilterItemName(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-600">
                        Enter Item Id
                      </label>
                      <input
                        type="text"
                        value={filterItemId}
                        onChange={(e) => setFilterItemId(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm shadow-sm"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right: textarea (RFID/Barcode) or filters (Images/Tables), BACK, RESET, REPORT */}
            <div className="flex flex-shrink-0 flex-col gap-2 lg:w-80">
              {isRfidOrBarcode && (
                <>
                  <label className="text-xs font-medium text-zinc-600">
                    {mode === "rfid"
                      ? "Enter RFID Tags"
                      : "Enter Multi Barcode Tags"}
                  </label>
                  <textarea
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm shadow-sm"
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
                      className="w-16 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm shadow-sm"
                    />
                    <button
                      type="button"
                      className="rounded border border-slate-200 bg-white p-1.5 text-zinc-600 hover:bg-slate-50"
                      title="Refresh"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/stock-tally"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#1E3A8A] px-3 py-2 text-sm font-medium text-white hover:bg-[#1E3A8A]/90 sm:min-h-9"
                >
                  BACK
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-[44px] flex-1 rounded-lg border-amber-200 text-amber-700 hover:bg-amber-50 sm:min-h-9"
                  onClick={reset}
                >
                  RESET
                </Button>
                <Button
                  size="sm"
                  className="min-h-[44px] flex-1 bg-amber-500 text-white hover:bg-amber-600 sm:min-h-9"
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {filteredForImagesTables.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => markAsScanned(item.id)}
                      className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50/80"
                    >
                      <div className="h-16 w-16 shrink-0 rounded bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-full w-full rounded object-cover"
                          />
                        ) : (
                          "No image"
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-zinc-900">{item.category}</p>
                        <p className="text-sm text-zinc-700">{item.name}</p>
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
                  onAdd={markAsScanned}
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
                    <div className="space-y-3">
                      {filteredAvailableEffective.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-zinc-900">{item.productId}</p>
                            <p className="text-sm text-zinc-700">{item.name}</p>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              Wt: {item.grossWeight}g
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-xs text-zinc-500">
                            {item.barcodeOrTag ?? "—"}
                          </span>
                        </div>
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {talliedForImagesTables.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => unmarkScanned(item.id)}
                      className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50/80"
                    >
                      <div className="h-16 w-16 shrink-0 rounded bg-slate-200 flex items-center justify-center text-slate-400 text-xs">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-full w-full rounded object-cover"
                          />
                        ) : (
                          "No image"
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-zinc-900">{item.category}</p>
                        <p className="text-sm text-zinc-700">{item.name}</p>
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
                    <div className="space-y-3">
                      {scannedItemsEffective.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm ring-1 ring-emerald-100/60"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-zinc-900">{item.productId}</p>
                            <p className="text-sm text-zinc-700">{item.name}</p>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              Wt: {item.grossWeight}g
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-xs text-zinc-500">
                            {item.barcodeOrTag ?? "—"}
                          </span>
                        </div>
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

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          placeholder="Search..."
          className="h-8 w-32 rounded border border-slate-200 px-2 text-xs"
        />
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
          className="h-8 rounded border border-slate-200 px-2 text-xs"
        >
          {[10, 25, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        {["Copy", "CSV", "Excel", "JSON", "PDF", "Print", "Column Visibility", "Print Selected"].map(
          (l) => (
            <button
              key={l}
              type="button"
              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-slate-50"
            >
              {l}
            </button>
          )
        )}
      </div>
      <div className="overflow-x-auto rounded border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              {side === "non-tally" && (
                <TableHead className="w-10 text-xs font-bold uppercase">+</TableHead>
              )}
              {COLS.map((c) => (
                <TableHead key={c.key} className="text-xs font-bold uppercase">
                  {c.label}
                </TableHead>
              ))}
            </TableRow>
            <TableRow className="bg-white">
              {side === "non-tally" && <TableHead className="p-1" />}
              {COLS.map((c) => (
                <TableHead key={c.key} className="p-1">
                  <input
                    type="text"
                    placeholder="Search"
                    value={columnFilters[c.key] ?? ""}
                    onChange={(e) =>
                      setColumnFilters((prev) => ({ ...prev, [c.key]: e.target.value }))
                    }
                    className="h-6 w-full rounded border border-slate-200 px-1 text-xs"
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 && (
              <TableRow className="bg-red-50/50">
                {side === "non-tally" && <TableCell className="text-red-500" />}
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
                  colSpan={COLS.length + (side === "non-tally" ? 1 : 0)}
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
                      <button
                        type="button"
                        onClick={() => onAdd(row.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded text-emerald-600 hover:bg-emerald-100"
                        title="Add to tally"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
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
      <p className="text-xs text-zinc-500">
        Showing {filtered.length === 0 ? 0 : start + 1} to{" "}
        {Math.min(start + rowsPerPage, filtered.length)} of {filtered.length} entries
        {items.length !== filtered.length ? ` (filtered from ${items.length} total)` : ""}.
      </p>
      <p className="text-xs text-zinc-400">
        Use column search row above. Multiple terms can be combined with pipe (|).
      </p>
    </div>
  );
}
