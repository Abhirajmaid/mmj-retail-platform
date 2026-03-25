import type { Supplier } from "@jewellery-retail/types";
import type { SupplierType } from "@jewellery-retail/types";

import { SUPPLIER_TYPE_OPTIONS } from "./SuppliersFilterBar";

export const SUPPLIER_JUST_ADDED_KEY = "supplierJustAdded";

export function getSupplierTypeLabel(supplierType: string | undefined): string {
  if (!supplierType) return "—";
  const option = SUPPLIER_TYPE_OPTIONS.find((o) => o.value === supplierType);
  return option?.label ?? "Other";
}

/** Read supplierType from flat or Strapi-shaped supplier (attributes.supplierType). */
export function getSupplierType(
  supplier: Supplier & { attributes?: { supplierType?: string } }
): string | undefined {
  const t = supplier.attributes?.supplierType ?? supplier.supplierType;
  return t != null && t !== "" ? String(t).toLowerCase() : undefined;
}

export function readJustAddedSupplier(): Supplier | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SUPPLIER_JUST_ADDED_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(SUPPLIER_JUST_ADDED_KEY);
    return JSON.parse(raw) as Supplier;
  } catch {
    sessionStorage.removeItem(SUPPLIER_JUST_ADDED_KEY);
    return null;
  }
}

