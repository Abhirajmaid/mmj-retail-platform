"use client";

import type { LucideIcon } from "lucide-react";
import { Card } from "@jewellery-retail/ui";

export interface FirmKPIStat {
  label: string;
  count: number;
  icon: LucideIcon;
  /** e.g. "bg-amber-50" – used for icon container; dot uses -500 variant (e.g. bg-amber-500) */
  color?: string;
  borderColor?: string;
  iconColor?: string;
}

interface FirmKPIsProps {
  statusStats: FirmKPIStat[];
}

/** Dot color from card color: bg-*-50 -> bg-*-500 for the status dot */
function dotColorClass(colorClass: string): string {
  if (colorClass.includes("-50")) return colorClass.replace("-50", "-500");
  if (colorClass.includes("-100")) return colorClass.replace("-100", "-600");
  return "bg-amber-500";
}

export function FirmKPIs({ statusStats }: FirmKPIsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {statusStats.map((stat) => {
        const IconComponent = stat.icon;
        const color = stat.color ?? "bg-amber-50";
        const borderColor = stat.borderColor ?? "border-amber-200";
        const iconColor = stat.iconColor ?? "text-amber-600";
        const dotColor = dotColorClass(color);
        return (
          <Card
            key={stat.label}
            padding="none"
            className="rounded-2xl border border-white/30 bg-gradient-to-br from-white/70 to-white/40 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="mb-1 text-sm font-medium text-gray-600">
                  {stat.label} Firms
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {stat.count}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <span
                    className={`mr-2 h-2 w-2 rounded-full ${dotColor}`}
                    aria-hidden
                  />
                  {stat.count === 0
                    ? "No firms"
                    : `${stat.count} ${stat.count === 1 ? "firm" : "firms"}`}
                </div>
              </div>
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border shadow-lg backdrop-blur-md ${color} ${borderColor}`}
              >
                <IconComponent className={`h-8 w-8 ${iconColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
