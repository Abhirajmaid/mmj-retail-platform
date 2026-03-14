import type { Product } from "@jewellery-retail/types";

import { fetchJson } from "./client";
import { mockProducts } from "./mock-data";

export async function getProducts(): Promise<Product[]> {
  return fetchJson("/api/products?populate=category&sort=updatedAt:desc", mockProducts);
}
