"use client";

import { CreditCard, Gem, Sparkles } from "lucide-react";

import { useSubscriptions } from "@jewellery-retail/hooks";
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

export default function SubscriptionsPage() {
  const { data } = useSubscriptions();
  const activeMrr = data
    .filter((subscription) => subscription.status === "active")
    .reduce((sum, subscription) => sum + subscription.mrr, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Manage active plans, billing cycles, and recurring revenue from customer programs."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Active MRR"
          value={formatCurrency(activeMrr)}
          description="Monthly recurring revenue"
          icon={CreditCard}
        />
        <StatCard
          title="Premium plans"
          value={String(data.filter((subscription) => subscription.plan === "Diamond Care").length)}
          description="High-value recurring customers"
          icon={Gem}
        />
        <StatCard
          title="Trials and risk"
          value={String(data.filter((subscription) => subscription.status !== "active").length)}
          description="Trial or past-due subscriptions"
          icon={Sparkles}
        />
      </div>

      <Card className="p-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Plan</TableHeader>
              <TableHeader>Billing cycle</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Renews</TableHeader>
              <TableHeader className="text-right">Amount</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell className="font-medium text-zinc-950">{subscription.customerName}</TableCell>
                <TableCell>{subscription.plan}</TableCell>
                <TableCell className="capitalize">{subscription.billingCycle}</TableCell>
                <TableCell>
                  <Badge variant={statusColor(subscription.status)}>{subscription.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>{dateFormat(subscription.renewsAt)}</TableCell>
                <TableCell className="text-right font-medium text-zinc-950">
                  {formatCurrency(subscription.monthlyAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
