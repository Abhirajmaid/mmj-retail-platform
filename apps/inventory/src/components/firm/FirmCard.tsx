"use client";

import Link from "next/link";
import { Building2, Mail, Phone, Pencil, Trash2 } from "lucide-react";
import { Badge, Button, Card } from "@jewellery-retail/ui";
import type { Firm } from "@/src/types/firm";

interface FirmCardProps {
  firm: Firm;
  onDelete: (id: string) => void;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function FirmCard({ firm, onDelete }: FirmCardProps) {
  const initials = getInitials(firm.shopName || firm.firmId);

  return (
    <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-4">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-semibold text-amber-700">
            {firm.formRightLogo ? (
              <img
                src={firm.formRightLogo}
                alt=""
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              initials || <Building2 className="h-6 w-6" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-zinc-950">{firm.shopName || firm.firmId}</h3>
            <p className="text-xs text-zinc-500">ID: {firm.firmId}</p>
            <Badge
              className="mt-1 border-0 bg-amber-100 text-amber-800"
              variant="default"
            >
              {firm.firmType}
            </Badge>
          </div>
        </div>
        <dl className="space-y-1 text-sm text-zinc-600">
          <div>
            <span className="text-zinc-400">Reg No:</span> {firm.registrationNo || "—"}
          </div>
          <div>
            <span className="text-zinc-400">GSTIN:</span> {firm.gstinNo || "—"}
          </div>
          {firm.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {firm.phone}
            </div>
          )}
          {firm.email && (
            <div className="flex items-center gap-1 truncate">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{firm.email}</span>
            </div>
          )}
        </dl>
        <div className="mt-4 flex min-h-[44px] items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            asChild
          >
            <Link href={`/firm/edit/${firm.id}`}>
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="min-h-[44px] min-w-[44px] px-2"
            onClick={() => onDelete(firm.id)}
            aria-label="Delete firm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
