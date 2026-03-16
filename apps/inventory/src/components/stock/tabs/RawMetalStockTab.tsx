"use client";

import { useState } from "react";
import { Button } from "@jewellery-retail/ui";
import { useRawMetalStore } from "@/src/store/stock-store";
import type { MetalType } from "@/src/types/stock";
import { METAL_OPTIONS } from "@/src/types/stock";
import { MONTHS } from "@/src/types/firm";

const inputClass =
  "h-7 min-w-0 rounded border border-gray-200 px-2 py-0.5 text-xs focus:ring-1 focus:ring-amber-400 outline-none";

export function RawMetalStockTab() {
  const addPending = useRawMetalStore((s) => s.addPending);
  const pendingEntries = useRawMetalStore((s) => s.pendingEntries);
  const confirmEntry = useRawMetalStore((s) => s.confirmEntry);
  const deletePending = useRawMetalStore((s) => s.deletePending);

  const [form, setForm] = useState({
    billDateDD: "",
    billDateMM: "",
    billDateYYYY: "",
    firm: "",
    brandSellerName: "",
    metalType: "Gold" as MetalType,
    qty: 0,
    gsWt: 0,
    lessWt: 0,
    ntWt: 0,
    purity: 0,
    wstg: 0,
    totLabChrgs: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
  });

  const update = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = () => {
    const billDate = [form.billDateDD, form.billDateMM, form.billDateYYYY]
      .filter(Boolean)
      .join("-");
    addPending({
      billDate: billDate || new Date().toISOString().slice(0, 10),
      firm: form.firm,
      brandSellerName: form.brandSellerName,
      metalType: form.metalType,
      qty: form.qty,
      gsWt: form.gsWt,
      lessWt: form.lessWt,
      ntWt: form.ntWt,
      purity: form.purity,
      wstg: form.wstg,
      totLabChrgs: form.totLabChrgs,
      cgst: form.cgst,
      sgst: form.sgst,
      igst: form.igst,
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded border border-amber-200 bg-amber-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-800">
        ADD RAW METAL STOCK
      </div>

      {/* Header row */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
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
          <input className={inputClass} value={form.firm} onChange={(e) => update({ firm: e.target.value })} placeholder="Firm" />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-500">BRAND/SELLER NAME</label>
          <input className={inputClass} value={form.brandSellerName} onChange={(e) => update({ brandSellerName: e.target.value })} placeholder="Brand" />
        </div>
      </div>

      {/* Metal details table */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] rounded border border-amber-200">
          <div className="grid grid-cols-10 gap-1 border-b border-amber-200 bg-amber-100 px-2 py-2 text-[10px] font-semibold uppercase text-navy-800">
            <div>METAL DETAILS</div>
            <div>QTY</div>
            <div>WEIGHTS</div>
            <div>PURITY</div>
            <div>WSTG</div>
            <div>TOT/LAB CHRGS</div>
            <div>CGST</div>
            <div>SGST</div>
            <div>IGST</div>
          </div>
          <div className="grid grid-cols-10 gap-1 border-b border-amber-100 bg-white p-2">
            <select className={inputClass} value={form.metalType} onChange={(e) => update({ metalType: e.target.value as MetalType })}>
              {METAL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <input type="number" className={inputClass} value={form.qty || ""} onChange={(e) => update({ qty: Number(e.target.value) || 0 })} placeholder="11173.89" />
            <input type="number" className={inputClass} value={form.gsWt || ""} onChange={(e) => update({ gsWt: Number(e.target.value) || 0 })} placeholder="GS WT GM" />
            <input type="number" className={inputClass} value={form.purity || ""} onChange={(e) => update({ purity: Number(e.target.value) || 0 })} placeholder="TUNCH" />
            <input type="number" className={inputClass} value={form.wstg || ""} onChange={(e) => update({ wstg: Number(e.target.value) || 0 })} placeholder="0" />
            <input type="number" className={inputClass} value={form.totLabChrgs || ""} onChange={(e) => update({ totLabChrgs: Number(e.target.value) || 0 })} placeholder="FN PR%" />
            <input type="number" className={inputClass} value={form.cgst || ""} onChange={(e) => update({ cgst: Number(e.target.value) || 0 })} placeholder="0.00" />
            <input type="number" className={inputClass} value={form.sgst || ""} onChange={(e) => update({ sgst: Number(e.target.value) || 0 })} placeholder="0.00" />
            <input type="number" className={inputClass} value={form.igst || ""} onChange={(e) => update({ igst: Number(e.target.value) || 0 })} placeholder="0.00" />
          </div>
          <div className="grid grid-cols-10 gap-1 bg-white p-2">
            <input className={inputClass} placeholder="RAW GOLD" readOnly />
            <input className={inputClass} placeholder="TESTBAR" />
            <input className={inputClass} placeholder="HSN" />
            <input type="number" className={inputClass} value={form.lessWt || ""} onChange={(e) => update({ lessWt: Number(e.target.value) || 0 })} placeholder="LESS WT" />
            <input type="number" className={inputClass} value={form.ntWt || ""} onChange={(e) => update({ ntWt: Number(e.target.value) || 0 })} placeholder="NT WT" />
            <input className={inputClass} placeholder="0" readOnly />
            <input className={inputClass} placeholder="0" readOnly />
            <input className={inputClass} placeholder="LB CHRG GM" />
            <input className={inputClass} placeholder="TOT LAB C" />
            <button type="button" className="rounded border border-purple-200 bg-purple-50 px-2 py-1 text-xs text-purple-700">💜 STONE</button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleSubmit}>SUBMIT</Button>
      </div>

      {pendingEntries.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="mb-2 text-sm font-medium text-green-800">
            Review before adding — click ADD to confirm each item
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-green-200 text-left font-semibold text-green-900">
                  <th className="p-2">Metal</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">NT WT</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingEntries.map((e) => (
                  <tr key={e.id} className="border-b border-green-100">
                    <td className="p-2">{e.metalType}</td>
                    <td className="p-2">{e.qty}</td>
                    <td className="p-2">{e.ntWt}</td>
                    <td className="p-2 flex gap-1">
                      <Button size="sm" className="h-7 bg-green-600 text-white" onClick={() => confirmEntry(e.id)}>ADD ✓</Button>
                      <Button size="sm" variant="outline" className="h-7 border-red-300 text-red-600" onClick={() => deletePending(e.id)}>Delete 🗑️</Button>
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
