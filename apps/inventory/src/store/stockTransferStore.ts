"use client";

import { create } from "zustand";
import type { StockTransfer, StockTransferItem, TransferStatus } from "@/src/types/stockTransfer";

function newId(): string {
  return crypto.randomUUID?.() ?? `st-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function now(): string {
  return new Date().toISOString();
}

interface StockTransferStore {
  transfers: StockTransfer[];
  /** Current context firm (top bar): which firm's content we're viewing. Source firm for transfer. */
  viewingFirmId: string | null;
  /** Destination firm for transfer (SELECT FIRM in options row). */
  activeFirm: string | null;
  activeCounter: string | null;
  activeStaff: string | null;
  voucherNumber: number;
  /** History log: { transferId, action, by, at } */
  history: Array<{ transferId: string; action: string; by: string; at: string }>;

  setViewingFirmId: (firmId: string | null) => void;
  setActiveFirm: (firm: string | null) => void;
  setActiveCounter: (counter: string | null) => void;
  setActiveStaff: (staff: string | null) => void;
  addTransfer: (transfer: Omit<StockTransfer, "id">) => StockTransfer;
  updateTransfer: (id: string, patch: Partial<StockTransfer>) => void;
  approveTransfer: (id: string, approvedBy: string) => void;
  receiveTransfer: (id: string, receivedBy: string) => void;
  returnTransfer: (id: string) => void;
  deleteTransfer: (id: string) => void;
  deleteTransferItem: (transferId: string, prodId: string) => void;
  getNextVoucherNumber: (prefix: string) => number;
  getPendingApprovals: () => StockTransfer[];
  getApproved: () => StockTransfer[];
  getReturnList: () => StockTransfer[];
  getByStatus: (status: TransferStatus) => StockTransfer[];
  addHistory: (transferId: string, action: string, by: string) => void;
}

export const useStockTransferStore = create<StockTransferStore>((set, get) => ({
  transfers: [],
  viewingFirmId: null,
  activeFirm: null,
  activeCounter: null,
  activeStaff: null,
  voucherNumber: 1,
  history: [],

  setViewingFirmId: (firmId) => set({ viewingFirmId: firmId }),
  setActiveFirm: (firm) => set({ activeFirm: firm }),

  setActiveCounter: (counter) => set({ activeCounter: counter }),

  setActiveStaff: (staff) => set({ activeStaff: staff }),

  addTransfer: (transfer) => {
    const id = newId();
    const created: StockTransfer = {
      ...transfer,
      id,
      createdAt: now(),
    };
    set((s) => ({ transfers: [created, ...s.transfers] }));
    get().addHistory(id, "CREATED", "System");
    return created;
  },

  updateTransfer: (id, patch) => {
    set((s) => ({
      transfers: s.transfers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  },

  approveTransfer: (id, approvedBy) => {
    const at = now();
    set((s) => ({
      transfers: s.transfers.map((t) =>
        t.id === id
          ? { ...t, status: "STOCK_APPROVED" as const, approvedAt: at, approvedBy }
          : t
      ),
    }));
    get().addHistory(id, "APPROVED", approvedBy);
  },

  receiveTransfer: (id, receivedBy) => {
    const at = now();
    set((s) => ({
      transfers: s.transfers.map((t) =>
        t.id === id ? { ...t, receivedAt: at, receivedBy } : t
      ),
    }));
    get().addHistory(id, "RECEIVED", receivedBy);
  },

  returnTransfer: (id) => {
    set((s) => ({
      transfers: s.transfers.map((t) =>
        t.id === id ? { ...t, status: "RETURN" as const } : t
      ),
    }));
    get().addHistory(id, "RETURN", "System");
  },

  deleteTransfer: (id) => {
    set((s) => ({ transfers: s.transfers.filter((t) => t.id !== id) }));
  },

  deleteTransferItem: (transferId, prodId) => {
    set((s) => ({
      transfers: s.transfers.map((t) =>
        t.id === transferId
          ? {
              ...t,
              items: t.items.filter((it) => it.prodId !== prodId),
            }
          : t
      ),
    }));
  },

  getNextVoucherNumber: (prefix) => {
    const { transfers, activeFirm } = get();
    const max = transfers
      .filter((t) => t.voucherPrefix === prefix)
      .reduce((acc, t) => Math.max(acc, t.voucherNumber), 0);
    return max + 1;
  },

  getPendingApprovals: () =>
    get().transfers.filter((t) => t.status === "APPROVAL_PENDING"),

  getApproved: () =>
    get().transfers.filter((t) => t.status === "STOCK_APPROVED" && !t.receivedAt),

  getReturnList: () =>
    get().transfers.filter((t) => t.status === "RETURN"),

  getByStatus: (status) =>
    get().transfers.filter((t) => t.status === status),

  addHistory: (transferId, action, by) => {
    set((s) => ({
      history: [
        ...s.history,
        { transferId, action, by, at: now() },
      ],
    }));
  },
}));
