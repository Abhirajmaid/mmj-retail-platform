import type { Order } from "@jewellery-retail/types";

import { fetchJson } from "./client";
import { mockOrders } from "./mock-data";

export async function getOrders(): Promise<Order[]> {
  return fetchJson("/api/orders?populate=customer&sort=createdAt:desc", mockOrders);
}
