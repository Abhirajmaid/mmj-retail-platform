"use client";

import { Button, Card } from "@jewellery-retail/ui";
import { appConfig } from "@jewellery-retail/config";
import { formatCurrency } from "@jewellery-retail/utils";
import { useLocalStorage } from "@jewellery-retail/hooks";
import { isAuthenticated } from "@jewellery-retail/auth";
import { calculateSubtotal, formatInvoiceLine } from "@jewellery-retail/billing";

export default function BillingPage() {
  const [draftTotal, setDraftTotal] = useLocalStorage("billing-draft", 0);
  const items = [
    { name: "Item 1", price: 25.5, quantity: 2 },
    { name: "Item 2", price: 10, quantity: 3 },
  ];
  const total = calculateSubtotal(items);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-950">
      <main className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {appConfig.appName} – Billing
        </h1>
        <Card>
          <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
            Auth: {isAuthenticated() ? "Signed in" : "Guest"}
          </p>
          <ul className="mb-2 list-inside text-sm text-zinc-700 dark:text-zinc-300">
            {items.map((item, i) => (
              <li key={i}>{formatInvoiceLine(item)}</li>
            ))}
          </ul>
          <p className="mb-4 font-medium">Subtotal: {formatCurrency(total)}</p>
          <div className="flex gap-2">
            <Button onClick={() => setDraftTotal(total)}>Set draft</Button>
            <span className="py-2 text-sm">Draft: {formatCurrency(draftTotal)}</span>
          </div>
        </Card>
      </main>
    </div>
  );
}
