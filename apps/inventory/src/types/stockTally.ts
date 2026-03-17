/**
 * Stock Tally types for daily physical verification (RFID, barcode, images, tables).
 */

export type StockTallyMode =
  | "images"
  | "tables"
  | "rfid"
  | "multi-barcode";

export interface StockTallyItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  metalType: string;
  qty: number;
  grossWeight: number;
  netWeight: number;
  fineWeight: number;
  fineFineWeight?: number;
  /** Optional image URL for Tally With Images */
  imageUrl?: string | null;
  /** Barcode or RFID tag for lookup */
  barcodeOrTag?: string;
}

export const STOCK_TALLY_CATEGORIES = [
  "Chain",
  "Ring",
  "Sahajew",
  "Testchain",
  "Testring",
  "Tops",
  "Bangle",
  "Pendant",
  "Earring",
  "Bracelet",
] as const;

export type StockTallyCategory = (typeof STOCK_TALLY_CATEGORIES)[number];
