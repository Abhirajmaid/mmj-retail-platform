"use client";

import { Button, Card } from "@jewellery-retail/ui";
import { appConfig } from "@jewellery-retail/config";
import { formatCurrency, cn } from "@jewellery-retail/utils";
import { useLocalStorage } from "@jewellery-retail/hooks";
import { isAuthenticated } from "@jewellery-retail/auth";
import { calculateSubtotal, formatInvoiceLine } from "@jewellery-retail/billing";

export default function InventoryPage() {
  const [filter, setFilter] = useLocalStorage("inventory-filter", "all");
  const items = [
    { name: "Ring A", price: 150, quantity: 2 },
    { name: "Necklace B", price: 320, quantity: 1 },
  ];
  const total = calculateSubtotal(items);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-950">
      <main className="w-full max-w-md space-y-6">
        <h1 className={cn("text-2xl font-semibold text-zinc-900 dark:text-zinc-100")}>
          {appConfig.appName} – Inventory
        </h1>
        <Card>
          <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
            Auth: {isAuthenticated() ? "Signed in" : "Guest"} · Filter: {filter}
          </p>
          <ul className="mb-2 list-inside text-sm text-zinc-700 dark:text-zinc-300">
            {items.map((item, i) => (
              <li key={i}>{formatInvoiceLine(item)}</li>
            ))}
          </ul>
          <p className="mb-4 font-medium">{formatCurrency(total)}</p>
          <Button onClick={() => setFilter(filter === "all" ? "low" : "all")}>
            Toggle filter
          </Button>
        </Card>
      </main>
    </div>
  );
}
