import axios from "axios";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

export const strapiClient = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    "Content-Type": "application/json",
    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
  },
});

// ── Jewellery Items ──────────────────────────────────────────────────────────

export async function searchItemByBarcode(barcode) {
  const res = await strapiClient.get(
    `/api/jewellery-items?filters[barcode][$eq]=${encodeURIComponent(barcode)}&filters[status][$eq]=available&populate=product.category`
  );
  return res.data?.data?.[0] ?? null;
}

export async function searchItems(query) {
  const res = await strapiClient.get(
    `/api/jewellery-items?filters[$or][0][barcode][$containsi]=${query}&filters[$or][1][tag_number][$containsi]=${query}&filters[status][$eq]=available&populate=product&pagination[limit]=20`
  );
  return res.data?.data ?? [];
}

// ── Sales ────────────────────────────────────────────────────────────────────

export async function createSale(saleData) {
  const res = await strapiClient.post("/api/sales", { data: saleData });
  return res.data?.data;
}

export async function createSaleItem(saleItemData) {
  const res = await strapiClient.post("/api/sale-items", { data: saleItemData });
  return res.data?.data;
}

export async function markItemSold(itemId) {
  const res = await strapiClient.put(`/api/jewellery-items/${itemId}`, {
    data: { status: "sold" },
  });
  return res.data?.data;
}

export async function createPayment(paymentData) {
  const res = await strapiClient.post("/api/payments", { data: paymentData });
  return res.data?.data;
}

export async function getSaleById(id) {
  const res = await strapiClient.get(
    `/api/sales/${id}?populate=sale_items.jewellery_item.product,payments,customer,store`
  );
  return res.data?.data;
}

// ── Customers ────────────────────────────────────────────────────────────────

export async function getCustomers(search = "") {
  const filter = search
    ? `&filters[$or][0][name][$containsi]=${search}&filters[$or][1][mobile][$containsi]=${search}`
    : "";
  const res = await strapiClient.get(`/api/customers?sort=name:asc${filter}&pagination[limit]=50`);
  return res.data?.data ?? [];
}

export async function getCustomerById(id) {
  const res = await strapiClient.get(
    `/api/customers/${id}?populate=sales,custom_orders,repairs,saving_schemes`
  );
  return res.data?.data;
}

export async function createCustomer(data) {
  const res = await strapiClient.post("/api/customers", { data });
  return res.data?.data;
}

// ── Orders ───────────────────────────────────────────────────────────────────

export async function getCustomOrders(status) {
  const filter = status ? `&filters[status][$eq]=${status}` : "";
  const res = await strapiClient.get(
    `/api/custom-orders?populate=customer&sort=createdAt:desc${filter}&pagination[limit]=50`
  );
  return res.data?.data ?? [];
}

export async function createCustomOrder(data) {
  const res = await strapiClient.post("/api/custom-orders", { data });
  return res.data?.data;
}

// ── Repairs ──────────────────────────────────────────────────────────────────

export async function getRepairs(status) {
  const filter = status ? `&filters[status][$eq]=${status}` : "";
  const res = await strapiClient.get(
    `/api/repairs?populate=customer&sort=received_date:desc${filter}&pagination[limit]=50`
  );
  return res.data?.data ?? [];
}

export async function createRepair(data) {
  const res = await strapiClient.post("/api/repairs", { data });
  return res.data?.data;
}

// ── Schemes ──────────────────────────────────────────────────────────────────

export async function getSavingSchemes(status) {
  const filter = status ? `&filters[status][$eq]=${status}` : "";
  const res = await strapiClient.get(
    `/api/saving-schemes?populate=customer&sort=createdAt:desc${filter}&pagination[limit]=50`
  );
  return res.data?.data ?? [];
}

// ── Dashboard KPIs ───────────────────────────────────────────────────────────

export async function getDashboardKPIs(storeId) {
  const today = new Date().toISOString().slice(0, 10);
  const storeFilter = storeId ? `&filters[store][id][$eq]=${storeId}` : "";

  const [salesRes, ordersRes, repairsRes] = await Promise.all([
    strapiClient.get(
      `/api/sales?filters[date][$gte]=${today}T00:00:00.000Z${storeFilter}&populate=payments&pagination[limit]=200`
    ),
    strapiClient.get(
      `/api/custom-orders?filters[status][$in][0]=pending&filters[status][$in][1]=in-progress&pagination[limit]=1`
    ),
    strapiClient.get(
      `/api/repairs?filters[status][$in][0]=received&filters[status][$in][1]=in-progress&pagination[limit]=1`
    ),
  ]);

  const todaySales = salesRes.data?.data ?? [];
  const totalRevenue = todaySales.reduce(
    (s, sale) => s + (sale.attributes?.total_amount ?? 0),
    0
  );
  const cashCollected = todaySales.reduce((s, sale) => {
    const payments = sale.attributes?.payments?.data ?? [];
    return s + payments.reduce((ps, p) => ps + (p.attributes?.amount ?? 0), 0);
  }, 0);

  return {
    todaySalesCount: todaySales.length,
    todayRevenue: totalRevenue,
    cashCollected,
    pendingOrders: ordersRes.data?.meta?.pagination?.total ?? 0,
    activeRepairs: repairsRes.data?.meta?.pagination?.total ?? 0,
  };
}
