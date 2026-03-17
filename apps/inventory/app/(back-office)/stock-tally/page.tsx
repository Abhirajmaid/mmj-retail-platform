"use client";

import Link from "next/link";
import { PageHeader } from "@jewellery-retail/ui";
import { LayoutGrid, ChevronRight } from "lucide-react";

export default function StockTallyPage() {
  return (
    <div className="min-w-0 max-w-full space-y-4 bg-transparent sm:space-y-6">
      <PageHeader
        title="Stock Tally"
        description="Daily physical verification — reconcile physical stock with system records using RFID, barcode, images, or tables."
      />

      <div className="flex justify-start">
        <Link href="/stock-tally/rfid-barcode" className="block max-w-2xl">
          <div className="flex cursor-pointer items-center gap-5 rounded-[28px] border border-[#1E3A8A]/20 bg-[#1E3A8A] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06),0_24px_60px_-28px_rgba(15,23,42,0.14)] transition hover:bg-[#1E3A8A]/95 hover:shadow-md">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
              <LayoutGrid className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                Stock Tally
              </p>
              <h2 className="mt-2 text-xl font-bold uppercase tracking-wide text-white">
                RFID / Barcode Stock Tally
              </h2>
              <p className="mt-1 text-sm text-white/90">
                Stock Tally by RFID / Barcode.
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
              <ChevronRight className="h-5 w-5" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
