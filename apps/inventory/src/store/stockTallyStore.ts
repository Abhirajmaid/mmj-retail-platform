"use client";

import { create } from "zustand";
import type { StockTallyItem, StockTallyMode } from "@/src/types/stockTally";

interface StockTallyStore {
  mode: StockTallyMode;
  sessionOpen: boolean;
  manually: boolean;
  counterName: string;
  locationName: string;
  categoryFilter: string;
  /** All items currently in "available" pool (before tally). Filtered by category when set. */
  availableItems: StockTallyItem[];
  /** IDs of items that have been tallied/scanned (moved to right panel). */
  scannedIds: Set<string>;
  /** For RFID/Multi Barcode: raw tags entered (textarea). */
  tagsInput: string;
  /** For Images/Tables: filter values */
  filterCategory: string;
  filterItemName: string;
  filterItemId: string;
  itemsPerPage: number;

  setMode: (mode: StockTallyMode) => void;
  setSessionOpen: (open: boolean) => void;
  setManually: (v: boolean) => void;
  setCounterName: (v: string) => void;
  setLocationName: (v: string) => void;
  setCategoryFilter: (v: string) => void;
  setTagsInput: (v: string) => void;
  setFilterCategory: (v: string) => void;
  setFilterItemName: (v: string) => void;
  setFilterItemId: (v: string) => void;
  setItemsPerPage: (n: number) => void;
  openStock: () => void;
  closeStock: () => void;
  reset: () => void;
  /** Move item from available to scanned (by id). */
  markAsScanned: (id: string) => void;
  /** Remove item from scanned back to available. */
  unmarkScanned: (id: string) => void;
  /** Process tags from textarea: move matching items to scanned. */
  processTags: (tags: string[]) => void;
  setAvailableItems: (items: StockTallyItem[]) => void;
}

const defaultItems: StockTallyItem[] = [
  {
    id: "1",
    productId: "P001",
    name: "Gold Ring Classic",
    category: "Ring",
    metalType: "Gold",
    qty: 1,
    grossWeight: 5.2,
    netWeight: 5.0,
    fineWeight: 4.6,
    fineFineWeight: 4.2,
    imageUrl: null,
    barcodeOrTag: "RF001",
  },
  {
    id: "2",
    productId: "P002",
    name: "Chain 22K",
    category: "Chain",
    metalType: "Gold",
    qty: 1,
    grossWeight: 12.5,
    netWeight: 12.2,
    fineWeight: 11.2,
    fineFineWeight: 10.8,
    imageUrl: null,
    barcodeOrTag: "RF002",
  },
  {
    id: "3",
    productId: "P003",
    name: "Sahajew Pendant",
    category: "Sahajew",
    metalType: "Gold",
    qty: 1,
    grossWeight: 3.8,
    netWeight: 3.6,
    fineWeight: 3.3,
    barcodeOrTag: "BC003",
  },
  {
    id: "4",
    productId: "P004",
    name: "Test Ring",
    category: "Testring",
    metalType: "Gold",
    qty: 1,
    grossWeight: 4.1,
    netWeight: 4.0,
    fineWeight: 3.68,
    barcodeOrTag: "BC004",
  },
  {
    id: "5",
    productId: "P005",
    name: "Tops Earring",
    category: "Tops",
    metalType: "Gold",
    qty: 1,
    grossWeight: 2.2,
    netWeight: 2.0,
    fineWeight: 1.84,
    barcodeOrTag: "BC005",
  },
];

function getInitialState() {
  return {
    mode: "rfid" as StockTallyMode,
    sessionOpen: false,
    manually: true,
    counterName: "",
    locationName: "",
    categoryFilter: "",
    availableItems: [...defaultItems],
    scannedIds: new Set<string>(),
    tagsInput: "",
    filterCategory: "",
    filterItemName: "",
    filterItemId: "",
    itemsPerPage: 30,
  };
}

export const useStockTallyStore = create<StockTallyStore>((set, get) => ({
  ...getInitialState(),

  setMode: (mode) => set({ mode }),
  setSessionOpen: (sessionOpen) => set({ sessionOpen }),
  setManually: (manually) => set({ manually }),
  setCounterName: (counterName) => set({ counterName }),
  setLocationName: (locationName) => set({ locationName }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setTagsInput: (tagsInput) => set({ tagsInput }),
  setFilterCategory: (filterCategory) => set({ filterCategory }),
  setFilterItemName: (filterItemName) => set({ filterItemName }),
  setFilterItemId: (filterItemId) => set({ filterItemId }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
  setAvailableItems: (availableItems) => set({ availableItems }),

  openStock: () => set({ sessionOpen: true }),
  closeStock: () => set({ sessionOpen: false }),

  reset: () =>
    set({
      tagsInput: "",
      scannedIds: new Set<string>(),
      availableItems: [...defaultItems],
    }),

  markAsScanned: (id) =>
    set((s) => {
      const next = new Set(s.scannedIds);
      next.add(id);
      return { scannedIds: next };
    }),

  unmarkScanned: (id) =>
    set((s) => {
      const next = new Set(s.scannedIds);
      next.delete(id);
      return { scannedIds: next };
    }),

  processTags: (tags) => {
    const items = get().availableItems;
    const byTag = new Map<string, StockTallyItem>();
    items.forEach((i) => {
      if (i.barcodeOrTag) byTag.set(i.barcodeOrTag.trim().toUpperCase(), i);
    });
    set((s) => {
      const next = new Set(s.scannedIds);
      tags.forEach((t) => {
        const key = t.trim().toUpperCase();
        if (!key) return;
        const item = byTag.get(key);
        if (item) next.add(item.id);
      });
      return { scannedIds: next };
    });
  },
}));
