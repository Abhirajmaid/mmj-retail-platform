import axios, { AxiosInstance } from 'axios';

export interface StockEntryData {
  barcode: string;
  tag_number: string;
  gross_weight: number;
  net_weight: number;
  stone_weight?: number;
  purity: string;
  making_charges?: number;
  product: number;  // Strapi product ID
  store: number;    // Strapi store ID
  location?: string;
}

export interface SaleItem {
  jewellery_item_id: number;
}

export interface TransferData {
  itemId: number;
  toStoreId: number;
}

export interface ManufacturingEntryData {
  design: string;
  karigar: number;
  issued_gold_weight: number;
  stone_used?: number;
  expected_date?: string;
  notes?: string;
}

/**
 * Create a new jewellery item in stock.
 */
export async function createStockEntry(
  itemData: StockEntryData,
  strapiClient: AxiosInstance
): Promise<any> {
  const response = await strapiClient.post('/api/jewellery-items', {
    data: {
      ...itemData,
      status: 'available',
    },
  });
  return response.data;
}

/**
 * Mark sold items as status="sold" after a completed sale.
 */
export async function deductStockAfterSale(
  saleItems: SaleItem[],
  strapiClient: AxiosInstance
): Promise<void> {
  await Promise.all(
    saleItems.map((item) =>
      strapiClient.put(`/api/jewellery-items/${item.jewellery_item_id}`, {
        data: { status: 'sold' },
      })
    )
  );
}

/**
 * Transfer a jewellery item to a different store.
 */
export async function transferStock(
  transfer: TransferData,
  strapiClient: AxiosInstance
): Promise<any> {
  const response = await strapiClient.put(`/api/jewellery-items/${transfer.itemId}`, {
    data: {
      store: transfer.toStoreId,
      status: 'transferred',
    },
  });
  return response.data;
}

/**
 * Create a manufacturing order and mark gold as issued.
 */
export async function manufacturingEntry(
  orderData: ManufacturingEntryData,
  strapiClient: AxiosInstance
): Promise<any> {
  const response = await strapiClient.post('/api/manufacturing-orders', {
    data: {
      ...orderData,
      status: 'issued',
      issue_date: new Date().toISOString().slice(0, 10),
    },
  });
  return response.data;
}

/**
 * Receive finished goods from a karigar and update the manufacturing order.
 */
export async function receiveFinishedGoods(
  orderId: number,
  finalWeight: number,
  wastage: number,
  strapiClient: AxiosInstance
): Promise<any> {
  const response = await strapiClient.put(`/api/manufacturing-orders/${orderId}`, {
    data: {
      final_weight: finalWeight,
      wastage,
      status: 'completed',
      completion_date: new Date().toISOString().slice(0, 10),
    },
  });
  return response.data;
}

/**
 * Create a pre-configured Axios client for Strapi API calls.
 */
export function createStrapiClient(baseURL: string, token?: string): AxiosInstance {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
