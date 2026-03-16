"use client";

import { useState } from "react";
import { Camera, Upload, Barcode, Gem } from "lucide-react";
import { Button } from "@jewellery-retail/ui";
import { useFineStockStore } from "@/src/store/stock-store";
import type { FineStockEntry, MetalType, StoneDetail } from "@/src/types/stock";
import { METAL_OPTIONS } from "@/src/types/stock";
import { MONTHS } from "@/src/types/firm";
import { StockStoneRow } from "../StockStoneRow";

const inputClass =
  "h-7 min-w-0 rounded border border-gray-200 px-2 py-0.5 text-xs focus:ring-1 focus:ring-amber-400 outline-none";

interface FineStockTabProps {
  /** When true, show "Imitation" labels where relevant */
  isImitation?: boolean;
}

export function FineStockTab({ isImitation = false }: FineStockTabProps) {
  const addPending = useFineStockStore((s) => s.addPending);
  const pendingEntries = useFineStockStore((s) => s.pendingEntries);
  const confirmEntry = useFineStockStore((s) => s.confirmEntry);
  const deletePending = useFineStockStore((s) => s.deletePending);

  const [showStoneRow, setShowStoneRow] = useState(false);
  const [stones, setStones] = useState<StoneDetail[]>([]);
  const [form, setForm] = useState({
    billDateDD: "",
    billDateMM: "",
    billDateYYYY: "",
    firm: "",
    metal: "Gold" as MetalType,
    metalRate: 0,
    productCode: "",
    brandSellerName: "",
    counterName: "",
    genderBis: "",
    barcode: "",
    hallmarkUid: "",
    mfgDateDD: "",
    mfgDateMM: "",
    mfgDateYYYY: "",
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
    fnWt: 0,
    cw: 0,
    ffnWt: 0,
    lbrChrg: 0,
    mkgChrg: 0,
    totHallmarkChrgs: 0,
    modelNo: "",
    othCh: 0,
    valuation: 0,
    totLab: 0,
    finalAmt: 0,
  });

  const update = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = () => {
    const billDate = [form.billDateDD, form.billDateMM, form.billDateYYYY]
      .filter(Boolean)
      .join("-");
    const mfgDate = [form.mfgDateDD, form.mfgDateMM, form.mfgDateYYYY]
      .filter(Boolean)
      .join("-");
    const valuation = form.valuation || form.ntWt * (form.metalRate || 0);
    const totLab = form.totLab || form.lbrChrg + form.mkgChrg;
    const finalAmt = form.finalAmt || valuation + totLab;

    addPending({
      billDate: billDate || new Date().toISOString().slice(0, 10),
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
      mfgDate: mfgDate || "",
      category: form.category,
      name: form.name,
      qty: form.qty,
      gsWt: form.gsWt,
      lessWt: form.lessWt,
      pktWt: form.pktWt,
      ntWt: form.ntWt,
      tagWt: form.tagWt,
      purity: form.purity,
      wst: form.wst,
      fPurity: form.fPurity,
      fnWt: form.fnWt,
      cw: form.cw,
      ffnWt: form.ffnWt,
      lbrChrg: form.lbrChrg,
      mkgChrg: form.mkgChrg,
      totHallmarkChrgs: form.totHallmarkChrgs,
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

  const sectionLabel = isImitation
    ? "ADD IMITATION JEWELLERY RETAIL STOCK - (OPENING STOCK)"
    : "ADD JEWELLERY RETAIL STOCK - (OPENING STOCK)";

  return (
    <div className="space-y-4">
      {/* Top actions — retail only */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="min-h-10 border-amber-500 bg-amber-50">
          RETAIL STOCK
        </Button>
      </div>

      {/* Section label */}
      <div className="rounded border border-amber-200 bg-amber-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-800">
        {sectionLabel}
      </div>

      {/* Header form row */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-8">
        <div>
          <label className="block text-[10px] font-medium text-black">BILL DATE</label>
          <div className="flex gap-1">
            <input
              placeholder="DD"
              className={inputClass}
              value={form.billDateDD}
              onChange={(e) => update({ billDateDD: e.target.value })}
              maxLength={2}
            />
            <select
              className={inputClass}
              value={form.billDateMM}
              onChange={(e) => update({ billDateMM: e.target.value })}
            >
              <option value="">MON</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input
              placeholder="YYYY"
              className={inputClass}
              value={form.billDateYYYY}
              onChange={(e) => update({ billDateYYYY: e.target.value })}
              maxLength={4}
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-black">FIRM</label>
          <input
            className={inputClass}
            value={form.firm}
            onChange={(e) => update({ firm: e.target.value })}
            placeholder="Firm"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-black">METAL / RATE</label>
          <div className="flex gap-1">
            <select
              className={inputClass}
              value={form.metal}
              onChange={(e) => update({ metal: e.target.value as MetalType })}
            >
              {METAL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <input
              type="number"
              className={inputClass}
              value={form.metalRate || ""}
              onChange={(e) => update({ metalRate: Number(e.target.value) || 0 })}
              placeholder="Rate"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-black">PRODUCT CODE</label>
          <input
            className={inputClass}
            value={form.productCode}
            onChange={(e) => update({ productCode: e.target.value })}
            placeholder="Code"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-black">BRAND / SELLER NAME</label>
          <input
            className={inputClass}
            value={form.brandSellerName}
            onChange={(e) => update({ brandSellerName: e.target.value })}
            placeholder="Brand"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-black">COUNTER NAME</label>
          <input
            className={inputClass}
            value={form.counterName}
            onChange={(e) => update({ counterName: e.target.value })}
            placeholder="Counter"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-black">GENDER BIS</label>
          <input
            className={inputClass}
            value={form.genderBis}
            onChange={(e) => update({ genderBis: e.target.value })}
            placeholder="Gender"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-black">IMG/PHOTOS</label>
          <div className="flex gap-1">
            <button type="button" className="rounded border border-gray-200 p-1.5 hover:bg-gray-100">
              <Camera className="h-4 w-4" />
            </button>
            <button type="button" className="rounded border border-gray-200 p-1.5 hover:bg-gray-100">
              <Upload className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary header row */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div>
          <label className="block text-[10px] font-medium text-black">BARCODE</label>
          <div className="flex">
            <input
              className={inputClass}
              value={form.barcode}
              onChange={(e) => update({ barcode: e.target.value })}
              placeholder="Barcode"
            />
            <button type="button" className="rounded-r border border-l-0 border-gray-200 p-1.5 hover:bg-gray-100">
              <Barcode className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-black">HALLMARK UID</label>
          <input
            className={inputClass}
            value={form.hallmarkUid}
            onChange={(e) => update({ hallmarkUid: e.target.value })}
            placeholder="Hallmark UID"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-black">MFG DATE</label>
          <div className="flex gap-1">
            <input placeholder="DD" className={inputClass} value={form.mfgDateDD} onChange={(e) => update({ mfgDateDD: e.target.value })} maxLength={2} />
            <input placeholder="MON" className={inputClass} value={form.mfgDateMM} onChange={(e) => update({ mfgDateMM: e.target.value })} />
            <input placeholder="YYYY" className={inputClass} value={form.mfgDateYYYY} onChange={(e) => update({ mfgDateYYYY: e.target.value })} maxLength={4} />
          </div>
        </div>
      </div>

      {/* Single merged block: product detail + second row + stone (opens in same block when STONE clicked) */}
      <div className="overflow-x-auto rounded border border-amber-200 bg-white">
        {/* Product detail — header row */}
        <div className="min-w-[900px] flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-amber-200 bg-amber-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-800">
          <span>CATEGORY</span>
          <span>NAME</span>
          <span>QTY</span>
          <span>GS WT</span>
          <span>LESS WT</span>
          <span>PKT WT</span>
          <span>NT WT</span>
          <span>TAG WT</span>
          <span>PURITY</span>
          <span>WST</span>
          <span>F.PURITY</span>
          <span>FN WT</span>
          <span>CW</span>
          <span>FFN WT</span>
          <span>LBR CHRG</span>
          <span>MKG CHRG</span>
        </div>
        {/* Product detail — data row */}
        <div className="min-w-[900px] flex flex-wrap gap-2 border-b border-amber-100 p-2">
          <input placeholder="Category" className={`${inputClass} w-20`} value={form.category} onChange={(e) => update({ category: e.target.value })} />
          <input placeholder="Name" className={`${inputClass} w-24`} value={form.name} onChange={(e) => update({ name: e.target.value })} />
          <input type="number" className={`${inputClass} w-14`} value={form.qty === 0 || form.qty === 1 ? "" : form.qty} onChange={(e) => update({ qty: Number(e.target.value) || 0 })} placeholder="1" />
          <input type="number" className={`${inputClass} w-16`} value={form.gsWt || ""} onChange={(e) => update({ gsWt: Number(e.target.value) || 0 })} placeholder="GS WT GM" />
          <input type="number" className={`${inputClass} w-16`} value={form.lessWt || ""} onChange={(e) => update({ lessWt: Number(e.target.value) || 0 })} placeholder="LESS WT" />
          <input type="number" className={`${inputClass} w-16`} value={form.pktWt || ""} onChange={(e) => update({ pktWt: Number(e.target.value) || 0 })} placeholder="PKT WT GM" />
          <input type="number" className={`${inputClass} w-16`} value={form.ntWt || ""} onChange={(e) => update({ ntWt: Number(e.target.value) || 0 })} placeholder="NT WT GM" />
          <input type="number" className={`${inputClass} w-14`} value={form.tagWt || ""} onChange={(e) => update({ tagWt: Number(e.target.value) || 0 })} placeholder="TAG WT" />
          <input type="number" className={`${inputClass} w-12`} value={form.purity === 0 || form.purity === 92 ? "" : form.purity} onChange={(e) => update({ purity: Number(e.target.value) || 0 })} placeholder="92" />
          <input type="number" className={`${inputClass} w-12`} value={form.wst || ""} onChange={(e) => update({ wst: Number(e.target.value) || 0 })} placeholder="LP" />
          <input type="number" className={`${inputClass} w-12`} value={form.fPurity === 0 || form.fPurity === 96 ? "" : form.fPurity} onChange={(e) => update({ fPurity: Number(e.target.value) || 0 })} placeholder="96" />
          <input type="number" className={`${inputClass} w-14`} value={form.fnWt || ""} onChange={(e) => update({ fnWt: Number(e.target.value) || 0 })} placeholder="7.000" />
          <input type="number" className={`${inputClass} w-12`} value={form.cw || ""} onChange={(e) => update({ cw: Number(e.target.value) || 0 })} placeholder="0" />
          <input type="number" className={`${inputClass} w-14`} value={form.ffnWt || ""} onChange={(e) => update({ ffnWt: Number(e.target.value) || 0 })} placeholder="7.000" />
          <input type="number" className={`${inputClass} w-20`} value={form.lbrChrg || ""} onChange={(e) => update({ lbrChrg: Number(e.target.value) || 0 })} placeholder="LAB CH GM" />
          <input type="number" className={`${inputClass} w-20`} value={form.mkgChrg || ""} onChange={(e) => update({ mkgChrg: Number(e.target.value) || 0 })} placeholder="MKG CH GM" />
        </div>
        {/* Second row — single horizontal row like header: 7113, hallmark, oth, gm, DETAILS, STONE, VALUATION, TOT LAB, FINAL AMT, checkbox */}
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-amber-100 bg-amber-50/30 p-2">
          <input className={`${inputClass} w-16 shrink-0`} value={form.modelNo} onChange={(e) => update({ modelNo: e.target.value })} placeholder="7113" />
          <span className="shrink-0 text-xs text-black">TOT HALLMARK CHRGS</span>
          <input type="number" className={`${inputClass} w-14 shrink-0`} value={form.othCh || ""} onChange={(e) => update({ othCh: Number(e.target.value) || 0 })} placeholder="OTH CH" />
          <span className="shrink-0 text-xs text-black">GM —</span>
          <Button variant="outline" size="sm" className="min-h-8 shrink-0 rounded-full border-amber-500 text-amber-700">
            DETAILS
          </Button>
          <button
            type="button"
            onClick={() => setShowStoneRow(!showStoneRow)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-400 text-navy-800 hover:bg-amber-500"
            title="Stone"
          >
            <Gem className="h-4 w-4" />
          </button>
          <div className="flex shrink-0 items-center gap-2">
            <div className="rounded border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-black">VALUATION</label>
              <input
                type="number"
                step="0.01"
                value={form.valuation === 0 ? "" : form.valuation}
                onChange={(e) => update({ valuation: Number(e.target.value) || 0 })}
                placeholder={(form.ntWt * (form.metalRate || 0)).toFixed(2)}
                className="w-20 border-0 p-0 text-xs font-medium text-gray-900 focus:ring-0"
              />
            </div>
            <div className="rounded border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-black">TOT LAB</label>
              <input
                type="number"
                step="0.01"
                value={form.totLab === 0 ? "" : form.totLab}
                onChange={(e) => update({ totLab: Number(e.target.value) || 0 })}
                placeholder={((form.lbrChrg || 0) + (form.mkgChrg || 0)).toFixed(2)}
                className="w-20 border-0 p-0 text-xs font-medium text-gray-900 focus:ring-0"
              />
            </div>
            <div className="rounded border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-black">FINAL AMT</label>
              <input
                type="number"
                step="0.01"
                value={form.finalAmt === 0 ? "" : form.finalAmt}
                onChange={(e) => update({ finalAmt: Number(e.target.value) || 0 })}
                placeholder={((form.valuation || form.ntWt * (form.metalRate || 0)) + (form.totLab || (form.lbrChrg || 0) + (form.mkgChrg || 0))).toFixed(2)}
                className="w-20 border-0 p-0 text-xs font-medium text-gray-900 focus:ring-0"
              />
            </div>
          </div>
          <input type="checkbox" className="h-4 w-4 shrink-0" />
        </div>
        {/* Stone detail — opens in same block when STONE clicked */}
        {showStoneRow && (
          <div className="border-t border-amber-200">
            <StockStoneRow
              stones={stones}
              onChange={setStones}
              categoryLabel="CATEGORY"
            />
          </div>
        )}
      </div>

      {/* Bottom: only SUBMIT; ADD STOCK appears in review table after submit */}
      <div className="flex justify-end">
        <Button size="sm" className="min-h-10 min-w-[120px]" onClick={handleSubmit}>
          SUBMIT
        </Button>
      </div>

      {/* Review table — after submit, details appear here; ADD STOCK adds to main stock */}
      {pendingEntries.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="mb-2 text-sm font-medium text-green-800">
            Review before adding to stock — click ADD STOCK to add each item to main stock
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-green-200 text-left font-semibold text-green-900">
                  <th className="p-2">Product</th>
                  <th className="p-2">Metal</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Valuation</th>
                  <th className="p-2">Final Amt</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingEntries.map((e) => (
                  <tr key={e.id} className="border-b border-green-100">
                    <td className="p-2">{e.name || e.productCode}</td>
                    <td className="p-2">{e.metal}</td>
                    <td className="p-2">{e.qty}</td>
                    <td className="p-2">{e.valuation}</td>
                    <td className="p-2">{e.finalAmt}</td>
                    <td className="p-2 flex gap-1">
                      <Button size="sm" className="h-7 bg-green-600 text-white" onClick={() => confirmEntry(e.id)}>ADD STOCK</Button>
                      <Button size="sm" variant="outline" className="h-7 border-red-300 text-red-600" onClick={() => deletePending(e.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
