"use client";

import Link from "next/link";
import { Button } from "@jewellery-retail/ui";
import { useFirmStore } from "@/src/store/firm-store";
import { FirmReviewCard } from "@/src/components/firm/FirmReviewCard";

export default function FirmReviewPage() {
  const { firms, deleteFirm } = useFirmStore();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-zinc-950">
          MY FIRMS
        </h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#0891B2]/30 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0891B2] text-white">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Firm Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Firm Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {firms.map((firm) => (
              <FirmReviewCard key={firm.id} firm={firm} onDelete={deleteFirm} />
            ))}
          </tbody>
        </table>
      </div>

      {firms.length === 0 && (
        <p className="text-center text-zinc-500">No firms to review. Add firms from the main Firm page.</p>
      )}

      <div className="flex justify-center">
        <Button variant="outline" className="border-amber-400 text-amber-700" asChild>
          <Link href="/firm">Back to Firm Management</Link>
        </Button>
      </div>
    </div>
  );
}
