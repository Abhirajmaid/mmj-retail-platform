"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Upload, Barcode, Gem, FileText, Package, ArrowLeft, ArrowRight } from "lucide-react";
import { Button, Card, CardBody, CardHeader, CardTitle } from "@jewellery-retail/ui";
import { useFineStockStore } from "@/src/store/stock-store";
import type { FineStockEntry, MetalType, StoneDetail } from "@/src/types/stock";
import { METAL_OPTIONS } from "@/src/types/stock";
import { MONTHS } from "@/src/types/firm";
import { StockStoneRow } from "../StockStoneRow";
import { GoldStockListTable } from "../transfer/GoldStockListTable";

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

  const [showGoldList, setShowGoldList] = useState(false);
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

  if (showGoldList) {
    return (
      <div className="relative flex min-w-0 flex-col gap-6">
        <GoldStockListTable onBack={() => setShowGoldList(false)} showBackButton />
      </div>
    );
  }

  return (
    <div className="relative flex min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-end">
        <button
          type="button"
          onClick={() => setShowGoldList(true)}
          className="min-h-[44px] rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-900 hover:bg-amber-600"
        >
          ALL GOLD STOCK LIST
        </button>
      </div>
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
              <div className="flex gap-2">
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
              <label className="mb-1 block text-xs font-medium text-zinc-900">Firm</label>
              <input
                className={inputClass}
                value={form.firm}
                onChange={(e) => update({ firm: e.target.value })}
                placeholder="Firm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Metal / Rate</label>
              <div className="flex gap-2">
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
              <input
                className={inputClass}
                value={form.brandSellerName}
                onChange={(e) => update({ brandSellerName: e.target.value })}
                placeholder="Brand"
              />
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
              <input
                className={inputClass}
                value={form.genderBis}
                onChange={(e) => update({ genderBis: e.target.value })}
                placeholder="Gender"
              />
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
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Mfg Date</label>
              <div className="flex gap-2">
                <input placeholder="DD" className={inputClass} value={form.mfgDateDD} onChange={(e) => update({ mfgDateDD: e.target.value })} maxLength={2} />
                <input placeholder="MON" className={inputClass} value={form.mfgDateMM} onChange={(e) => update({ mfgDateMM: e.target.value })} />
                <input placeholder="YYYY" className={inputClass} value={form.mfgDateYYYY} onChange={(e) => update({ mfgDateYYYY: e.target.value })} maxLength={4} />
              </div>
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
          <div className="rounded-lg border border-zinc-100 bg-white p-4">
            <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
                <label className="mb-1 block text-xs font-medium text-zinc-900">NT WT</label>
                <input type="number" className={inputClass} value={form.ntWt || ""} onChange={(e) => update({ ntWt: Number(e.target.value) || 0 })} placeholder="Net weight" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Tag WT</label>
                <input type="number" className={inputClass} value={form.tagWt || ""} onChange={(e) => update({ tagWt: Number(e.target.value) || 0 })} placeholder="Tag weight" />
              </div>
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
                <input type="number" className={inputClass} value={form.fPurity === 0 || form.fPurity === 96 ? "" : form.fPurity} onChange={(e) => update({ fPurity: Number(e.target.value) || 0 })} placeholder="96" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">FN WT</label>
                <input type="number" className={inputClass} value={form.fnWt || ""} onChange={(e) => update({ fnWt: Number(e.target.value) || 0 })} placeholder="Fine weight" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">CW</label>
                <input type="number" className={inputClass} value={form.cw || ""} onChange={(e) => update({ cw: Number(e.target.value) || 0 })} placeholder="0" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">FFN WT</label>
                <input type="number" className={inputClass} value={form.ffnWt || ""} onChange={(e) => update({ ffnWt: Number(e.target.value) || 0 })} placeholder="FFN weight" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Lbr Chrg</label>
                <input type="number" className={inputClass} value={form.lbrChrg || ""} onChange={(e) => update({ lbrChrg: Number(e.target.value) || 0 })} placeholder="Labor charge" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Mkg Chrg</label>
                <input type="number" className={inputClass} value={form.mkgChrg || ""} onChange={(e) => update({ mkgChrg: Number(e.target.value) || 0 })} placeholder="Making charge" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-end gap-4 border-t border-zinc-100 pt-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Model No</label>
                <input className={inputClass} value={form.modelNo} onChange={(e) => update({ modelNo: e.target.value })} placeholder="Model No" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Tot Hallmark Chrgs</label>
                <input type="number" className={inputClass} value={form.othCh || ""} onChange={(e) => update({ othCh: Number(e.target.value) || 0 })} placeholder="Total hallmark charges" />
              </div>
              <div className="flex items-end gap-2">
                <Button type="button" variant="outline" size="sm" className="min-h-[44px] shrink-0 border-amber-400 text-amber-700 hover:bg-amber-50">
                  DETAILS
                </Button>
                <button
                  type="button"
                  onClick={() => setShowStoneRow(!showStoneRow)}
                  className="flex h-[44px] w-10 shrink-0 items-center justify-center rounded-lg border-2 border-amber-500 bg-amber-400 text-navy-800 hover:bg-amber-500"
                  title="Stone"
                >
                  <Gem className="h-4 w-4" />
                </button>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Valuation</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.valuation === 0 ? "" : form.valuation}
                  onChange={(e) => update({ valuation: Number(e.target.value) || 0 })}
                  placeholder={(form.ntWt * (form.metalRate || 0)).toFixed(2)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Tot Lab</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.totLab === 0 ? "" : form.totLab}
                  onChange={(e) => update({ totLab: Number(e.target.value) || 0 })}
                  placeholder={((form.lbrChrg || 0) + (form.mkgChrg || 0)).toFixed(2)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-900">Final Amt</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.finalAmt === 0 ? "" : form.finalAmt}
                  onChange={(e) => update({ finalAmt: Number(e.target.value) || 0 })}
                  placeholder={((form.valuation || form.ntWt * (form.metalRate || 0)) + (form.totLab || (form.lbrChrg || 0) + (form.mkgChrg || 0))).toFixed(2)}
                  className={inputClass}
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="mr-2 block text-xs font-medium text-zinc-900">Include</label>
                <input type="checkbox" className="h-4 w-4" />
              </div>
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
