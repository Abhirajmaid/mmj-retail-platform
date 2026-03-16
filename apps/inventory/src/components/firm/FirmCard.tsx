"use client";

import Link from "next/link";
import { Mail, Phone, Pencil, Trash2 } from "lucide-react";
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle } from "@jewellery-retail/ui";
import type { Firm } from "@/src/types/firm";
import { getInitial, statusLabel, statusPillClass } from "./firmTableColumns";

interface FirmCardProps {
  firm: Firm;
  onDelete: (id: string) => void;
}

export function FirmCard({ firm, onDelete }: FirmCardProps) {
  const initial = getInitial(firm.shopName || firm.firmId || "F");
  const displayName = firm.shopName || firm.firmId || "Unnamed firm";
  const contactLine = firm.email || firm.phone || "No contact";

  return (
    <Card
      padding="none"
      className="overflow-hidden rounded-lg bg-white p-5 shadow-md transition-shadow hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),0_4px_6px_-4px_rgba(0,0,0,0.06)]"
    >
      <CardHeader className="mb-0 border-b border-zinc-100 px-0 pb-4 pt-0">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
            {firm.formRightLogo ? (
              <img
                src={firm.formRightLogo}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initial
            )}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base font-semibold text-zinc-900">
              {displayName}
            </CardTitle>
            <p className="mt-0.5 text-sm text-zinc-500">{contactLine}</p>
            <span className={`mt-2 inline-block ${statusPillClass(firm.status)}`}>
              {statusLabel(firm.status)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-0 py-4">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="text-zinc-500">Firm type</dt>
          <dd className="font-medium text-zinc-800">{firm.firmType}</dd>
          <dt className="text-zinc-500">Reg No</dt>
          <dd className="text-zinc-700">{firm.registrationNo || "—"}</dd>
          <dt className="text-zinc-500">GSTIN</dt>
          <dd className="truncate text-zinc-700">{firm.gstinNo || "—"}</dd>
        </dl>
        {(firm.email || firm.phone) && (
          <div className="mt-3 flex flex-col gap-1.5 border-t border-zinc-100 pt-3">
            {firm.email && (
              <a
                href={`mailto:${firm.email}`}
                className="flex items-center gap-2 truncate text-xs text-zinc-600 hover:text-amber-600"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                <span className="truncate">{firm.email}</span>
              </a>
            )}
            {firm.phone && (
              <a
                href={`tel:${firm.phone}`}
                className="flex items-center gap-2 text-xs text-zinc-600 hover:text-amber-600"
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                {firm.phone}
              </a>
            )}
          </div>
        )}
      </CardBody>

      <CardFooter className="flex gap-2 border-t border-zinc-100 px-0 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="h-9 flex-1 rounded-md border-zinc-300 bg-zinc-50/80 text-zinc-700 shadow-sm hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"
          asChild
        >
          <Link href={`/firm/edit/${firm.id}`}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="h-9 w-9 shrink-0 rounded-md shadow-sm"
          onClick={() => onDelete(firm.id)}
          aria-label="Delete firm"
        >
          <Trash2 className="h-8 w-8" />
        </Button>
      </CardFooter>
    </Card>
  );
}
