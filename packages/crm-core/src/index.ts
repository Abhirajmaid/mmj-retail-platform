import { AxiosInstance } from 'axios';

export interface CustomerData {
  name: string;
  mobile?: string;
  email?: string;
  address?: string;
  city?: string;
  pincode?: string;
  pan_number?: string;
  aadhaar_number?: string;
  credit_limit?: number;
  notes?: string;
}

/**
 * Create a new customer in Strapi.
 */
export async function createCustomer(
  customerData: CustomerData,
  strapiClient: AxiosInstance
): Promise<any> {
  const response = await strapiClient.post('/api/customers', {
    data: {
      ...customerData,
      loyalty_points: 0,
    },
  });
  return response.data;
}

/**
 * Fetch the full ledger (debit/credit entries) for a customer.
 */
export async function customerLedger(
  customerId: number,
  strapiClient: AxiosInstance
): Promise<any[]> {
  const response = await strapiClient.get(
    `/api/ledger-entries?filters[entity_type][$eq]=customer&filters[entity_id][$eq]=${customerId}&sort=date:asc`
  );
  return response.data?.data ?? [];
}

/**
 * Fetch all sales (purchase history) for a customer.
 */
export async function customerPurchaseHistory(
  customerId: number,
  strapiClient: AxiosInstance
): Promise<any[]> {
  const response = await strapiClient.get(
    `/api/sales?filters[customer][id][$eq]=${customerId}&populate=sale_items,payments&sort=date:desc`
  );
  return response.data?.data ?? [];
}

/**
 * Add or subtract loyalty points for a customer.
 */
export async function updateLoyaltyPoints(
  customerId: number,
  delta: number,
  strapiClient: AxiosInstance
): Promise<any> {
  // Fetch current points first
  const getRes = await strapiClient.get(`/api/customers/${customerId}`);
  const current: number = getRes.data?.data?.attributes?.loyalty_points ?? 0;
  const updated = Math.max(0, current + delta);

  const response = await strapiClient.put(`/api/customers/${customerId}`, {
    data: { loyalty_points: updated },
  });
  return response.data;
}

/**
 * Get outstanding balance for a customer across all unpaid/partial sales.
 */
export async function customerOutstandingBalance(
  customerId: number,
  strapiClient: AxiosInstance
): Promise<number> {
  const response = await strapiClient.get(
    `/api/sales?filters[customer][id][$eq]=${customerId}&filters[payment_status][$in][0]=pending&filters[payment_status][$in][1]=partial&populate=payments`
  );
  const sales: any[] = response.data?.data ?? [];

  let outstanding = 0;
  for (const sale of sales) {
    const totalAmount: number = sale.attributes?.total_amount ?? 0;
    const payments: any[] = sale.attributes?.payments?.data ?? [];
    const paid = payments.reduce((s: number, p: any) => s + (p.attributes?.amount ?? 0), 0);
    outstanding += totalAmount - paid;
  }
  return parseFloat(outstanding.toFixed(2));
}
