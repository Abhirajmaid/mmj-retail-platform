/**
 * Stock Transfer (firm-to-firm) types for MMJ Jewelry Inventory.
 */

export type TransferStatus =
  | "DRAFT"
  | "APPROVAL_PENDING"
  | "STOCK_APPROVED"
  | "RETURN"
  | "REJECTED";

export interface StockTransferItem {
  prodId: string;
  sku?: string;
  date: string;
  transferDate: string;
  prevFirm: string;
  firm: string;
  type: string;
  category: string;
  name: string;
  hsn: string;
  qty: number;
  grossWeight: number;
  netWeight: number;
  purity: string;
  fineWeight: number;
  fineFineWeight: number;
  status: TransferStatus;
  returnFlag?: boolean;
}

export interface StockTransfer {
  id: string;
  voucherPrefix: string;
  voucherNumber: number;
  prevFirm: string;
  newFirm: string;
  prevCounter?: string;
  newCounter?: string;
  prevStaff?: string;
  newStaff?: string;
  items: StockTransferItem[];
  status: TransferStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  /** Set when receiving firm confirms receive; items then considered added to receiving firm stock */
  receivedAt?: string;
  receivedBy?: string;
}

export const TRANSFER_STATUS_LABELS: Record<TransferStatus, string> = {
  DRAFT: "Draft",
  APPROVAL_PENDING: "Approval Pending",
  STOCK_APPROVED: "Stock Approved",
  RETURN: "Return",
  REJECTED: "Rejected",
};

export const STOCK_TRANSFER_MENU_ITEMS = [
  { label: "STOCK TRANSFER", href: "/stock/transfer" },
  { label: "STOCK TRANSFER LIST", href: "/stock/transfer/list" },
  { label: "STOCK TRANSFER - PENDING APPROVAL LIST", href: "/stock/transfer/pending-approval" },
  { label: "STOCK TRANSFER - APPROVED LIST", href: "/stock/transfer/approved" },
  { label: "STOCK TRANSFER - RETURN LIST", href: "/stock/transfer/return-list" },
  { label: "STOCK TRANSFER REPORT", href: "/stock/transfer/report" },
] as const;
