"use client";

import { useState } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@jewellery-retail/ui";
import { useCrystalStore } from "@/src/store/stock-store";
import { MONTHS } from "@/src/types/firm";

const inputClass =
  "h-7 min-w-0 rounded border border-gray-200 px-2 py-0.5 text-xs focus:ring-1 focus:ring-amber-400 outline-none";

export function CrystalStockTab() {
  const addPending = useCrystalStore((s) => s.addPending);
  const pendingEntries = useCrystalStore((s) => s.pendingEntries);
  const confirmEntry = useCrystalStore((s) => s.confirmEntry);
  const deletePending = useCrystalStore((s) => s.deletePending);

  const [form, setForm] = useState({
    billDateDD: "",
    billDateMM: "",
    billDateYYYY: "",
    firm: "OM3",
    itemId: "1",
    brandSellerName: "",
    gender: "",
    crystalCategory: "",
    crystalName: "",
    shape: "",
    size: "",
    clarity: "",
    color: "",
    qty: 0,
    gsWt: 0,
    ct: 0,
    purchaseRate: 0,
    sellRate: 0,
    valuation: 0,
    cgstPct: 0,
    cgstAmt: 0,
    sgstPct: 0,
    sgstAmt: 0,
    igstPct: 0,
    igstAmt: 0,
    totalTax: 0,
    finalVal: 0,
  });

  const update = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = () => {
    const billDate = [form.billDateDD, form.billDateMM, form.billDateYYYY]
      .filter(Boolean)
      .join("-");
    const valuation = form.gsWt * (form.purchaseRate || 0);
    const totalTax = (form.cgstAmt || 0) + (form.sgstAmt || 0) + (form.igstAmt || 0);
    const finalVal = valuation + totalTax;

    addPending({
      billDate: billDate || new Date().toISOString().slice(0, 10),
      firm: form.firm,
      itemId: form.itemId,
      brandSellerName: form.brandSellerName,
      gender: form.gender,
      photos: [],
      crystalCategory: form.crystalCategory,
      crystalName: form.crystalName,
      shape: form.shape,
      size: form.size,
      clarity: form.clarity,
      color: form.color,
      qty: form.qty,
      gsWt: form.gsWt,
      ct: form.ct,
      purchaseRate: form.purchaseRate,
      sellRate: form.sellRate,
      valuation,
      cgstPct: form.cgstPct,
      cgstAmt: form.cgstAmt,
      sgstPct: form.sgstPct,
      sgstAmt: form.sgstAmt,
      igstPct: form.igstPct,
      igstAmt: form.igstAmt,
      totalTax,
      finalVal,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" size="sm" className="min-h-10 border-amber-500 bg-amber-50">RETAIL STOCK</Button>
      </div>

      <div className="rounded border border-amber-200 bg-amber-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-800">
        ADD CRYSTAL
      </div>

      {/* Header row */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
        <div>
          <label className="block text-[10px] font-medium text-gray-500">BILL DATE</label>
          <div className="flex gap-1">
            <input placeholder="DD" className={inputClass} value={form.billDateDD} onChange={(e) => update({ billDateDD: e.target.value })} maxLength={2} />
            <select className={inputClass} value={form.billDateMM} onChange={(e) => update({ billDateMM: e.target.value })}>
              <option value="">MON</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input placeholder="YYYY" className={inputClass} value={form.billDateYYYY} onChange={(e) => update({ billDateYYYY: e.target.value })} maxLength={4} />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500">FIRM</label>
          <input className={inputClass} value={form.firm} onChange={(e) => update({ firm: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500">ITEM ID (STONE)</label>
          <input type="number" className={inputClass} value={form.itemId} onChange={(e) => update({ itemId: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500">BRAND/SELLER NAME</label>
          <input className={inputClass} value={form.brandSellerName} onChange={(e) => update({ brandSellerName: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500">GENDER</label>
          <input className={inputClass} value={form.gender} onChange={(e) => update({ gender: e.target.value })} />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500">IMAGES/PHOTOS</label>
          <div className="flex gap-1">
            <button type="button" className="rounded border border-gray-200 p-1.5 hover:bg-gray-100"><Camera className="h-4 w-4" /></button>
            <button type="button" className="rounded border border-gray-200 p-1.5 hover:bg-gray-100"><Upload className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Crystal details table */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px] rounded border border-amber-200">
          <div className="border-b border-amber-200 bg-amber-100 px-2 py-2 text-[10px] font-semibold uppercase text-navy-800">
            CRY CATE/NAME | SHAPE/SIZE | CLARITY/COLOR | QTY/WEIGHT/OTH INFO | PURCHASE RATE | SALE RATE | VALUATION
          </div>
          <div className="border-b border-amber-100 bg-amber-50/50 px-2 py-1 text-[10px] text-navy-700">
            STONE | SHAPE | CLARITY | QTY | GS WT | CT | PUR RATE | CT | SELL RATE | CT | VALUATION
          </div>
          <div className="flex flex-wrap gap-2 bg-white p-2">
            <input className={inputClass} value={form.crystalName} onChange={(e) => update({ crystalName: e.target.value })} placeholder="CRYSTAL NAME" />
            <input className={inputClass} value={form.size} onChange={(e) => update({ size: e.target.value })} placeholder="SIZE" />
            <input className={inputClass} value={form.color} onChange={(e) => update({ color: e.target.value })} placeholder="COLOR" />
            <input className={inputClass} placeholder="OTHER INFO" />
            <input className={inputClass} placeholder="PRODUCT DETAILS" />
            <input type="number" className={inputClass} value={form.cgstPct || ""} onChange={(e) => update({ cgstPct: Number(e.target.value) || 0 })} placeholder="CGST %" />
            <input type="number" className={inputClass} value={form.cgstAmt || ""} onChange={(e) => update({ cgstAmt: Number(e.target.value) || 0 })} placeholder="CGST AMT" />
            <input type="number" className={inputClass} value={form.sgstPct || ""} onChange={(e) => update({ sgstPct: Number(e.target.value) || 0 })} placeholder="SGST %" />
            <input type="number" className={inputClass} value={form.sgstAmt || ""} onChange={(e) => update({ sgstAmt: Number(e.target.value) || 0 })} placeholder="SGST AMT" />
            <input type="number" className={inputClass} value={form.igstPct || ""} onChange={(e) => update({ igstPct: Number(e.target.value) || 0 })} placeholder="IGST %" />
            <input type="number" className={inputClass} value={form.igstAmt || ""} onChange={(e) => update({ igstAmt: Number(e.target.value) || 0 })} placeholder="IGST AMT" />
            <input type="number" className={inputClass} value={form.totalTax || ""} placeholder="TOTAL TA" readOnly />
            <input type="number" className={inputClass} value={form.finalVal || ""} placeholder="Fnl val=Tx+VIN" readOnly />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-amber-100 bg-white p-2">
            <input type="number" className={inputClass} value={form.qty || ""} onChange={(e) => update({ qty: Number(e.target.value) || 0 })} placeholder="QTY" />
            <input type="number" className={inputClass} value={form.gsWt || ""} onChange={(e) => update({ gsWt: Number(e.target.value) || 0 })} placeholder="GS WT" />
            <input type="number" className={inputClass} value={form.ct || ""} onChange={(e) => update({ ct: Number(e.target.value) || 0 })} placeholder="CT" />
            <input type="number" className={inputClass} value={form.purchaseRate || ""} onChange={(e) => update({ purchaseRate: Number(e.target.value) || 0 })} placeholder="PUR RATE" />
            <input type="number" className={inputClass} value={form.sellRate || ""} onChange={(e) => update({ sellRate: Number(e.target.value) || 0 })} placeholder="SELL RATE" />
            <input type="number" className={inputClass} value={form.valuation || ""} placeholder="VALUATION" readOnly />
          </div>
        </div>
      </div>

      {/* Bottom: only SUBMIT; ADD STOCK appears in review table after submit (same flow as Fine Stock) */}
      <div className="flex gap-2">
        <Button variant="outline" className="border-yellow-500 text-yellow-700">PURCHASE ON CASH</Button>
        <Button onClick={handleSubmit}>SUBMIT</Button>
      </div>

      {/* Review table — after submit, click ADD STOCK to add each item to main stock */}
      {pendingEntries.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="mb-2 text-sm font-medium text-green-800">
            Review before adding to stock — click ADD STOCK to add each item to main stock
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-green-200 text-left font-semibold text-green-900">
                  <th className="p-2">Crystal</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Valuation</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingEntries.map((e) => (
                  <tr key={e.id} className="border-b border-green-100">
                    <td className="p-2">{e.crystalName}</td>
                    <td className="p-2">{e.qty}</td>
                    <td className="p-2">{e.valuation}</td>
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
