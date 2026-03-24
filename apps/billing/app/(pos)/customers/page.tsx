"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";

import { useCustomers } from "@jewellery-retail/hooks";
import {
  Badge,
  Button,
  Input,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, formatCurrency } from "@jewellery-retail/utils";
import { DeleteConfirmPopover } from "@/src/components/DeleteConfirmPopover";

export default function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useCustomers();
  const [query, setQuery] = useState("");
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => {
    const id = searchParams.get("deleted");
    return id ? new Set([id]) : new Set();
  });

  const filteredCustomers = useMemo(
    () =>
      data
        .filter((c) => !deletedIds.has(c.id))
        .filter((customer) =>
          `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase())
        ),
    [data, query, deletedIds]
  );

  const handleDelete = (id: string) => {
    setDeletedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Review profiles, balances, and purchase history. Click a row to open the customer profile."
      />

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name, email, or phone"
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Segment</TableHeader>
            <TableHeader>Outstanding</TableHeader>
            <TableHeader>Last purchase</TableHeader>
            <TableHeader className="text-right">Lifetime value</TableHeader>
            <TableHeader className="w-[100px] text-right">Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow
              key={customer.id}
              className="cursor-pointer hover:bg-zinc-50"
              onClick={() => router.push(`/customers/${customer.id}`)}
            >
              <TableCell>
                <div>
                  <p className="font-medium text-zinc-950">{customer.name}</p>
                  <p className="text-xs text-zinc-500">{customer.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="info">{customer.segment}</Badge>
              </TableCell>
              <TableCell>{formatCurrency(customer.outstandingBalance)}</TableCell>
              <TableCell>{dateFormat(customer.lastPurchaseAt)}</TableCell>
              <TableCell className="text-right font-medium text-zinc-950">
                {formatCurrency(customer.totalSpend)}
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-950" asChild>
                    <Link href={`/customers/${customer.id}/edit`} aria-label="Edit customer">
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteConfirmPopover onConfirm={() => handleDelete(customer.id)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
