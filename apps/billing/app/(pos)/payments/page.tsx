"use client";

import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react";

import { usePayments } from "@jewellery-retail/hooks";
import {
  Badge,
  Card,
  PageHeader,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@jewellery-retail/ui";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

export default function PaymentsPage() {
  const { data } = usePayments();

  const totalPaid = data.filter((payment) => payment.status === "paid").reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = data
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const failedAmount = data
    .filter((payment) => payment.status === "failed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Monitor collections, delayed settlements, and failed payment attempts."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Collected"
          value={formatCurrency(totalPaid)}
          description="Confirmed payments"
          icon={CheckCircle2}
        />
        <StatCard
          title="Pending settlement"
          value={formatCurrency(pendingAmount)}
          description="Awaiting bank confirmation"
          icon={Clock3}
        />
        <StatCard
          title="Failed payments"
          value={formatCurrency(failedAmount)}
          description="Needs customer follow-up"
          icon={AlertCircle}
        />
      </div>

      <Card className="p-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Reference</TableHeader>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Invoice</TableHeader>
              <TableHeader>Method</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader className="text-right">Amount</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium text-zinc-950">{payment.reference}</TableCell>
                <TableCell>{payment.customerName}</TableCell>
                <TableCell>{payment.invoiceNumber}</TableCell>
                <TableCell className="uppercase">{payment.method}</TableCell>
                <TableCell>
                  <Badge variant={statusColor(payment.status)}>{payment.status}</Badge>
                </TableCell>
                <TableCell>{dateFormat(payment.createdAt)}</TableCell>
                <TableCell className="text-right font-medium text-zinc-950">
                  {formatCurrency(payment.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
