"use client";

import { Trash2 } from "lucide-react";
import { calculateInvoiceTotal } from "@jewellery-retail/billing";

export default function CartTable({ items, goldRate, onRemove, oldGoldDeduction = 0 }) {
  const rows = items.map((item) => {
    const attr = item.attributes ?? item;
    const grossWeight = attr.gross_weight ?? 0;
    const makingCharge = attr.making_charges ?? 0;
    const stoneCost = attr.stone_cost ?? 0;
    const purity = parseInt((attr.purity ?? "22").replace(/[^0-9]/g, ""), 10);
    const effectiveRate = (goldRate * purity) / 24;

    const totals = calculateInvoiceTotal({
      goldWeight: grossWeight,
      goldRate: effectiveRate,
      makingCharge,
      stoneCost,
    });
    return { ...item, computed: totals, attr };
  });

  const grandTotal = rows.reduce((s, r) => s + r.computed.finalAmount, 0);
  const subtotalAfterOldGold = Math.max(0, grandTotal - oldGoldDeduction);

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-muted-foreground">
              <th className="text-left px-3 py-2.5 font-semibold">Tag / Barcode</th>
              <th className="text-left px-3 py-2.5 font-semibold">Product</th>
              <th className="text-right px-3 py-2.5 font-semibold">Wt (g)</th>
              <th className="text-right px-3 py-2.5 font-semibold">Gold Value</th>
              <th className="text-right px-3 py-2.5 font-semibold">Making</th>
              <th className="text-right px-3 py-2.5 font-semibold">Stone</th>
              <th className="text-right px-3 py-2.5 font-semibold">GST</th>
              <th className="text-right px-3 py-2.5 font-semibold">Total</th>
              <th className="px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-muted-foreground">
                  No items added yet. Scan a barcode or search for an item.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                <td className="px-3 py-2.5 font-mono text-xs">
                  {row.attr.tag_number ?? row.attr.barcode ?? "—"}
                </td>
                <td className="px-3 py-2.5 font-medium truncate max-w-[140px]">
                  {row.attr.product?.data?.attributes?.name ?? row.attr.product_name ?? "Item"}
                </td>
                <td className="px-3 py-2.5 text-right">{(row.attr.gross_weight ?? 0).toFixed(3)}</td>
                <td className="px-3 py-2.5 text-right">₹{row.computed.goldValue.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2.5 text-right">₹{row.computed.makingCharge.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2.5 text-right">₹{(row.attr.stone_cost ?? 0).toLocaleString("en-IN")}</td>
                <td className="px-3 py-2.5 text-right">₹{row.computed.totalGst.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2.5 text-right font-semibold">
                  ₹{row.computed.finalAmount.toLocaleString("en-IN")}
                </td>
                <td className="px-3 py-2.5">
                  <button
                    onClick={() => onRemove?.(row.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-72 bg-white rounded-lg border border-border p-4 text-sm space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>₹{grandTotal.toLocaleString("en-IN")}</span>
          </div>
          {oldGoldDeduction > 0 && (
            <div className="flex justify-between text-amber-600">
              <span>Old Gold Exchange</span>
              <span>- ₹{oldGoldDeduction.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
            <span>Net Payable</span>
            <span>₹{subtotalAfterOldGold.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
