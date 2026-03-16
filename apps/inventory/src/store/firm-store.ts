import { create } from "zustand";
import type { Firm } from "@/src/types/firm";
import * as firmsApi from "@/src/lib/api/firms";

const MAX_FIRMS_LOCAL = 2;

function newId(): string {
  return crypto.randomUUID?.() ?? `firm-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function now(): string {
  return new Date().toISOString();
}

interface FirmState {
  firms: Firm[];
  loading: boolean;
  error: string | null;
  /** Fetch list from API and set firms. Clears error on success. */
  fetchFirms: () => Promise<void>;
  addFirm: (firm: Omit<Firm, "id" | "createdAt" | "updatedAt">) => Promise<Firm | null>;
  updateFirm: (id: string, data: Partial<Firm>) => Promise<void>;
  deleteFirm: (id: string) => Promise<boolean>;
  setFirms: (firms: Firm[]) => void;
  getFirmById: (id: string) => Firm | undefined;
  /** Fetch a single firm by id (e.g. for edit page). Updates store if found. */
  fetchFirmById: (id: string) => Promise<Firm | null>;
  canAddFirm: () => boolean;
  clearError: () => void;
}

export const useFirmStore = create<FirmState>((set, get) => ({
  firms: [],
  loading: false,
  error: null,

  fetchFirms: async () => {
    set({ loading: true, error: null });
    const { data, error } = await firmsApi.fetchFirms();
    set({
      firms: data ?? [],
      loading: false,
      error: error ?? null,
    });
  },

  addFirm: async (payload) => {
    set({ error: null });
    const { data, error } = await firmsApi.createFirm(payload);
    if (data) {
      set((s) => ({ firms: [data, ...s.firms], error: null }));
      return data;
    }
    if (error) {
      set((s) => ({ error: error }));
    }
    const firms = get().firms;
    if (firms.length < MAX_FIRMS_LOCAL) {
      const firm: Firm = {
        ...payload,
        id: newId(),
        createdAt: now(),
        updatedAt: now(),
      };
      set((s) => ({ firms: [firm, ...s.firms] }));
      return firm;
    }
    return null;
  },

  updateFirm: async (id, data) => {
    set({ error: null });
    const { data: updated, error } = await firmsApi.updateFirm(id, data);
    if (updated) {
      set((s) => ({
        firms: s.firms.map((f) => (f.id === id ? { ...f, ...updated } : f)),
        error: null,
      }));
      return;
    }
    if (error) set((s) => ({ error: error }));
    else {
      set((s) => ({
        firms: s.firms.map((f) =>
          f.id === id ? { ...f, ...data, updatedAt: now() } : f
        ),
      }));
    }
  },

  deleteFirm: async (id) => {
    set({ error: null });
    const { error } = await firmsApi.deleteFirm(id);
    if (!error) {
      set((s) => ({ firms: s.firms.filter((f) => f.id !== id) }));
      return true;
    }
    set((s) => ({ error: error }));
    return false;
  },

  setFirms: (firms) => set({ firms }),

  getFirmById: (id) => get().firms.find((f) => f.id === id),

  fetchFirmById: async (id) => {
    const { data, error } = await firmsApi.fetchFirm(id);
    if (data) {
      set((s) => {
        const exists = s.firms.some((f) => f.id === id);
        const firms = exists
          ? s.firms.map((f) => (f.id === id ? data : f))
          : [data, ...s.firms];
        return { firms, error: null };
      });
      return data;
    }
    if (error) set((s) => ({ error: error }));
    return null;
  },

  canAddFirm: () => get().firms.length < MAX_FIRMS_LOCAL,

  clearError: () => set({ error: null }),
}));
