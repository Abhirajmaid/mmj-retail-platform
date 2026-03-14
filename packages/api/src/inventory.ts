import type {
  InventoryAnalyticsData,
  InventoryDashboardData,
  PurchaseOrder,
  StockMovement,
  Supplier,
} from "@jewellery-retail/types";

import { fetchJson } from "./client";
import {
  mockInventoryAnalytics,
  mockInventoryDashboard,
  mockPurchaseOrders,
  mockStockMovements,
  mockSuppliers,
} from "./mock-data";

export async function getInventoryDashboard(): Promise<InventoryDashboardData> {
  return fetchJson("/api/dashboard/inventory", mockInventoryDashboard);
}

export async function getStockMovements(): Promise<StockMovement[]> {
  return fetchJson("/api/jewellery-items?populate=product&sort=updatedAt:desc", mockStockMovements);
}

export async function getSuppliers(): Promise<Supplier[]> {
  return fetchJson("/api/suppliers?sort=updatedAt:desc", mockSuppliers);
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  return fetchJson("/api/purchase-orders?populate=supplier&sort=createdAt:desc", mockPurchaseOrders);
}

export async function getInventoryAnalytics(): Promise<InventoryAnalyticsData> {
  return fetchJson("/api/reports/inventory", mockInventoryAnalytics);
}
