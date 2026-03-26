"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@jewellery-retail/ui";
import { useStockMovements } from "@jewellery-retail/hooks";
import { PageHeader } from "@jewellery-retail/ui";
import { useStockTransferStore } from "@/src/store/stockTransferStore";
import { useFirmStore } from "@/src/store/firm-store";
import type { StockTransferItem } from "@/src/types/stockTransfer";
import { FirmSelectorBar } from "./FirmSelectorBar";
import { StockTransferDropdown } from "./StockTransferDropdown";
import { TransferOptionsBar } from "./TransferOptionsBar";
import { CounterSelectorBar } from "./CounterSelectorBar";
import { StaffSelectorBar } from "./StaffSelectorBar";
import { ProductBarcodeSearch, type StockSearchItem } from "./ProductBarcodeSearch";
import { TransferSummaryRow } from "./TransferSummaryRow";

function movementToSearchItem(m: {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  type?: string;
  location?: string;
  status?: string;
  updatedAt?: string;
}): StockSearchItem {
  return {
    id: m.id,
    productId: m.productId,
    productName: m.productName,
    sku: m.sku,
    quantity: m.quantity,
    type: m.type,
    location: m.location,
    status: m.status,
    updatedAt: m.updatedAt,
  };
}

function createTransferItemFromStock(
  item: StockSearchItem,
  fromFirm: string,
  toFirm: string
): StockTransferItem {
  return {
    prodId: item.productId,
    sku: item.sku,
    date: new Date().toISOString().slice(0, 10),
    transferDate: new Date().toISOString().slice(0, 10),
    prevFirm: fromFirm,
    firm: toFirm,
    type: item.type ?? "Gold",
    category: "RING",
    name: item.productName,
    hsn: "7113",
    qty: item.quantity,
    grossWeight: 0,
    netWeight: 0,
    purity: "—",
    fineWeight: 0,
    fineFineWeight: 0,
    status: "DRAFT",
  };
}

export function StockTransferForm() {
  const viewingFirmId = useStockTransferStore((s) => s.viewingFirmId);
  const activeFirm = useStockTransferStore((s) => s.activeFirm);
  const activeCounter = useStockTransferStore((s) => s.activeCounter);
  const activeStaff = useStockTransferStore((s) => s.activeStaff);
  const setActiveCounter = useStockTransferStore((s) => s.setActiveCounter);
  const setActiveStaff = useStockTransferStore((s) => s.setActiveStaff);
  const addTransfer = useStockTransferStore((s) => s.addTransfer);
  const getNextVoucherNumber = useStockTransferStore((s) => s.getNextVoucherNumber);
  const setActiveFirm = useStockTransferStore((s) => s.setActiveFirm);

  const { firms, fetchFirms } = useFirmStore();
  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  const { data: movements = [] } = useStockMovements();
  const stockItems = useMemo(
    () => movements.map((m) => movementToSearchItem(m)),
    [movements]
  );

  const [draftItems, setDraftItems] = useState<StockTransferItem[]>([]);
  const [pickedItems, setPickedItems] = useState<StockSearchItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<StockSearchItem | null>(null);

  const viewingFirm = viewingFirmId ? firms.find((f) => f.id === viewingFirmId) : null;
  const destinationFirm = activeFirm ? firms.find((f) => f.id === activeFirm) : null;
  const firmOptions = firms.map((f) => ({ id: f.id, label: f.shopName }));
  const fromFirm = viewingFirm?.shopName ?? null;
  const toFirm = destinationFirm?.shopName ?? null;
  const voucherPrefix = viewingFirm
    ? `VO${firms.findIndex((f) => f.id === viewingFirmId) + 1}`
    : "VO";
  const voucherNumber = getNextVoucherNumber(voucherPrefix);

  const handleSelectItem = useCallback(
    (item: StockSearchItem) => {
      setSelectedItemForDetails(item);
      setPickedItems((prev) => {
        if (prev.some((p) => p.productId === item.productId)) return prev;
        return [...prev, item];
      });
      if (!fromFirm || !toFirm) return;
      const existing = draftItems.some((i) => i.prodId === item.productId);
      if (existing) return;
      const newItem = createTransferItemFromStock(item, fromFirm, toFirm);
      setDraftItems((prev) => [...prev, newItem]);
    },
    [draftItems, fromFirm, toFirm]
  );

  const handleRemovePickedItem = useCallback((productId: string) => {
    setPickedItems((prev) => prev.filter((p) => p.productId !== productId));
    setDraftItems((prev) => prev.filter((i) => i.prodId !== productId));
    setSelectedItemForDetails((prev) => (prev?.productId === productId ? null : prev));
  }, []);

  const handleRemoveFromDraft = useCallback((prodId: string) => {
    setDraftItems((prev) => prev.filter((i) => i.prodId !== prodId));
    setPickedItems((prev) => prev.filter((p) => p.productId !== prodId));
    setSelectedItemForDetails((prev) => (prev?.productId === prodId ? null : prev));
  }, []);

  const addedItemsForPanel = useMemo(
    () =>
      draftItems.map((i) => ({
        prodId: i.prodId,
        name: i.name,
        sku: i.sku ?? i.prodId,
        qty: i.qty,
      })),
    [draftItems]
  );

  const handleSaveDraft = useCallback(() => {
    if (draftItems.length === 0 || !fromFirm || !toFirm) return;
    addTransfer({
      voucherPrefix,
      voucherNumber,
      prevFirm: fromFirm ?? "—",
      newFirm: toFirm,
      prevCounter: activeCounter ?? undefined,
      newCounter: undefined,
      prevStaff: activeStaff ?? undefined,
      newStaff: undefined,
      items: draftItems,
      status: "DRAFT",
    });
    setDraftItems([]);
    setSelectedItemForDetails(null);
  }, [addTransfer, draftItems, voucherPrefix, voucherNumber, fromFirm, toFirm, activeCounter, activeStaff]);

  const handleSubmitForApproval = useCallback(() => {
    if (draftItems.length === 0 || !fromFirm || !toFirm) return;
    addTransfer({
      voucherPrefix,
      voucherNumber,
      prevFirm: fromFirm ?? "—",
      newFirm: toFirm,
      prevCounter: activeCounter ?? undefined,
      newCounter: undefined,
      prevStaff: activeStaff ?? undefined,
      newStaff: undefined,
      items: draftItems,
      status: "APPROVAL_PENDING",
    });
    setDraftItems([]);
    setSelectedItemForDetails(null);
  }, [addTransfer, draftItems, voucherPrefix, voucherNumber, fromFirm, toFirm, activeCounter, activeStaff]);

  return (
    <div className="min-w-0 space-y-6">
      {/* Header bar (matches PageHeader style used across the app) */}
      <PageHeader
        title="Stock Transfer"
        description="Choose a source firm, counter, staff, and transfer action. Then complete the transfer options below."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <FirmSelectorBar />
            <CounterSelectorBar />
            <StaffSelectorBar />
            <StockTransferDropdown />
          </div>
        }
      />

      {!viewingFirmId && firms.length > 0 && (
        <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Select source context in the top bar (Firm / Counter / Staff), then select the destination in `SELECT FIRM` below.
        </p>
      )}

      <TransferOptionsBar
        counter={activeCounter}
        staff={activeStaff}
        firm={activeFirm}
        firmOptions={firmOptions}
        voucherPrefix={voucherPrefix}
        voucherNumber={voucherNumber}
        onCounterSelect={(value) => setActiveCounter(value)}
        onStaffSelect={(value) => setActiveStaff(value)}
        onFirmChange={setActiveFirm}
      />

      <ProductBarcodeSearch
        stockItems={stockItems}
        selectedItem={selectedItemForDetails}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSelectItem={handleSelectItem}
        showAddHint={Boolean((pickedItems.length > 0 || selectedItemForDetails) && (!fromFirm || !toFirm))}
        onClearSelection={() => setSelectedItemForDetails(null)}
        addedItems={addedItemsForPanel}
        onRemoveAddedItem={handleRemoveFromDraft}
        pickedItems={pickedItems}
        onRemovePickedItem={handleRemovePickedItem}
      />

      <TransferSummaryRow
        prevCounter={activeCounter}
        newCounter={null}
        prevStaff={activeStaff}
        newStaff={null}
        prevFirm={fromFirm}
        newFirm={toFirm}
      />

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
        <Link href="/stock">
          <Button variant="outline" className="h-10 rounded-xl border-zinc-200 px-5 text-zinc-700 hover:bg-zinc-50">
            Cancel
          </Button>
        </Link>
        <div className="flex gap-3">
          <Button
            type="button"
            className="h-10 rounded-xl bg-amber-500 px-5 text-white shadow-sm hover:bg-amber-600"
            onClick={handleSaveDraft}
          >
            Save transfer
          </Button>
          <Button
            type="button"
            className="h-10 rounded-xl bg-amber-500 px-5 text-white shadow-sm hover:bg-amber-600"
            onClick={handleSubmitForApproval}
          >
            Submit for approval
          </Button>
        </div>
      </div>
    </div>
  );
}
