"use client";

import type { LucideIcon } from "lucide-react";

import { KpiCard } from "@jewellery-retail/ui";

export interface StockKPIStat {
  label: string;
  count: number;
  icon: LucideIcon;
  /** e.g. "bg-amber-50" – icon tile; dot uses -500 variant */
  color?: string;
  borderColor?: string;
  iconColor?: string;
  /** Full title; default `${label} Movements` */
  displayTitle?: string;
  /** Footer next to dot; default movement count copy */
  footer?: string;
}

interface StockKPIsProps {
  statusStats: StockKPIStat[];
}

export function StockKPIs({ statusStats }: StockKPIsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {statusStats.map((stat) => {
        const title = stat.displayTitle ?? `${stat.label} Movements`;
        const footer =
          stat.footer ??
          (stat.count === 0
            ? "No movements"
            : `${stat.count} ${stat.count === 1 ? "movement" : "movements"}`);

        return (
          <KpiCard
            key={stat.label}
            title={title}
            value={stat.count}
            footer={footer}
            icon={stat.icon}
            color={stat.color}
            borderColor={stat.borderColor}
            iconColor={stat.iconColor}
          />
        );
      })}
    </div>
  );
}
