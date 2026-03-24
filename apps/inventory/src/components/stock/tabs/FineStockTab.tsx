"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Upload, Barcode, Gem, FileText, Package, ArrowLeft, ArrowRight } from "lucide-react";
import { Button, Card, CardBody, CardHeader, CardTitle } from "@jewellery-retail/ui";
import { useFineStockStore } from "@/src/store/stock-store";
import { useFirmStore } from "@/src/store/firm-store";
import type { FineStockEntry, MetalType, StoneDetail } from "@/src/types/stock";
import { METAL_OPTIONS } from "@/src/types/stock";
import { StockStoneRow } from "../StockStoneRow";

const BRAND_SELLER_OPTIONS = ["", "MMJ", "Partner", "Other"];
const GENDER_OPTIONS = ["", "Male", "Female"];

export type ChargeBasis = "per_gm" | "percentage";
const CHARGE_BASIS_OPTIONS: { value: ChargeBasis; label: string }[] = [
  { value: "per_gm", label: "gm" },
  { value: "percentage", label: "%" },
];

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";

interface FineStockTabProps {
  isImitation?: boolean;
}

export function FineStockTab({ isImitation = false }: FineStockTabProps) {
  const addPending = useFineStockStore((s) => s.addPending);
  const pendingEntries = useFineStockStore((s) => s.pendingEntries);
  const confirmEntry = useFineStockStore((s) => s.confirmEntry);
  const deletePending = useFineStockStore((s) => s.deletePending);
  const { firms, fetchFirms } = useFirmStore();

  useEffect(() => {
    void fetchFirms();
  }, [fetchFirms]);

  const [showStoneRow, setShowStoneRow] = useState(false);
  const [stones, setStones] = useState<StoneDetail[]>([]);
  const [form, setForm] = useState({
    billDate: new Date().toISOString().slice(0, 10),
    firm: "",
    metal: "Gold" as MetalType,
    metalRate: 0,
    productCode: "",
    brandSellerName: "",
    counterName: "",
    genderBis: "",
    barcode: "",
    hallmarkUid: "",
    category: "RING",
    name: "",
    qty: 1,
    gsWt: 0,
    lessWt: 0,
    pktWt: 0,
    ntWt: 0,
    tagWt: 0,
    purity: 92,
    wst: 0,
    fPurity: 96,
    charges: 0,
    fnWt: 0,
    cw: 0,
    cwChrgType: "per_gm" as ChargeBasis,
    ffnWt: 0,
    lbrChrg: 0,
    lbrChrgType: "per_gm" as ChargeBasis,
    mkgChrg: 0,
    mkgChrgType: "per_gm" as ChargeBasis,
    totHallmarkChrgs: 0,
    othChChrgType: "per_gm" as ChargeBasis,
    modelNo: "",
    othCh: 0,
    valuation: 0,
    totLab: 0,
    finalAmt: 0,
  });

  const update = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const derivedNtWt = Math.max(
    0,
    (form.gsWt || 0) - (form.lessWt || 0) - (form.pktWt || 0) - (form.tagWt || 0)
  );
  const derivedFPurity = Math.max(0, (form.purity || 0) + (form.wst || 0));
  const derivedFnWt = (derivedNtWt * (form.purity || 0)) / 100;
  const derivedFFnWt = (derivedNtWt * derivedFPurity) / 100;

  const handleSubmit = () => {
    const valuation = form.valuation || derivedNtWt * (form.metalRate || 0);
    const totLab = form.totLab || form.lbrChrg + form.mkgChrg;
    const finalAmt = form.finalAmt || valuation + totLab;

    addPending({
      billDate: form.billDate || new Date().toISOString().slice(0, 10),
      firm: form.firm,
      metal: form.metal,
      metalRate: form.metalRate,
      productCode: form.productCode,
      brandSellerName: form.brandSellerName,
      counterName: form.counterName,
      genderBis: form.genderBis,
      photos: [],
      barcode: form.barcode,
      hallmarkUid: form.hallmarkUid,
      mfgDate: "",
      category: form.category,
      name: form.name,
      qty: form.qty,
      gsWt: form.gsWt,
      lessWt: form.lessWt,
      pktWt: form.pktWt,
      ntWt: derivedNtWt,
      tagWt: form.tagWt,
      purity: form.purity,
      wst: form.wst,
      fPurity: derivedFPurity,
      charges: form.charges,
      fnWt: derivedFnWt,
      cw: form.cw,
      cwChrgType: form.cwChrgType,
      ffnWt: derivedFFnWt,
      lbrChrg: form.lbrChrg,
      lbrChrgType: form.lbrChrgType,
      mkgChrg: form.mkgChrg,
      mkgChrgType: form.mkgChrgType,
      totHallmarkChrgs: form.totHallmarkChrgs,
      othChChrgType: form.othChChrgType,
      modelNo: form.modelNo,
      othCh: form.othCh,
      valuation,
      totLab,
      finalAmt,
      stones,
    });
    setStones([]);
    setShowStoneRow(false);
  };

  return (
    <div className="relative flex min-w-0 flex-col gap-6">
      <p className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="inline-block h-4 w-4 rounded-full bg-amber-100 text-center text-[10px] leading-4 text-amber-600" aria-hidden>i</span>
        <span>Fields marked in <span className="font-medium text-red-500">red</span> are required.</span>
      </p>

      {/* Card 1: Bill & Header Information */}
      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg font-semibold text-zinc-900">
                {isImitation ? "Add Imitation Jewellery Retail Stock (Opening Stock)" : "Add Jewellery Retail Stock (Opening Stock)"}
              </CardTitle>
              <p className="text-sm text-zinc-500">Bill date, firm, metal rate and header details</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
              RETAIL STOCK
            </Button>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Bill Date</label>
              <input
                type="date"
                className={inputClass}
                value={form.billDate}
                onChange={(e) => update({ billDate: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Firm</label>
              <select
                className={inputClass}
                value={form.firm}
                onChange={(e) => update({ firm: e.target.value })}
              >
                <option value="">— Select firm —</option>
                {firms.map((f) => (
                  <option key={f.id} value={f.id}>{f.shopName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Metal</label>
              <select
                className={inputClass}
                value={form.metal}
                onChange={(e) => update({ metal: e.target.value as MetalType })}
              >
                {METAL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Product Code</label>
              <input
                className={inputClass}
                value={form.productCode}
                onChange={(e) => update({ productCode: e.target.value })}
                placeholder="Code"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Brand / Seller Name</label>
              <select
                className={inputClass}
                value={form.brandSellerName}
                onChange={(e) => update({ brandSellerName: e.target.value })}
              >
                {BRAND_SELLER_OPTIONS.map((opt) => (
                  <option key={opt || "__select__"} value={opt}>{opt || "— Select brand —"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Counter Name</label>
              <input
                className={inputClass}
                value={form.counterName}
                onChange={(e) => update({ counterName: e.target.value })}
                placeholder="Counter"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Gender BIS</label>
              <select
                className={inputClass}
                value={form.genderBis}
                onChange={(e) => update({ genderBis: e.target.value })}
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt || "__select__"} value={opt}>{opt || "— Select gender —"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Img / Photos</label>
              <div className="flex gap-2">
                <button type="button" className="flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 px-3 hover:bg-gray-50">
                  <Camera className="h-4 w-4" />
                </button>
                <button type="button" className="flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 px-3 hover:bg-gray-50">
                  <Upload className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Barcode</label>
              <div className="flex">
                <input
                  className={`${inputClass} rounded-r-none`}
                  value={form.barcode}
                  onChange={(e) => update({ barcode: e.target.value })}
                  placeholder="Barcode"
                />
                <button type="button" className="rounded-r-lg border border-l-0 border-gray-200 bg-white p-2 hover:bg-gray-50">
                  <Barcode className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Hallmark UID</label>
              <input
                className={inputClass}
                value={form.hallmarkUid}
                onChange={(e) => update({ hallmarkUid: e.target.value })}
                placeholder="Hallmark UID"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Card 2: Product / Item Details */}
      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Package className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Product & Item Details</CardTitle>
            <p className="text-sm text-zinc-500">Category, weights, purity and charges</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="space-y-4">
            {/* Basic Item Info */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Basic Item Info</h3>
              <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Category</label>
                  <input className={inputClass} value={form.category} onChange={(e) => update({ category: e.target.value })} placeholder="e.g. RING" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Name</label>
                  <input className={inputClass} value={form.name} onChange={(e) => update({ name: e.target.value })} placeholder="Name" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Qty</label>
                  <input type="number" className={inputClass} value={form.qty === 0 || form.qty === 1 ? "" : form.qty} onChange={(e) => update({ qty: Number(e.target.value) || 0 })} placeholder="1" />
                </div>
              </div>
            </div>

            {/* Weight Details */}
            <div className="rounded-lg border border-zinc-200 bg-amber-50/30 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Weight Details</h3>
              <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">GS WT</label>
                  <input type="number" className={inputClass} value={form.gsWt || ""} onChange={(e) => update({ gsWt: Number(e.target.value) || 0 })} placeholder="Gross weight" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Less WT</label>
                  <input type="number" className={inputClass} value={form.lessWt || ""} onChange={(e) => update({ lessWt: Number(e.target.value) || 0 })} placeholder="Less weight" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Pkt WT</label>
                  <input type="number" className={inputClass} value={form.pktWt || ""} onChange={(e) => update({ pktWt: Number(e.target.value) || 0 })} placeholder="Packet weight" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Tag WT</label>
                  <input type="number" className={inputClass} value={form.tagWt || ""} onChange={(e) => update({ tagWt: Number(e.target.value) || 0 })} placeholder="Tag weight" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">NT WT</label>
                  <input
                    type="number"
                    className={`${inputClass} bg-gray-50`}
                    value={derivedNtWt === 0 ? "" : derivedNtWt}
                    readOnly
                    placeholder="Auto"
                    title="NT WT = GS WT - Less WT - Pkt WT - Tag WT"
                  />
                </div>
              </div>
            </div>

            {/* WST & Fine Purity (includes Purity and Charges) */}
            <div className="rounded-lg border border-zinc-200 bg-amber-50/30 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">WST & Fine Purity</h3>
              <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Purity</label>
                  <input type="number" className={inputClass} value={form.purity === 0 || form.purity === 92 ? "" : form.purity} onChange={(e) => update({ purity: Number(e.target.value) || 0 })} placeholder="92" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">WST</label>
                  <input type="number" className={inputClass} value={form.wst || ""} onChange={(e) => update({ wst: Number(e.target.value) || 0 })} placeholder="WST" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">F. Purity</label>
                  <input
                    type="number"
                    className={`${inputClass} bg-gray-50`}
                    value={derivedFPurity === 0 ? "" : derivedFPurity}
                    readOnly
                    placeholder="Auto"
                    title="F. Purity = Purity + WST"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-900">Charges</label>
                  <input type="number" className={inputClass} value={form.charges || ""} onChange={(e) => update({ charges: Number(e.target.value) || 0 })} placeholder="Charges" />
                </div>
              </div>
            </div>

            {/* Final Weights + Charge Details — Final Weights narrow, Customer Charges uses rest */}
            <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="min-w-0 rounded-lg border border-zinc-200 bg-emerald-50/40 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Final Weights</h3>
                <div className="grid min-w-0 grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-900">FFN WT</label>
                    <input
                      type="number"
                      className={`${inputClass} bg-gray-50`}
                      value={derivedFFnWt === 0 ? "" : derivedFFnWt}
                      readOnly
                      placeholder="Auto"
                      title="FFN WT = NT WT × (F. Purity%)"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-900">FN WT</label>
                    <input
                      type="number"
                      className={`${inputClass} bg-gray-50`}
                      value={derivedFnWt === 0 ? "" : derivedFnWt}
                      readOnly
                      placeholder="Auto"
                      title="FN WT = NT WT × (Purity%)"
                    />
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-sky-50/50 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Customer Charges details</h3>
                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="min-w-0 space-y-1 lg:min-w-[130px]">
                    <label className="block text-xs font-medium text-zinc-900">Cust WST</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={form.cw || ""}
                      onChange={(e) => update({ cw: Number(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="min-w-0 space-y-1 lg:min-w-[150px]">
                    <label className="block text-xs font-medium text-zinc-900">Lbr Chrg</label>
                    <div className="flex min-w-0 gap-2">
                      <select
                        className={`${inputClass} w-14 shrink-0`}
                        value={form.lbrChrgType}
                        onChange={(e) => update({ lbrChrgType: e.target.value as ChargeBasis })}
                      >
                        {CHARGE_BASIS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <input type="number" className={`${inputClass} min-w-[4rem] flex-1`} value={form.lbrChrg || ""} onChange={(e) => update({ lbrChrg: Number(e.target.value) || 0 })} placeholder="Labor charge" />
                    </div>
                  </div>
                  <div className="min-w-0 space-y-1 lg:min-w-[150px]">
                    <label className="block text-xs font-medium text-zinc-900">Mkg Chrg</label>
                    <div className="flex min-w-0 gap-2">
                      <select
                        className={`${inputClass} w-14 shrink-0`}
                        value={form.mkgChrgType}
                        onChange={(e) => update({ mkgChrgType: e.target.value as ChargeBasis })}
                      >
                        {CHARGE_BASIS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <input type="number" className={`${inputClass} min-w-[4rem] flex-1`} value={form.mkgChrg || ""} onChange={(e) => update({ mkgChrg: Number(e.target.value) || 0 })} placeholder="Making charge" />
                    </div>
                  </div>
                  <div className="min-w-0 space-y-1 lg:min-w-[160px]">
                    <label className="block text-xs font-medium text-zinc-900">Tot Hallmark Chrgs</label>
                    <div className="flex min-w-0 gap-2">
                      <select
                        className={`${inputClass} w-14 shrink-0`}
                        value={form.othChChrgType}
                        onChange={(e) => update({ othChChrgType: e.target.value as ChargeBasis })}
                      >
                        {CHARGE_BASIS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <input type="number" className={`${inputClass} min-w-[4rem] flex-1`} value={form.othCh || ""} onChange={(e) => update({ othCh: Number(e.target.value) || 0 })} placeholder="Total hallmark charges" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-zinc-100 bg-white p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Valuation</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.valuation === 0 ? "" : form.valuation}
                  onChange={(e) => update({ valuation: Number(e.target.value) || 0 })}
                  placeholder={(derivedNtWt * (form.metalRate || 0)).toFixed(2)}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowStoneRow(!showStoneRow)}
                className="flex h-[44px] w-10 shrink-0 items-center justify-center rounded-lg border-2 border-amber-500 bg-amber-400 text-navy-800 hover:bg-amber-500"
                title="Stone"
              >
                <Gem className="h-4 w-4" />
              </button>
            </div>
            {showStoneRow && (
              <div className="border-t border-zinc-100">
                <StockStoneRow
                  stones={stones}
                  onChange={setStones}
                  categoryLabel="CATEGORY"
                />
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Footer actions — same as Firm form */}
      <div className="flex flex-col gap-3 border-t border-zinc-100 bg-white pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/stock" className="order-2 sm:order-1">
          <Button type="button" variant="ghost" className="min-h-[44px] w-full sm:min-h-9 sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </Link>
        <div className="order-1 flex justify-end sm:order-2">
          <Button
            type="button"
            onClick={handleSubmit}
            className="min-h-[44px] w-full bg-amber-500 text-white hover:bg-amber-600 sm:min-h-9 sm:w-auto"
          >
            Submit
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Review table — after submit */}
      {pendingEntries.length > 0 && (
        <Card className="min-w-0" padding="lg">
          <CardHeader className="border-b border-zinc-100 pb-4">
            <CardTitle className="text-lg font-semibold text-zinc-900">Review before adding to stock</CardTitle>
            <p className="text-sm text-zinc-500">Click ADD STOCK to add each item to main stock</p>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left font-semibold text-zinc-700">
                    <th className="p-3">Product</th>
                    <th className="p-3">Metal</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Valuation</th>
                    <th className="p-3">Final Amt</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEntries.map((e) => (
                    <tr key={e.id} className="border-b border-zinc-100">
                      <td className="p-3">{e.name || e.productCode}</td>
                      <td className="p-3">{e.metal}</td>
                      <td className="p-3">{e.qty}</td>
                      <td className="p-3">{e.valuation}</td>
                      <td className="p-3">{e.finalAmt}</td>
                      <td className="flex gap-2 p-3">
                        <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={() => confirmEntry(e.id)}>ADD STOCK</Button>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-600" onClick={() => deletePending(e.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
