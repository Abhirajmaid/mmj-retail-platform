import { create } from "zustand";
import type { Firm } from "@/src/types/firm";

const MAX_FIRMS = 2;

function newId(): string {
  return crypto.randomUUID?.() ?? `firm-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function now(): string {
  return new Date().toISOString();
}

interface FirmState {
  firms: Firm[];
  addFirm: (firm: Omit<Firm, "id" | "createdAt" | "updatedAt">) => Firm | null;
  updateFirm: (id: string, data: Partial<Firm>) => void;
  deleteFirm: (id: string) => void;
  setFirms: (firms: Firm[]) => void;
  getFirmById: (id: string) => Firm | undefined;
  canAddFirm: () => boolean;
}

export const useFirmStore = create<FirmState>((set, get) => ({
  firms: [],

  addFirm: (data) => {
    if (get().firms.length >= MAX_FIRMS) return null;
    const firm: Firm = {
      ...data,
      id: newId(),
      createdAt: now(),
      updatedAt: now(),
    };
    set((s) => ({ firms: [...s.firms, firm] }));
    return firm;
  },

  updateFirm: (id, data) => {
    set((s) => ({
      firms: s.firms.map((f) =>
        f.id === id ? { ...f, ...data, updatedAt: now() } : f
      ),
    }));
  },

  deleteFirm: (id) => {
    set((s) => ({ firms: s.firms.filter((f) => f.id !== id) }));
  },

  setFirms: (firms) => set({ firms }),

  getFirmById: (id) => get().firms.find((f) => f.id === id),

  canAddFirm: () => get().firms.length < MAX_FIRMS,
}));
