"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown, FileText, Save, UserRound } from "lucide-react";

import type { Subscription } from "@jewellery-retail/types";
import { useSubscriptions } from "@jewellery-retail/hooks";
import { Button, Card, CardBody, CardHeader, CardTitle, Loader, PageHeader } from "@jewellery-retail/ui";

const emptyForm = {
  customerName: "",
  plan: "Gold Plus" as Subscription["plan"],
  monthlyAmount: "",
  billingCycle: "monthly" as Subscription["billingCycle"],
  renewsAt: "",
  status: "active" as Subscription["status"],
};

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none w-full min-h-[44px]";
const selectClass = `${inputClass} appearance-none bg-white pr-10`;

export default function EditSubscriptionPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: subscriptions, isLoading } = useSubscriptions();
  const subscription = subscriptions.find((s) => s.id === id);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!subscription) return;
    setForm({
      customerName: subscription.customerName ?? "",
      plan: subscription.plan ?? "Gold Plus",
      monthlyAmount: String(subscription.monthlyAmount ?? ""),
      billingCycle: subscription.billingCycle ?? "monthly",
      renewsAt: subscription.renewsAt?.slice(0, 10) ?? "",
      status: subscription.status ?? "active",
    });
  }, [subscription]);

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
        title="Edit Subscription"
        description="Update subscription details with stock-style form layout."
      />

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Subscriber Details</CardTitle>
            <p className="text-sm text-zinc-500">Edit customer, plan and billing setup</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4 pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Customer name</label>
              <input className={inputClass} value={form.customerName} onChange={(e) => setForm((c) => ({ ...c, customerName: e.target.value }))} />
            </div>
            <div className="relative">
              <label className="mb-1 block text-xs font-medium text-zinc-900">Plan</label>
              <select className={selectClass} value={form.plan} onChange={(e) => setForm((c) => ({ ...c, plan: e.target.value as Subscription["plan"] }))}>
                <option value="Gold Plus">Gold Plus</option>
                <option value="Diamond Care">Diamond Care</option>
                <option value="Silver Save">Silver Save</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[38px] h-4 w-4 text-zinc-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Monthly amount</label>
              <input type="number" className={inputClass} value={form.monthlyAmount} onChange={(e) => setForm((c) => ({ ...c, monthlyAmount: e.target.value }))} />
            </div>
            <div className="relative">
              <label className="mb-1 block text-xs font-medium text-zinc-900">Billing cycle</label>
              <select className={selectClass} value={form.billingCycle} onChange={(e) => setForm((c) => ({ ...c, billingCycle: e.target.value as Subscription["billingCycle"] }))}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[38px] h-4 w-4 text-zinc-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-900">Renews at</label>
              <input type="date" className={inputClass} value={form.renewsAt} onChange={(e) => setForm((c) => ({ ...c, renewsAt: e.target.value }))} />
            </div>
            <div className="relative">
              <label className="mb-1 block text-xs font-medium text-zinc-900">Status</label>
              <select className={selectClass} value={form.status} onChange={(e) => setForm((c) => ({ ...c, status: e.target.value as Subscription["status"] }))}>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="past_due">Past due</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[38px] h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="min-w-0" padding="lg">
        <CardHeader className="flex flex-row items-start gap-3 border-b border-zinc-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg font-semibold text-zinc-900">Preview</CardTitle>
            <p className="text-sm text-zinc-500">Quick summary of updated subscription values</p>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="rounded-lg border border-zinc-200 bg-amber-50/30 p-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p className="text-zinc-700"><span className="font-medium text-zinc-900">Customer:</span> {form.customerName || "—"}</p>
              <p className="text-zinc-700"><span className="font-medium text-zinc-900">Plan:</span> {form.plan}</p>
              <p className="text-zinc-700"><span className="font-medium text-zinc-900">Monthly amount:</span> {form.monthlyAmount || "0"}</p>
              <p className="text-zinc-700"><span className="font-medium text-zinc-900">Cycle:</span> {form.billingCycle}</p>
              <p className="text-zinc-700"><span className="font-medium text-zinc-900">Renews:</span> {form.renewsAt || "—"}</p>
              <p className="text-zinc-700"><span className="font-medium text-zinc-900">Status:</span> {form.status}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-3 border-t border-zinc-100 bg-white pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`/subscriptions/${id}`} className="order-2 sm:order-1">
          <Button type="button" variant="ghost" className="min-h-[44px] w-full sm:min-h-9 sm:w-auto">
            Cancel
          </Button>
        </Link>
        <div className="order-1 flex justify-end sm:order-2">
          <Button type="button" className="min-h-[44px] w-full bg-amber-500 text-white hover:bg-amber-600 sm:min-h-9 sm:w-auto" onClick={() => router.push(`/subscriptions/${id}`)}>
            <Save className="mr-2 h-4 w-4" />
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
