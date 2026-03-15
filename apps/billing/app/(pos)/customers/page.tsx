"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import { useCustomers } from "@jewellery-retail/hooks";
import {
  Badge,
  Card,
  Input,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

export default function CustomersPage() {
  const { data } = useCustomers();
  const [query, setQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const filteredCustomers = useMemo(
    () =>
      data.filter((customer) =>
        `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase())
      ),
    [data, query]
  );

  useEffect(() => {
    if (filteredCustomers.length === 0) {
      setSelectedCustomerId(null);
      return;
    }

    const selectedStillVisible = filteredCustomers.some((customer) => customer.id === selectedCustomerId);
    if (!selectedStillVisible) {
      setSelectedCustomerId(filteredCustomers[0].id);
    }
  }, [filteredCustomers, selectedCustomerId]);

  const selectedCustomer =
    filteredCustomers.find((customer) => customer.id === selectedCustomerId) ?? filteredCustomers[0] ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Review profiles, balances, and purchase history from the shared customer dataset."
      />

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name, email, or phone"
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card className="p-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Segment</TableHeader>
                <TableHeader>Outstanding</TableHeader>
                <TableHeader>Last purchase</TableHeader>
                <TableHeader className="text-right">Lifetime value</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const isSelected = customer.id === selectedCustomer?.id;

                return (
                  <TableRow
                    key={customer.id}
                    className={isSelected ? "cursor-pointer bg-orange-50/70" : "cursor-pointer"}
                    onClick={() => setSelectedCustomerId(customer.id)}
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        <Card className="space-y-6 p-6">
          {selectedCustomer ? (
            <>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950">{selectedCustomer.name}</h2>
                    <p className="text-sm text-zinc-500">{selectedCustomer.segment} customer profile</p>
                  </div>
                  <Badge variant={statusColor(selectedCustomer.status)}>{selectedCustomer.status}</Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm text-zinc-600">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {selectedCustomer.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {selectedCustomer.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedCustomer.city}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-zinc-100 p-4">
                  <p className="text-sm text-zinc-500">Lifetime spend</p>
                  <p className="mt-1 text-xl font-semibold text-zinc-950">
                    {formatCurrency(selectedCustomer.totalSpend)}
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-100 p-4">
                  <p className="text-sm text-zinc-500">Outstanding balance</p>
                  <p className="mt-1 text-xl font-semibold text-zinc-950">
                    {formatCurrency(selectedCustomer.outstandingBalance)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Purchase history</h3>
                <div className="mt-4 space-y-3">
                  {selectedCustomer.purchaseHistory.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-zinc-950">{purchase.invoiceNumber}</p>
                        <p className="text-sm text-zinc-500">{dateFormat(purchase.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-zinc-950">{formatCurrency(purchase.amount)}</p>
                        <Badge variant={statusColor(purchase.status)}>{purchase.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
