/**
 * Stock module types — movements, tabs, and add-stock forms.
 */

export type MovementType = "Inbound" | "Outbound" | "Transfer";
export type StockStatus = "completed" | "pending" | "cancelled";
export type StockTab = "fine" | "imitation" | "raw_metal" | "crystal" | "reports" | "other";
export type MetalType = "Gold" | "Silver" | "Platinum" | "Rose Gold";

export interface StoneDetail {
  id: string;
  crystalId: string;
  crystalName: string;
  clarity: string;
  color: string;
  certificateNo?: string;
  laboratory?: string;
  size: string;
  shape: string;
  qty: number;
  gsWt: number;
  ct: number;
  rate: number;
  sellRate: number;
  valuation: number;
}

export interface FineStockEntry {
  id: string;
  billDate: string;
  firm: string;
  metal: MetalType;
  metalRate: number;
  productCode: string;
  brandSellerName: string;
  counterName: string;
  genderBis: string;
  photos: string[];
  barcode: string;
  hallmarkUid: string;
  mfgDate: string;
  category: string;
  name: string;
  qty: number;
  gsWt: number;
  lessWt: number;
  pktWt: number;
  ntWt: number;
  tagWt: number;
  purity: number;
  wst: number;
  fPurity: number;
  fnWt: number;
  cw: number;
  ffnWt: number;
  lbrChrg: number;
  mkgChrg: number;
  totHallmarkChrgs: number;
  modelNo: string;
  othCh: number;
  valuation: number;
  totLab: number;
  finalAmt: number;
  stones: StoneDetail[];
  status: "pending_review" | "added";
}

export interface RawMetalEntry {
  id: string;
  billDate: string;
  firm: string;
  brandSellerName: string;
  metalType: MetalType;
  qty: number;
  gsWt: number;
  lessWt: number;
  ntWt: number;
  purity: number;
  wstg: number;
  totLabChrgs: number;
  cgst: number;
  sgst: number;
  igst: number;
  status: "pending_review" | "added";
}

export interface CrystalEntry {
  id: string;
  billDate: string;
  firm: string;
  itemId: string;
  brandSellerName: string;
  gender: string;
  photos: string[];
  crystalCategory: string;
  crystalName: string;
  shape: string;
  size: string;
  clarity: string;
  color: string;
  qty: number;
  gsWt: number;
  ct: number;
  purchaseRate: number;
  sellRate: number;
  valuation: number;
  cgstPct: number;
  cgstAmt: number;
  sgstPct: number;
  sgstAmt: number;
  igstPct: number;
  igstAmt: number;
  totalTax: number;
  finalVal: number;
  status: "pending_review" | "added";
}

/** Movement from API — normalized for grouping/filtering. */
export interface StockMovementView {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  type: "inbound" | "outbound" | "transfer";
  location: string;
  status: "completed" | "pending" | "cancelled";
  updatedAt: string;
}

export const METAL_OPTIONS: { value: MetalType; label: string }[] = [
  { value: "Gold", label: "Gold" },
  { value: "Silver", label: "Silver" },
  { value: "Platinum", label: "Platinum" },
  { value: "Rose Gold", label: "Rose Gold" },
];

export const STOCK_TAB_LABELS: Record<StockTab, string> = {
  fine: "Fine Stock",
  imitation: "Imitation Stock",
  raw_metal: "Raw Metal Stock",
  crystal: "Crystal Stock",
  reports: "Stock Reports",
  other: "Other Options",
};

export const OTHER_OPTIONS_ITEMS = [
  { id: "setting", label: "Stock Setting", icon: "📋" },
  { id: "master", label: "Stock Master", icon: "📦" },
  { id: "transfer", label: "Stock Transfer", icon: "🔄" },
  { id: "discount", label: "Discount Option", icon: "💰" },
  { id: "setup", label: "Setup Option", icon: "⚙️" },
  { id: "delete", label: "Multiple Stock Delete", icon: "🗑️" },
] as const;
