"use client";

export interface TransferSummaryRowProps {
  prevCounter: string | null;
  newCounter: string | null;
  prevStaff: string | null;
  newStaff: string | null;
  prevFirm: string | null;
  newFirm: string | null;
}

export function TransferSummaryRow({
  prevCounter,
  newCounter,
  prevStaff,
  newStaff,
  prevFirm,
  newFirm,
}: TransferSummaryRowProps) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          CURRENT COUNTER → TRANSFERING COUNTER
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-800">
          {prevCounter ?? "—"} → {newCounter ?? "—"}
        </p>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
          CURRENT STAFF → TRANSFERING STAFF
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-800">
          {prevStaff ?? "—"} → {newStaff ?? "—"}
        </p>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          CURRENT FIRM → TRANSFERING FIRM
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-800">
          {prevFirm ?? "—"} → {newFirm ?? "—"}
        </p>
      </div>
    </div>
  );
}
