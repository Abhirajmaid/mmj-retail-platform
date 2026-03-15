"use client";

import { Building2, X } from "lucide-react";
import { Button } from "@jewellery-retail/ui";
import type { Firm } from "@/src/types/firm";

interface FirmReviewCardProps {
  firm: Firm;
  onDelete: (id: string) => void;
}

export function FirmReviewCard({ firm, onDelete }: FirmReviewCardProps) {
  const initials = (firm.shopName || firm.firmId).slice(0, 2).toUpperCase();

  return (
    <tr className="border-b border-[#0891B2]/20 bg-white last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0891B2]/20 text-sm font-semibold text-[#0891B2]">
            {firm.formRightLogo ? (
              <img
                src={firm.formRightLogo}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <span className="font-medium text-zinc-950">
            {firm.shopName || firm.firmId}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-zinc-600">{firm.firmType}</td>
      <td className="px-4 py-3">
        <Button
          variant="destructive"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => onDelete(firm.id)}
          aria-label="Delete firm"
        >
          <X className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
