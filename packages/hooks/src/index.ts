"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getBillingDashboard,
  getBillingReports,
  getCustomers,
  getInventoryAnalytics,
  getInventoryDashboard,
  getInvoices,
  getOrders,
  getPayments,
  getProducts,
  getPurchaseOrders,
  getStockMovements,
  getSubscriptions,
  getSuppliers,
} from "@jewellery-retail/api";

type AsyncState<T> = {
  data: T;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

function useAsyncData<T>(loader: () => Promise<T>, initialData: T): AsyncState<T> {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await loader();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh };
}

export function useProducts() {
  return useAsyncData(getProducts, []);
}

export function useOrders() {
  return useAsyncData(getOrders, []);
}

export function useInventory() {
  return useAsyncData(getInventoryDashboard, {
    totalProducts: 0,
    lowStockItems: 0,
    stockValue: 0,
    openPurchaseOrders: 0,
    stockValueSeries: [],
    recentStockUpdates: [],
    categoryBreakdown: [],
  });
}

export function useInvoices() {
  return useAsyncData(getInvoices, []);
}

export function usePayments() {
  return useAsyncData(getPayments, []);
}

export function useCustomers() {
  return useAsyncData(getCustomers, []);
}

export function useSubscriptions() {
  return useAsyncData(getSubscriptions, []);
}

export function useBillingDashboard() {
  return useAsyncData(getBillingDashboard, {
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingInvoices: 0,
    activeCustomers: 0,
    monthlyRevenueSeries: [],
    customerGrowthSeries: [],
    recentTransactions: [],
  });
}

export function useBillingReports() {
  return useAsyncData(getBillingReports, {
    revenueSeries: [],
    customerGrowthSeries: [],
    planDistribution: [],
  });
}

export function useStockMovements() {
  return useAsyncData(getStockMovements, []);
}

export function useSuppliers() {
  return useAsyncData(getSuppliers, []);
}

export function usePurchaseOrders() {
  return useAsyncData(getPurchaseOrders, []);
}

export function useInventoryAnalytics() {
  return useAsyncData(getInventoryAnalytics, {
    stockValuationSeries: [],
    topSellingItems: [],
    lowInventoryAlerts: [],
  });
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStored(value);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
          // Ignore storage errors in private mode or blocked environments.
        }
      }
    },
    [key]
  );

  return [stored, setValue];
}