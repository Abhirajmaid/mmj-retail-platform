export type TrendDirection = "up" | "down" | "steady";

export interface AnalyticsPoint {
  label: string;
  value: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
  location: string;
  status: "active" | "low" | "out_of_stock";
}

export interface Order {
  id: string;
  reference: string;
  customerName: string;
  total: number;
  status: "pending" | "processing" | "completed";
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  issuedAt: string;
  dueDate: string;
  paymentMethod: string;
  items: number;
  downloadUrl?: string;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  method: "upi" | "card" | "bank" | "cash";
  status: "paid" | "pending" | "failed";
  createdAt: string;
  reference: string;
}

export interface PurchaseHistoryItem {
  id: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  status: Invoice["status"];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  segment: "VIP" | "Loyal" | "New";
  totalSpend: number;
  outstandingBalance: number;
  status: "active" | "inactive";
  lastPurchaseAt: string;
  purchaseHistory: PurchaseHistoryItem[];
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  plan: "Gold Plus" | "Diamond Care" | "Silver Save";
  monthlyAmount: number;
  billingCycle: "monthly" | "quarterly" | "yearly";
  renewsAt: string;
  status: "active" | "trial" | "past_due";
  mrr: number;
}

export type SupplierType =
  | "gold"
  | "diamond"
  | "silver"
  | "stone"
  | "other";

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  status: "active" | "pending" | "inactive";
  supplierType?: SupplierType;
  onTimeRate: number;
  openOrders: number;
  // Supplier Information
  businessRegistrationNumber?: string;
  gstNumber?: string;
  panNumber?: string;
  // Contact & Location
  alternatePhone?: string;
  website?: string;
  state?: string;
  pincode?: string;
  fullAddress?: string;
  // Bank & Payment Details
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  paymentTerms?: string;
  creditLimit?: number;
  currency?: string;
  // Performance & Catalog
  metalTypes?: string[];
  itemCategories?: string[];
  leadTimeDays?: number;
  minimumOrderValue?: number;
  notes?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  type: "inbound" | "outbound" | "transfer";
  location: string;
  status: "completed" | "pending";
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  total: number;
  status: "draft" | "approved" | "in_transit" | "received";
  expectedDate: string;
  createdAt: string;
  items: number;
}

export interface TopSellingItem {
  name: string;
  sold: number;
  revenue: number;
}

export interface BillingDashboardData {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  activeCustomers: number;
  monthlyRevenueSeries: AnalyticsPoint[];
  customerGrowthSeries: AnalyticsPoint[];
  recentTransactions: Payment[];
}

export interface BillingReportData {
  revenueSeries: AnalyticsPoint[];
  customerGrowthSeries: AnalyticsPoint[];
  planDistribution: Array<{ name: string; value: number }>;
}

export interface InventoryDashboardData {
  totalProducts: number;
  lowStockItems: number;
  stockValue: number;
  openPurchaseOrders: number;
  stockValueSeries: AnalyticsPoint[];
  recentStockUpdates: StockMovement[];
  categoryBreakdown: Array<{ name: string; value: number }>;
}

export interface InventoryAnalyticsData {
  stockValuationSeries: AnalyticsPoint[];
  topSellingItems: TopSellingItem[];
  lowInventoryAlerts: Product[];
}
