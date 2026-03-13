import { AxiosInstance } from 'axios';

export interface DateRangeFilter {
  storeId?: number;
  from: string;   // ISO date string YYYY-MM-DD
  to: string;     // ISO date string YYYY-MM-DD
}

export interface SalesAnalyticsResult {
  totalSales: number;
  totalRevenue: number;
  totalGst: number;
  cashCollected: number;
  pendingAmount: number;
  topCategories: { name: string; count: number; revenue: number }[];
}

/**
 * Aggregate sales analytics for a store over a date range.
 */
export async function salesAnalytics(
  filter: DateRangeFilter,
  strapiClient: AxiosInstance
): Promise<SalesAnalyticsResult> {
  const storeFilter = filter.storeId
    ? `&filters[store][id][$eq]=${filter.storeId}`
    : '';

  const response = await strapiClient.get(
    `/api/sales?filters[date][$gte]=${filter.from}&filters[date][$lte]=${filter.to}${storeFilter}&populate=payments,sale_items.jewellery_item.product.category&pagination[limit]=1000`
  );

  const sales: any[] = response.data?.data ?? [];

  let totalRevenue = 0;
  let totalGst = 0;
  let cashCollected = 0;
  let pendingAmount = 0;
  const categoryMap = new Map<string, { count: number; revenue: number }>();

  for (const sale of sales) {
    const attr = sale.attributes ?? {};
    totalRevenue += attr.total_amount ?? 0;
    totalGst += attr.gst_amount ?? 0;

    const payments: any[] = attr.payments?.data ?? [];
    const paid = payments.reduce((s: number, p: any) => s + (p.attributes?.amount ?? 0), 0);
    cashCollected += paid;
    if (attr.payment_status !== 'paid') {
      pendingAmount += (attr.total_amount ?? 0) - paid;
    }

    const saleItems: any[] = attr.sale_items?.data ?? [];
    for (const si of saleItems) {
      const catName: string =
        si.attributes?.jewellery_item?.data?.attributes?.product?.data?.attributes?.category?.data?.attributes?.name ??
        'Uncategorized';
      const entry = categoryMap.get(catName) ?? { count: 0, revenue: 0 };
      entry.count += 1;
      entry.revenue += si.attributes?.final_price ?? 0;
      categoryMap.set(catName, entry);
    }
  }

  const topCategories = Array.from(categoryMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return {
    totalSales: sales.length,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalGst: parseFloat(totalGst.toFixed(2)),
    cashCollected: parseFloat(cashCollected.toFixed(2)),
    pendingAmount: parseFloat(pendingAmount.toFixed(2)),
    topCategories,
  };
}

export interface StockAnalyticsResult {
  totalItems: number;
  availableItems: number;
  soldItems: number;
  repairItems: number;
  manufacturingItems: number;
  totalStockValue: number;
  byCategory: { name: string; count: number; weight: number }[];
}

/**
 * Aggregate current stock analytics for a store.
 */
export async function stockAnalytics(
  storeId: number | undefined,
  strapiClient: AxiosInstance
): Promise<StockAnalyticsResult> {
  const storeFilter = storeId ? `&filters[store][id][$eq]=${storeId}` : '';

  const response = await strapiClient.get(
    `/api/jewellery-items?populate=product.category${storeFilter}&pagination[limit]=5000`
  );

  const items: any[] = response.data?.data ?? [];

  let totalStockValue = 0;
  let availableItems = 0;
  let soldItems = 0;
  let repairItems = 0;
  let manufacturingItems = 0;
  const categoryMap = new Map<string, { count: number; weight: number }>();

  for (const item of items) {
    const attr = item.attributes ?? {};
    const status: string = attr.status ?? 'available';

    if (status === 'available') availableItems++;
    else if (status === 'sold') soldItems++;
    else if (status === 'repair') repairItems++;
    else if (status === 'manufacturing') manufacturingItems++;

    totalStockValue += attr.making_charges ?? 0;

    const catName: string =
      attr.product?.data?.attributes?.category?.data?.attributes?.name ?? 'Uncategorized';
    const entry = categoryMap.get(catName) ?? { count: 0, weight: 0 };
    entry.count += 1;
    entry.weight += attr.gross_weight ?? 0;
    categoryMap.set(catName, entry);
  }

  const byCategory = Array.from(categoryMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);

  return {
    totalItems: items.length,
    availableItems,
    soldItems,
    repairItems,
    manufacturingItems,
    totalStockValue: parseFloat(totalStockValue.toFixed(2)),
    byCategory,
  };
}

/**
 * Daily sales summary — grouped by day.
 */
export async function dailySalesSummary(
  filter: DateRangeFilter,
  strapiClient: AxiosInstance
): Promise<{ date: string; count: number; revenue: number }[]> {
  const storeFilter = filter.storeId
    ? `&filters[store][id][$eq]=${filter.storeId}`
    : '';

  const response = await strapiClient.get(
    `/api/sales?filters[date][$gte]=${filter.from}&filters[date][$lte]=${filter.to}${storeFilter}&pagination[limit]=1000`
  );

  const sales: any[] = response.data?.data ?? [];
  const dayMap = new Map<string, { count: number; revenue: number }>();

  for (const sale of sales) {
    const day: string = (sale.attributes?.date ?? '').slice(0, 10);
    const entry = dayMap.get(day) ?? { count: 0, revenue: 0 };
    entry.count += 1;
    entry.revenue += sale.attributes?.total_amount ?? 0;
    dayMap.set(day, entry);
  }

  return Array.from(dayMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
