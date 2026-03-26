"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Button, Card, Input } from "@jewellery-retail/ui";
import { Search, X } from "lucide-react";

/** One item from current stock (e.g. from movements) for search list and details */
export interface StockSearchItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  type?: string;
  location?: string;
  status?: string;
  updatedAt?: string;
}

export interface ProductBarcodeSearchProps {
  /** Current stock items to search (ID, name, barcode/SKU) */
  stockItems: StockSearchItem[];
  /** Item whose full details are shown in the left panel */
  selectedItem: StockSearchItem | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
  /** Called only when user clicks GO (or presses Enter) to add the searched item to the left box */
  onSelectItem: (item: StockSearchItem) => void;
  placeholder?: string;
  /** Show hint that source/destination firms are needed to add to transfer */
  showAddHint?: boolean;
  /** Clear the current selection (cross icon) */
  onClearSelection?: () => void;
  /** Items added to transfer to show in vertical list with scroll */
  addedItems?: { prodId: string; name: string; sku: string; qty: number }[];
  /** Remove one added item from the list */
  onRemoveAddedItem?: (prodId: string) => void;
  /** All picked items (from search) to show in white box - when set, this is the main list shown */
  pickedItems?: StockSearchItem[];
  /** Remove one picked item */
  onRemovePickedItem?: (productId: string) => void;
}

const MAX_SUGGESTIONS = 10;

export function ProductBarcodeSearch({
  stockItems,
  selectedItem,
  searchValue,
  onSearchChange,
  onSelectItem,
  placeholder = "Search product ID / barcode / RFID",
  showAddHint = false,
  onClearSelection,
  addedItems = [],
  onRemoveAddedItem,
  pickedItems = [],
  onRemovePickedItem,
}: ProductBarcodeSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const pendingItemRef = useRef<StockSearchItem | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const query = searchValue.trim().toLowerCase();
  const suggestions = query
    ? stockItems.filter(
        (item) =>
          item.productId.toLowerCase().includes(query) ||
          item.productName.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query)
      ).slice(0, MAX_SUGGESTIONS)
    : [];

  useEffect(() => {
    setListOpen(Boolean(query && suggestions.length > 0));
    setHighlightIndex(0);
  }, [query, suggestions.length]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        listRef.current && !listRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setListOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Add item to left box and clear search. Only used when user clicks GO or presses Enter. */
  const handleSelect = useCallback(
    (item: StockSearchItem) => {
      onSelectItem(item);
      onSearchChange("");
      setListOpen(false);
      inputRef.current?.focus();
    },
    [onSelectItem, onSearchChange]
  );

  /** Add item to left box only when user explicitly clicks GO (or Enter). */
  const handleGo = useCallback(() => {
    const pending = pendingItemRef.current;
    if (pending) {
      pendingItemRef.current = null;
      handleSelect(pending);
      return;
    }
    if (suggestions.length > 0) {
      handleSelect(suggestions[highlightIndex] ?? suggestions[0]);
    } else if (query && stockItems.length > 0) {
      const first = stockItems.find(
        (item) =>
          item.productId.toLowerCase().includes(query) ||
          item.productName.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query)
      );
      if (first) handleSelect(first);
    }
  }, [suggestions, highlightIndex, query, stockItems, handleSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (listOpen && suggestions.length > 0) {
          handleSelect(suggestions[highlightIndex] ?? suggestions[0]);
        } else {
          handleGo();
        }
      } else if (e.key === "ArrowDown" && listOpen) {
        e.preventDefault();
        setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp" && listOpen) {
        e.preventDefault();
        setHighlightIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Escape") {
        setListOpen(false);
      }
    },
    [listOpen, suggestions, highlightIndex, handleSelect, handleGo]
  );

  return (
    <Card
      padding="none"
      className="min-h-[120px] min-w-0 rounded-2xl border-0 bg-white shadow-[0_16px_36px_-24px_rgba(15,23,42,0.45),0_8px_18px_-12px_rgba(15,23,42,0.28)]"
    >
      <div className="grid gap-3 p-4 sm:p-5">
        <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[55%_1fr]">
          {/* Left: picked items list (each with full details + cross) or single selection + added list */}
          <div className="min-w-0">
            <div className="flex min-h-[140px] max-h-[320px] flex-col gap-2 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50/30 px-3 py-3 text-sm text-zinc-800">
              {pickedItems.length > 0 ? (
                <>
                  {showAddHint && (
                    <p className="shrink-0 rounded bg-amber-50 px-2 py-1 text-xs text-amber-800">
                      Select source firm (top right) and destination (SELECT FIRM) to add this item to the transfer.
                    </p>
                  )}
                  <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                    {pickedItems.map((item) => (
                      <div
                        key={item.productId}
                        className="relative shrink-0 space-y-2 rounded-lg border border-zinc-200 bg-white p-2.5 pr-8 shadow-sm"
                      >
                        {onRemovePickedItem && (
                          <button
                            type="button"
                            onClick={() => onRemovePickedItem(item.productId)}
                            className="absolute right-1 top-1 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                            aria-label={`Remove ${item.productName}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <p className="font-semibold text-zinc-900">{item.productName}</p>
                        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                          <dt className="text-zinc-500">Product ID:</dt>
                          <dd>{item.productId}</dd>
                          <dt className="text-zinc-500">SKU:</dt>
                          <dd>{item.sku}</dd>
                          <dt className="text-zinc-500">Quantity:</dt>
                          <dd>{item.quantity}</dd>
                          {item.type != null && (
                            <>
                              <dt className="text-zinc-500">Type:</dt>
                              <dd className="capitalize">{item.type}</dd>
                            </>
                          )}
                          {item.location != null && item.location !== "" && (
                            <>
                              <dt className="text-zinc-500">Location:</dt>
                              <dd>{item.location}</dd>
                            </>
                          )}
                          {item.status != null && (
                            <>
                              <dt className="text-zinc-500">Status:</dt>
                              <dd className="capitalize">{item.status}</dd>
                            </>
                          )}
                          {item.updatedAt != null && (
                            <>
                              <dt className="text-zinc-500">Updated:</dt>
                              <dd>{new Date(item.updatedAt).toLocaleString()}</dd>
                            </>
                          )}
                        </dl>
                      </div>
                    ))}
                  </div>
                </>
              ) : selectedItem && !addedItems.some((a) => a.prodId === selectedItem.productId) ? (
                <div className="relative shrink-0 space-y-2 rounded-lg border border-zinc-200 bg-white p-2.5 pr-8 shadow-sm">
                  {onClearSelection && (
                    <button
                      type="button"
                      onClick={onClearSelection}
                      className="absolute right-1 top-1 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                      aria-label="Remove from selection"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {showAddHint && (
                    <p className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-800">
                      Select source firm (top right) and destination (SELECT FIRM) to add this item to the transfer.
                    </p>
                  )}
                  <p className="font-semibold text-zinc-900">{selectedItem.productName}</p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                    <dt className="text-zinc-500">Product ID:</dt>
                    <dd>{selectedItem.productId}</dd>
                    <dt className="text-zinc-500">SKU:</dt>
                    <dd>{selectedItem.sku}</dd>
                    <dt className="text-zinc-500">Quantity:</dt>
                    <dd>{selectedItem.quantity}</dd>
                    {selectedItem.type != null && (
                      <>
                        <dt className="text-zinc-500">Type:</dt>
                        <dd className="capitalize">{selectedItem.type}</dd>
                      </>
                    )}
                    {selectedItem.location != null && selectedItem.location !== "" && (
                      <>
                        <dt className="text-zinc-500">Location:</dt>
                        <dd>{selectedItem.location}</dd>
                      </>
                    )}
                    {selectedItem.status != null && (
                      <>
                        <dt className="text-zinc-500">Status:</dt>
                        <dd className="capitalize">{selectedItem.status}</dd>
                      </>
                    )}
                    {selectedItem.updatedAt != null && (
                      <>
                        <dt className="text-zinc-500">Updated:</dt>
                        <dd>{new Date(selectedItem.updatedAt).toLocaleString()}</dd>
                      </>
                    )}
                  </dl>
                </div>
              ) : null}
              {pickedItems.length === 0 && addedItems.length > 0 ? (
                <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto">
                  {addedItems.map((item) => (
                    <div
                      key={item.prodId}
                      className="flex items-start justify-between gap-2 rounded-lg border border-zinc-200 bg-white p-2.5 pr-8 shadow-sm"
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="font-medium text-zinc-900">{item.name}</p>
                        <p className="text-xs text-zinc-500">
                          ID: {item.prodId} · SKU: {item.sku} · Qty: {item.qty}
                        </p>
                      </div>
                      {onRemoveAddedItem && (
                        <button
                          type="button"
                          onClick={() => onRemoveAddedItem(item.prodId)}
                          className="shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
              {pickedItems.length === 0 && !selectedItem && addedItems.length === 0 && (
                <p className="text-zinc-400">
                  Selected products will appear here. Search by product ID, barcode or RFID, then click GO to add.
                </p>
              )}
            </div>
          </div>

          {/* Right: search input + dropdown list + GO */}
          <div className="relative flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => {
                  pendingItemRef.current = null;
                  onSearchChange(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white py-0 pl-10 pr-4 text-zinc-900 shadow-md placeholder:text-zinc-400 focus:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-0"
              />
              {listOpen && suggestions.length > 0 && (
                <div
                  ref={listRef}
                  className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[240px] overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
                >
                  {suggestions.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        pendingItemRef.current = item;
                        onSearchChange(item.productName);
                        setHighlightIndex(i);
                        setListOpen(false);
                      }}
                      className={`block w-full px-3 py-2.5 text-left text-sm ${
                        i === highlightIndex
                          ? "bg-amber-50 font-medium text-amber-700"
                          : "text-zinc-800 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="font-medium">{item.productName}</span>
                      <span className="ml-2 text-zinc-500">ID: {item.productId}</span>
                      {item.sku ? <span className="ml-2 text-zinc-500">SKU: {item.sku}</span> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={handleGo}
              className="h-10 shrink-0 rounded-xl bg-[#173684] px-5 text-white shadow-sm hover:bg-[#13317a]"
            >
              GO
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
