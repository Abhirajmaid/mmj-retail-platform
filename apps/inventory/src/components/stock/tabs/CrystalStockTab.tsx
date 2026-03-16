"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Upload, FileText, Gem, ArrowLeft, ArrowRight } from "lucide-react";
import { Button, Card, CardBody, CardHeader, CardTitle } from "@jewellery-retail/ui";
import { useCrystalStore } from "@/src/store/stock-store";
import { MONTHS } from "@/src/types/firm";

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";

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
    <div className="relative flex min-w-0 flex-col gap-6">
      <p className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="inline-block h-4 w-4 rounded-full bg-amber-100 text-center text-[10px] leading-4 text-amber-600" aria-hidden>i</span>
        <span>Fields marked in <span className="font-medium text-red-500">red</span> are required.</span>
      </p>

      {/* Card 1: Bill & Header */}
      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-4">
          <div className="flex flex-row items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg font-semibold text-zinc-900">Add Crystal Stock</CardTitle>
              <p className="text-sm text-zinc-500">Bill date, firm, item and images</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
            RETAIL STOCK
          </Button>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Bill Date</label>
              <div className="flex gap-2">
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
              <label className="mb-1 block text-xs font-medium text-zinc-900">Firm</label>
              <input className={inputClass} value={form.firm} onChange={(e) => update({ firm: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Item ID (Stone)</label>
              <input className={inputClass} value={form.itemId} onChange={(e) => update({ itemId: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Brand / Seller Name</label>
              <input className={inputClass} value={form.brandSellerName} onChange={(e) => update({ brandSellerName: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Gender</label>
              <input className={inputClass} value={form.gender} onChange={(e) => update({ gender: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Images / Photos</label>
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
        </CardBody>
      </Card>

      {/* Card 2: Crystal Details */}
      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Gem className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Crystal Details</CardTitle>
            <p className="text-sm text-zinc-500">Category, shape, size, rates and tax</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="rounded-lg border border-zinc-100 bg-white p-4">
            <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Crystal Name</label>
                <input className={inputClass} value={form.crystalName} onChange={(e) => update({ crystalName: e.target.value })} placeholder="Crystal name" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Size</label>
                <input className={inputClass} value={form.size} onChange={(e) => update({ size: e.target.value })} placeholder="Size" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Color</label>
                <input className={inputClass} value={form.color} onChange={(e) => update({ color: e.target.value })} placeholder="Color" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Other Info</label>
                <input className={inputClass} placeholder="Other info" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Product Details</label>
                <input className={inputClass} placeholder="Product details" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">CGST %</label>
                <input type="number" className={inputClass} value={form.cgstPct || ""} onChange={(e) => update({ cgstPct: Number(e.target.value) || 0 })} placeholder="CGST %" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">CGST Amt</label>
                <input type="number" className={inputClass} value={form.cgstAmt || ""} onChange={(e) => update({ cgstAmt: Number(e.target.value) || 0 })} placeholder="CGST Amt" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">SGST %</label>
                <input type="number" className={inputClass} value={form.sgstPct || ""} onChange={(e) => update({ sgstPct: Number(e.target.value) || 0 })} placeholder="SGST %" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">SGST Amt</label>
                <input type="number" className={inputClass} value={form.sgstAmt || ""} onChange={(e) => update({ sgstAmt: Number(e.target.value) || 0 })} placeholder="SGST Amt" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">IGST %</label>
                <input type="number" className={inputClass} value={form.igstPct || ""} onChange={(e) => update({ igstPct: Number(e.target.value) || 0 })} placeholder="IGST %" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">IGST Amt</label>
                <input type="number" className={inputClass} value={form.igstAmt || ""} onChange={(e) => update({ igstAmt: Number(e.target.value) || 0 })} placeholder="IGST Amt" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Total Tax</label>
                <input type="number" className={`${inputClass} bg-gray-50`} value={form.totalTax || ""} placeholder="Total tax" readOnly />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Final Val</label>
                <input type="number" className={`${inputClass} bg-gray-50`} value={form.finalVal || ""} placeholder="Final val" readOnly />
              </div>
            </div>
            <div className="mt-4 grid min-w-0 grid-cols-2 gap-4 border-t border-zinc-100 pt-4 sm:grid-cols-3 md:grid-cols-6">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Qty</label>
                <input type="number" className={inputClass} value={form.qty || ""} onChange={(e) => update({ qty: Number(e.target.value) || 0 })} placeholder="Qty" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">GS WT</label>
                <input type="number" className={inputClass} value={form.gsWt || ""} onChange={(e) => update({ gsWt: Number(e.target.value) || 0 })} placeholder="Gross weight" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">CT</label>
                <input type="number" className={inputClass} value={form.ct || ""} onChange={(e) => update({ ct: Number(e.target.value) || 0 })} placeholder="CT" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Purchase Rate</label>
                <input type="number" className={inputClass} value={form.purchaseRate || ""} onChange={(e) => update({ purchaseRate: Number(e.target.value) || 0 })} placeholder="Pur rate" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Sell Rate</label>
                <input type="number" className={inputClass} value={form.sellRate || ""} onChange={(e) => update({ sellRate: Number(e.target.value) || 0 })} placeholder="Sell rate" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Valuation</label>
                <input type="number" className={`${inputClass} bg-gray-50`} value={form.valuation || ""} placeholder="Valuation" readOnly />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Footer actions */}
      <div className="flex flex-col gap-3 border-t border-zinc-100 bg-white pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/stock" className="order-2 sm:order-1">
          <Button type="button" variant="ghost" className="min-h-[44px] w-full sm:min-h-9 sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </Link>
        <div className="order-1 flex flex-wrap justify-end gap-2 sm:order-2">
          <Button variant="outline" className="min-h-[44px] border-amber-400 text-amber-700 hover:bg-amber-50 sm:min-h-9">
            Purchase on Cash
          </Button>
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
                    <th className="p-3">Crystal</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Valuation</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEntries.map((e) => (
                    <tr key={e.id} className="border-b border-zinc-100">
                      <td className="p-3">{e.crystalName}</td>
                      <td className="p-3">{e.qty}</td>
                      <td className="p-3">{e.valuation}</td>
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
