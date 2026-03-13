export function calculateSubtotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function formatInvoiceLine(item: { name: string; price: number; quantity: number }): string {
  return `${item.name} x${item.quantity} @ ${item.price}`;
}