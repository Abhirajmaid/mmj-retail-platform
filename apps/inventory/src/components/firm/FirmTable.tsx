"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import type { Firm } from "@/src/types/firm";

interface FirmTableProps {
  firms: Firm[];
  onDelete: (id: string) => void;
}

function statusVariant(status: Firm["status"]): "default" | "success" | "warning" | "danger" | "info" {
  if (status === "active") return "success";
  if (status === "pending_review") return "warning";
  return "default";
}

export function FirmTable({ firms, onDelete }: FirmTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50">
            <TableHead>Firm ID</TableHead>
            <TableHead>Shop Name</TableHead>
            <TableHead>Firm Type</TableHead>
            <TableHead>Registration No</TableHead>
            <TableHead>GSTIN</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {firms.map((firm) => (
            <TableRow
              key={firm.id}
              className="border-b border-gray-100 even:bg-zinc-50/50"
            >
              <TableCell className="font-medium text-zinc-950">
                {firm.firmId}
              </TableCell>
              <TableCell>{firm.shopName || "—"}</TableCell>
              <TableCell>{firm.firmType}</TableCell>
              <TableCell>{firm.registrationNo || "—"}</TableCell>
              <TableCell>{firm.gstinNo || "—"}</TableCell>
              <TableCell>{firm.phone || "—"}</TableCell>
              <TableCell className="max-w-[180px] truncate">
                {firm.email || "—"}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(firm.status)}>
                  {firm.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex min-h-[44px] items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-zinc-600 hover:text-amber-600"
                    asChild
                  >
                    <Link href={`/firm/edit/${firm.id}`} aria-label="Edit firm">
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => onDelete(firm.id)}
                    aria-label="Delete firm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
