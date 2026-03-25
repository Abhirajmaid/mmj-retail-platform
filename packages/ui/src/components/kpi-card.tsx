"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Card } from "./card";

export interface KpiCardProps {
  title: string;
  value: number | string;
  /** Shown beside the status dot (e.g. “5 movements”, “Awaiting supplier fulfillment”). */
  footer: string;
  icon: LucideIcon;
  /** Icon tile background, e.g. bg-amber-50 */
  color?: string;
  borderColor?: string;
  iconColor?: string;
  className?: string;
}

function dotColorClass(colorClass: string): string {
  if (colorClass.includes("-50")) return colorClass.replace("-50", "-500");
  if (colorClass.includes("-100")) return colorClass.replace("-100", "-600");
  return "bg-amber-500";
}

export function KpiCard({
  title,
  value,
  footer,
  icon: Icon,
  color = "bg-amber-50",
  borderColor = "border-amber-200",
  iconColor = "text-amber-600",
  className,
}: KpiCardProps) {
  const dotColor = dotColorClass(color);

  return (
    <Card
      padding="none"
      className={cn(
        "rounded-2xl border border-white/30 bg-gradient-to-br from-white/70 to-white/40 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-black text-gray-800">{value}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span className={cn("mr-2 h-2 w-2 shrink-0 rounded-full", dotColor)} aria-hidden />
            <span className="min-w-0">{footer}</span>
          </div>
        </div>
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border shadow-lg backdrop-blur-md",
            color,
            borderColor
          )}
        >
          <Icon className={cn("h-8 w-8", iconColor)} />
        </div>
      </div>
    </Card>
  );
}
