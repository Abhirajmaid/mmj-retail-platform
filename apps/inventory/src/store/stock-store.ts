import { create } from "zustand";
import type { FineStockEntry, RawMetalEntry, CrystalEntry, StoneDetail } from "@/src/types/stock";

function newId(): string {
  return crypto.randomUUID?.() ?? `stock-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// —— Fine / Imitation stock slice ——
interface FineStockState {
  pendingEntries: FineStockEntry[];
  confirmedEntries: FineStockEntry[];
  addPending: (entry: Omit<FineStockEntry, "id" | "status">) => FineStockEntry;
  confirmEntry: (id: string) => void;
  deletePending: (id: string) => void;
}

export const useFineStockStore = create<FineStockState>((set) => ({
  pendingEntries: [],
  confirmedEntries: [],

  addPending: (entry) => {
    const newEntry: FineStockEntry = {
      ...entry,
      id: newId(),
      status: "pending_review",
    };
    set((s) => ({ pendingEntries: [...s.pendingEntries, newEntry] }));
    return newEntry;
  },

  confirmEntry: (id) => {
    set((s) => {
      const entry = s.pendingEntries.find((e) => e.id === id);
      if (!entry) return s;
      const updated = { ...entry, status: "added" as const };
      return {
        pendingEntries: s.pendingEntries.filter((e) => e.id !== id),
        confirmedEntries: [...s.confirmedEntries, updated],
      };
    });
  },

  deletePending: (id) => {
    set((s) => ({ pendingEntries: s.pendingEntries.filter((e) => e.id !== id) }));
  },
}));

// —— Raw metal slice ——
interface RawMetalState {
  pendingEntries: RawMetalEntry[];
  confirmedEntries: RawMetalEntry[];
  addPending: (entry: Omit<RawMetalEntry, "id" | "status">) => RawMetalEntry;
  confirmEntry: (id: string) => void;
  deletePending: (id: string) => void;
}

export const useRawMetalStore = create<RawMetalState>((set) => ({
  pendingEntries: [],
  confirmedEntries: [],

  addPending: (entry) => {
    const newEntry: RawMetalEntry = {
      ...entry,
      id: newId(),
      status: "pending_review",
    };
    set((s) => ({ pendingEntries: [...s.pendingEntries, newEntry] }));
    return newEntry;
  },

  confirmEntry: (id) => {
    set((s) => {
      const entry = s.pendingEntries.find((e) => e.id === id);
      if (!entry) return s;
      const updated = { ...entry, status: "added" as const };
      return {
        pendingEntries: s.pendingEntries.filter((e) => e.id !== id),
        confirmedEntries: [...s.confirmedEntries, updated],
      };
    });
  },

  deletePending: (id) => {
    set((s) => ({ pendingEntries: s.pendingEntries.filter((e) => e.id !== id) }));
  },
}));

// —— Crystal slice ——
interface CrystalState {
  pendingEntries: CrystalEntry[];
  confirmedEntries: CrystalEntry[];
  addPending: (entry: Omit<CrystalEntry, "id" | "status">) => CrystalEntry;
  confirmEntry: (id: string) => void;
  deletePending: (id: string) => void;
}

export const useCrystalStore = create<CrystalState>((set) => ({
  pendingEntries: [],
  confirmedEntries: [],

  addPending: (entry) => {
    const newEntry: CrystalEntry = {
      ...entry,
      id: newId(),
      status: "pending_review",
    };
    set((s) => ({ pendingEntries: [...s.pendingEntries, newEntry] }));
    return newEntry;
  },

  confirmEntry: (id) => {
    set((s) => {
      const entry = s.pendingEntries.find((e) => e.id === id);
      if (!entry) return s;
      const updated = { ...entry, status: "added" as const };
      return {
        pendingEntries: s.pendingEntries.filter((e) => e.id !== id),
        confirmedEntries: [...s.confirmedEntries, updated],
      };
    });
  },

  deletePending: (id) => {
    set((s) => ({ pendingEntries: s.pendingEntries.filter((e) => e.id !== id) }));
  },
}));

// Helper to create a new stone detail row
export function createEmptyStoneDetail(): StoneDetail {
  return {
    id: newId(),
    crystalId: "",
    crystalName: "",
    clarity: "",
    color: "",
    size: "",
    shape: "",
    qty: 0,
    gsWt: 0,
    ct: 0,
    rate: 0,
    sellRate: 0,
    valuation: 0,
  };
}
