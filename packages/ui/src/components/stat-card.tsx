import type { LucideIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Card } from "./card";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "space-y-5 overflow-hidden border-zinc-100 bg-white p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="text-[30px] font-semibold leading-none text-zinc-950">{value}</p>
        </div>
        {Icon ? (
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3 text-[var(--app-accent,#f97316)] shadow-[0_12px_24px_-20px_rgba(15,23,42,0.35)]">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {description || trend ? (
        <div className="flex items-end justify-between gap-3 text-sm">
          <span className="max-w-[15rem] text-zinc-500">{description}</span>
          {trend ? (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-600">
              {trend}
            </span>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
