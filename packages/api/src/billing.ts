import type {
  BillingDashboardData,
  BillingReportData,
  Customer,
  Invoice,
  Payment,
  Subscription,
} from "@jewellery-retail/types";

import { fetchJson } from "./client";
import {
  mockBillingDashboard,
  mockBillingReports,
  mockCustomers,
  mockInvoices,
  mockPayments,
  mockSubscriptions,
} from "./mock-data";

export async function getBillingDashboard(): Promise<BillingDashboardData> {
  return fetchJson("/api/dashboard/billing", mockBillingDashboard);
}

export async function getInvoices(): Promise<Invoice[]> {
  return fetchJson("/api/sales?populate=customer&sort=createdAt:desc", mockInvoices);
}

export async function getPayments(): Promise<Payment[]> {
  return fetchJson("/api/payments?populate=customer,sale&sort=createdAt:desc", mockPayments);
}

export async function getCustomers(): Promise<Customer[]> {
  return fetchJson("/api/customers?populate=sales&sort=updatedAt:desc", mockCustomers);
}

export async function getSubscriptions(): Promise<Subscription[]> {
  return fetchJson("/api/subscriptions?populate=customer&sort=updatedAt:desc", mockSubscriptions);
}

export async function getBillingReports(): Promise<BillingReportData> {
  return fetchJson("/api/reports/billing", mockBillingReports);
}
