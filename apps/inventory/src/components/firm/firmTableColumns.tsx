"use client";

import Link from "next/link";
import { Mail, Pencil, Phone, Trash2 } from "lucide-react";
import { Button } from "@jewellery-retail/ui";
import type { Firm } from "@/src/types/firm";

export type FilterTab = "all" | "active" | "pending_review" | "inactive";

export function statusLabel(status: Firm["status"]): string {
  if (status === "active") return "ACTIVE";
  if (status === "pending_review") return "PENDING REVIEW";
  return "INACTIVE";
}

export function statusPillClass(status: Firm["status"]): string {
  if (status === "active")
    return "rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700";
  if (status === "pending_review")
    return "rounded-md bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700";
  return "rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600";
}

export function getInitial(name: string): string {
  if (!name || !name.trim()) return "?";
  return name.trim().charAt(0).toUpperCase();
}

export interface FirmColumnConfig {
  key: string;
  label: string;
  width?: string;
  render: (firm: Firm) => React.ReactNode;
}

export function getFirmTableColumns(onDelete: (id: string) => void): FirmColumnConfig[] {
  return [
    {
      key: "company",
      label: "COMPANY",
      width: "350px",
      render: (firm) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700">
            {getInitial(firm.shopName || firm.firmId || "F")}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-zinc-900 truncate">
              {firm.shopName || firm.firmId || "—"}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {firm.email || firm.phone || "No contact"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "PRIMARY CONTACT",
      width: "220px",
      render: (firm) => (
        <div className="space-y-0.5 min-w-0">
          {firm.email ? (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
              <span className="truncate max-w-[200px]" title={firm.email}>
                {firm.email}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Mail className="h-4 w-4 shrink-0" />
              No email
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            {firm.phone || "No contact"}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      width: "140px",
      render: (firm) => (
        <span className={statusPillClass(firm.status)}>{statusLabel(firm.status)}</span>
      ),
    },
    {
      key: "firmType",
      label: "FIRM TYPE",
      width: "120px",
      render: (firm) => (
        <span className="text-zinc-600 whitespace-nowrap">{firm.firmType}</span>
      ),
    },
    {
      key: "regNo",
      label: "REG NO",
      width: "120px",
      render: (firm) => (
        <span className="text-zinc-600 whitespace-nowrap">
          {firm.registrationNo || "—"}
        </span>
      ),
    },
    {
      key: "gstin",
      label: "GSTIN",
      width: "140px",
      render: (firm) => (
        <span className="text-zinc-600 whitespace-nowrap">{firm.gstinNo || "—"}</span>
      ),
    },
    {
      key: "actions",
      label: "ACTIONS",
      width: "120px",
      render: (firm) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-md border-amber-200 text-zinc-600 hover:bg-amber-50 hover:text-amber-700"
            asChild
          >
            <Link href={`/firm/edit/${firm.id}`} aria-label="Edit firm">
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-9 w-9 rounded-md"
            onClick={() => onDelete(firm.id)}
            aria-label="Delete firm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}
