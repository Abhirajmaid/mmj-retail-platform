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
    <div className="grid min-w-0 grid-cols-1 gap-4 rounded-2xl border-0 bg-white p-4 shadow-[0_16px_36px_-24px_rgba(15,23,42,0.45),0_8px_18px_-12px_rgba(15,23,42,0.28)] sm:grid-cols-3">
      <div className="min-w-0 rounded-lg border border-zinc-200 bg-zinc-50/40 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          Current counter &rarr; Transferring counter
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-900">
          {prevCounter ?? "—"} → {newCounter ?? "—"}
        </p>
      </div>
      <div className="min-w-0 rounded-lg border border-zinc-200 bg-zinc-50/40 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
          Current staff &rarr; Transferring staff
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-900">
          {prevStaff ?? "—"} → {newStaff ?? "—"}
        </p>
      </div>
      <div className="min-w-0 rounded-lg border border-zinc-200 bg-zinc-50/40 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          Current firm &rarr; Transferring firm
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-900">
          {prevFirm ?? "—"} → {newFirm ?? "—"}
        </p>
      </div>
    </div>
  );
}
