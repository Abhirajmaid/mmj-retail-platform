export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function dateFormat(value: string | number | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(value);

  return new Intl.DateTimeFormat(
    "en-IN",
    options ?? {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

export function statusColor(
  status: string
): "default" | "success" | "warning" | "danger" | "info" {
  const normalizedStatus = status.toLowerCase();

  if (["paid", "active", "approved", "received", "completed"].includes(normalizedStatus)) {
    return "success";
  }

  if (["pending", "draft", "trial", "in_transit", "processing"].includes(normalizedStatus)) {
    return "warning";
  }

  if (["overdue", "failed", "out_of_stock", "past_due", "inactive"].includes(normalizedStatus)) {
    return "danger";
  }

  if (["low", "transfer", "inbound", "outbound"].includes(normalizedStatus)) {
    return "info";
  }

  return "default";
}

export function calculateStockValue(items: Array<{ price: number; stock: number }>): number {
  return items.reduce((total, item) => total + item.price * item.stock, 0);
}

export function cn(...classes: Array<string | undefined | false | null>): string {
  return classes.filter(Boolean).join(" ");
}