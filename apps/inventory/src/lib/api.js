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

// ── Products & Categories ────────────────────────────────────────────────────

export async function getProducts(search = "") {
  const filter = search ? `&filters[name][$containsi]=${encodeURIComponent(search)}` : "";
  const res = await strapiClient.get(`/api/products?populate=category,images&sort=name:asc${filter}&pagination[limit]=100`);
  return res.data?.data ?? [];
}

export async function getProductById(id) {
  const res = await strapiClient.get(`/api/products/${id}?populate=category,images,jewellery_items`);
  return res.data?.data;
}

export async function getCategories() {
  const res = await strapiClient.get("/api/categories?sort=name:asc&pagination[limit]=100");
  return res.data?.data ?? [];
}

// ── Jewellery Items (Stock) ──────────────────────────────────────────────────

export async function getStockItems({ status, storeId, search } = {}) {
  const filters = [];
  if (status) filters.push(`filters[status][$eq]=${status}`);
  if (storeId) filters.push(`filters[store][id][$eq]=${storeId}`);
  if (search) filters.push(`filters[$or][0][barcode][$containsi]=${search}&filters[$or][1][tag_number][$containsi]=${search}`);
  const filterStr = filters.length ? "&" + filters.join("&") : "";
  const res = await strapiClient.get(`/api/jewellery-items?populate=product.category,store${filterStr}&sort=createdAt:desc&pagination[limit]=200`);
  return res.data?.data ?? [];
}

export async function createJewelleryItem(data) {
  const res = await strapiClient.post("/api/jewellery-items", { data });
  return res.data?.data;
}

export async function updateJewelleryItem(id, data) {
  const res = await strapiClient.put(`/api/jewellery-items/${id}`, { data });
  return res.data?.data;
}

// ── Manufacturing ────────────────────────────────────────────────────────────

export async function getManufacturingOrders(status) {
  const filter = status ? `&filters[status][$eq]=${status}` : "";
  const res = await strapiClient.get(`/api/manufacturing-orders?populate=karigar${filter}&sort=createdAt:desc&pagination[limit]=100`);
  return res.data?.data ?? [];
}

export async function getKarigars() {
  const res = await strapiClient.get("/api/karigars?filters[active][$eq]=true&sort=name:asc&pagination[limit]=100");
  return res.data?.data ?? [];
}

// ── Purchase ─────────────────────────────────────────────────────────────────

export async function getPurchaseOrders(status) {
  const filter = status ? `&filters[status][$eq]=${status}` : "";
  const res = await strapiClient.get(`/api/purchase-orders?populate=supplier${filter}&sort=date:desc&pagination[limit]=100`);
  return res.data?.data ?? [];
}

export async function getSuppliers() {
  const res = await strapiClient.get("/api/suppliers?sort=name:asc&pagination[limit]=100");
  return res.data?.data ?? [];
}
