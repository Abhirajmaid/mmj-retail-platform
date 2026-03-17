"use client";

export function ReminderTab() {
  return (
    <div
      className="fixed left-0 top-1/2 z-10 -translate-y-1/2"
      style={{ writingMode: "vertical-rl" }}
    >
      <button
        type="button"
        className="rounded-r border border-l-0 border-slate-200 bg-slate-50 px-2 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600 shadow-sm hover:bg-slate-100"
        title="Reminder"
      >
        REMINDER
      </button>
    </div>
  );
}
