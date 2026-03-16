"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Package, ArrowLeft, ArrowRight } from "lucide-react";
import { Button, Card, CardBody, CardHeader, CardTitle } from "@jewellery-retail/ui";
import { useRawMetalStore } from "@/src/store/stock-store";
import type { MetalType } from "@/src/types/stock";
import { METAL_OPTIONS } from "@/src/types/stock";
import { MONTHS } from "@/src/types/firm";

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";

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
    <div className="relative flex min-w-0 flex-col gap-6">
      <p className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="inline-block h-4 w-4 rounded-full bg-amber-100 text-center text-[10px] leading-4 text-amber-600" aria-hidden>i</span>
        <span>Fields marked in <span className="font-medium text-red-500">red</span> are required.</span>
      </p>

      {/* Card 1: Bill & Header */}
      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Add Raw Metal Stock</CardTitle>
            <p className="text-sm text-zinc-500">Bill date, firm and seller details</p>
          </div>
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
              <input className={inputClass} value={form.firm} onChange={(e) => update({ firm: e.target.value })} placeholder="Firm" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Brand / Seller Name</label>
              <input className={inputClass} value={form.brandSellerName} onChange={(e) => update({ brandSellerName: e.target.value })} placeholder="Brand" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Card 2: Metal Details */}
      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Package className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Metal Details</CardTitle>
            <p className="text-sm text-zinc-500">Weights, purity, tax and charges</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="rounded-lg border border-zinc-100 bg-white p-4">
            <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Metal</label>
                <select className={inputClass} value={form.metalType} onChange={(e) => update({ metalType: e.target.value as MetalType })}>
                  {METAL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Qty</label>
                <input type="number" className={inputClass} value={form.qty || ""} onChange={(e) => update({ qty: Number(e.target.value) || 0 })} placeholder="Qty" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">GS WT</label>
                <input type="number" className={inputClass} value={form.gsWt || ""} onChange={(e) => update({ gsWt: Number(e.target.value) || 0 })} placeholder="Gross weight" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Purity</label>
                <input type="number" className={inputClass} value={form.purity || ""} onChange={(e) => update({ purity: Number(e.target.value) || 0 })} placeholder="Purity" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">WSTG</label>
                <input type="number" className={inputClass} value={form.wstg || ""} onChange={(e) => update({ wstg: Number(e.target.value) || 0 })} placeholder="WSTG" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Tot / Lab Chrgs</label>
                <input type="number" className={inputClass} value={form.totLabChrgs || ""} onChange={(e) => update({ totLabChrgs: Number(e.target.value) || 0 })} placeholder="Total lab charges" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">CGST</label>
                <input type="number" className={inputClass} value={form.cgst || ""} onChange={(e) => update({ cgst: Number(e.target.value) || 0 })} placeholder="CGST" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">SGST</label>
                <input type="number" className={inputClass} value={form.sgst || ""} onChange={(e) => update({ sgst: Number(e.target.value) || 0 })} placeholder="SGST" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">IGST</label>
                <input type="number" className={inputClass} value={form.igst || ""} onChange={(e) => update({ igst: Number(e.target.value) || 0 })} placeholder="IGST" />
              </div>
            </div>
            <div className="mt-4 grid min-w-0 grid-cols-2 gap-4 border-t border-zinc-100 pt-4 sm:grid-cols-3 md:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Type</label>
                <input className={`${inputClass} bg-gray-50`} placeholder="RAW GOLD" readOnly />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Testbar</label>
                <input className={inputClass} placeholder="Testbar" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">HSN</label>
                <input className={inputClass} placeholder="HSN" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Less WT</label>
                <input type="number" className={inputClass} value={form.lessWt || ""} onChange={(e) => update({ lessWt: Number(e.target.value) || 0 })} placeholder="Less weight" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">NT WT</label>
                <input type="number" className={inputClass} value={form.ntWt || ""} onChange={(e) => update({ ntWt: Number(e.target.value) || 0 })} placeholder="Net weight" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Lb Chrg</label>
                <input className={inputClass} placeholder="Labor charge" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Tot Lab</label>
                <input className={inputClass} placeholder="Total lab" />
              </div>
              <div className="flex items-end">
                <Button type="button" variant="outline" size="sm" className="min-h-[44px] border-purple-200 text-purple-700 hover:bg-purple-50">
                  STONE
                </Button>
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

      {pendingEntries.length > 0 && (
        <Card className="min-w-0" padding="lg">
          <CardHeader className="border-b border-zinc-100 pb-4">
            <CardTitle className="text-lg font-semibold text-zinc-900">Review before adding</CardTitle>
            <p className="text-sm text-zinc-500">Click ADD to confirm each item</p>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left font-semibold text-zinc-700">
                    <th className="p-3">Metal</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">NT WT</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEntries.map((e) => (
                    <tr key={e.id} className="border-b border-zinc-100">
                      <td className="p-3">{e.metalType}</td>
                      <td className="p-3">{e.qty}</td>
                      <td className="p-3">{e.ntWt}</td>
                      <td className="flex gap-2 p-3">
                        <Button size="sm" className="bg-green-600 text-white hover:bg-green-700" onClick={() => confirmEntry(e.id)}>ADD</Button>
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
