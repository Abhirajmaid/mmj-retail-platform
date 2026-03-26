"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, FileText, Pencil, RefreshCw, Trash2, UserRound } from "lucide-react";

import type { Subscription } from "@jewellery-retail/types";
import { useSubscriptions } from "@jewellery-retail/hooks";
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Loader, PageHeader } from "@jewellery-retail/ui";
import { dateFormat, formatCurrency, statusColor } from "@jewellery-retail/utils";

const detailInputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-full min-h-[44px] bg-white";

function DetailField({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-900">{label}</label>
      <input readOnly value={String(value)} className={detailInputClass} />
    </div>
  );
}

function SubscriptionPrintContent({ subscription }: { subscription: Subscription }) {
  return (
    <div className="space-y-4 bg-white p-6 text-black">
      <h1 className="text-2xl font-semibold">Subscription {subscription.id}</h1>
      <div className="space-y-3">
        <DetailField label="Customer" value={subscription.customerName} />
        <DetailField label="Plan" value={subscription.plan} />
        <DetailField label="Billing cycle" value={subscription.billingCycle} />
        <DetailField label="Monthly amount" value={formatCurrency(subscription.monthlyAmount)} />
        <DetailField label="MRR" value={formatCurrency(subscription.mrr)} />
        <DetailField label="Renews at" value={dateFormat(subscription.renewsAt)} />
        <DetailField label="Status" value={subscription.status} />
      </div>
    </div>
  );
}

export default function SubscriptionDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: subscriptions, isLoading, error } = useSubscriptions();
  const subscription = subscriptions.find((s) => s.id === id);

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-red-800">
        <p className="font-medium">Failed to load subscription</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (isLoading || !subscription) {
    if (!isLoading && !subscription) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-zinc-700">
          <p className="font-medium">Subscription not found</p>
          <Link href="/subscriptions" className="text-sm text-[hsl(var(--primary))] hover:underline">
            Back to subscriptions
          </Link>
        </div>
      );
    }
    return <Loader label="Loading subscription…" size="lg" />;
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <PageHeader
        title={subscription.customerName}
        description="Subscription details in stock-add style layout."
        actions={
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:gap-3">
            <Link href="/subscriptions">
              <Button type="button" variant="outline" className="min-h-[44px] border-zinc-300 bg-zinc-100 px-6 text-zinc-900 hover:bg-zinc-200 sm:min-h-9">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={`/subscriptions/${id}/edit`}>
              <Button type="button" variant="outline" className="min-h-[44px] border-amber-300 bg-amber-50 px-6 text-amber-700 hover:bg-amber-100 sm:min-h-9">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Link href={`/subscriptions?deleted=${id}`}>
              <Button type="button" variant="outline" className="min-h-[44px] border-red-300 bg-red-50 px-6 text-red-600 hover:bg-red-100 sm:min-h-9">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </Link>
            <Badge variant={statusColor(subscription.status)}>{subscription.status.replace("_", " ")}</Badge>
          </div>
        }
      />

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Subscriber Information</CardTitle>
            <p className="text-sm text-zinc-500">Customer and plan metadata</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField label="Customer name" value={subscription.customerName} />
            <DetailField label="Plan" value={subscription.plan} />
            <DetailField label="Billing cycle" value={subscription.billingCycle} />
            <DetailField label="Status" value={subscription.status} />
          </div>
        </CardBody>
      </Card>

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Revenue Summary</CardTitle>
            <p className="text-sm text-zinc-500">Amount, MRR and renewal timeline</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField label="Monthly amount" value={formatCurrency(subscription.monthlyAmount)} />
            <DetailField label="MRR" value={formatCurrency(subscription.mrr)} />
            <DetailField label="Renews at" value={dateFormat(subscription.renewsAt)} />
            <DetailField label="Subscription ID" value={subscription.id} />
          </div>
          <div className="rounded-lg border border-zinc-200 bg-amber-50/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-amber-600">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Next renewal</p>
                <p className="text-2xl font-semibold text-zinc-900">{dateFormat(subscription.renewsAt)}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-3 border-t border-zinc-100 bg-white pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-1 ml-auto flex justify-end sm:order-2">
          <Button type="button" className="min-h-[44px] w-full bg-amber-500 text-white hover:bg-amber-600 sm:min-h-9 sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="sr-only" aria-hidden>
        <div className="subscription-print-only">
          <SubscriptionPrintContent subscription={subscription} />
        </div>
      </div>
    </div>
  );
}
