/**
 * billing-core: Pure functions for jewellery billing calculations.
 * No dependencies — usable in any JS/TS context.
 */

// Gold value = weight × rate
export function calculateGoldValue(weight: number, goldRate: number): number {
  return parseFloat((weight * goldRate).toFixed(2));
}

// Making charges: flat per gram, flat per piece, or percentage of gold value
export function calculateMakingCharge(
  weight: number,
  rate: number,
  type: 'per_gram' | 'per_piece' | 'percentage',
  goldValue?: number
): number {
  if (type === 'per_gram') return parseFloat((weight * rate).toFixed(2));
  if (type === 'per_piece') return parseFloat(rate.toFixed(2));
  if (type === 'percentage' && goldValue != null) {
    return parseFloat(((goldValue * rate) / 100).toFixed(2));
  }
  return 0;
}

// GST on jewellery: typically 3% on (gold value + making charges), 18% on stone charges
export function calculateGST(baseAmount: number, gstRate = 3): number {
  return parseFloat(((baseAmount * gstRate) / 100).toFixed(2));
}

export interface InvoiceTotalInput {
  goldWeight: number;
  goldRate: number;
  makingCharge: number;
  stoneCost?: number;
  gstRateOnMetal?: number;  // default 3%
  gstRateOnStone?: number;  // default 18%
  discount?: number;
}

export interface InvoiceTotalResult {
  goldValue: number;
  makingCharge: number;
  stoneCost: number;
  gstOnMetal: number;
  gstOnStone: number;
  totalGst: number;
  subtotal: number;
  discount: number;
  finalAmount: number;
}

export function calculateInvoiceTotal(input: InvoiceTotalInput): InvoiceTotalResult {
  const {
    goldWeight,
    goldRate,
    makingCharge,
    stoneCost = 0,
    gstRateOnMetal = 3,
    gstRateOnStone = 18,
    discount = 0,
  } = input;

  const goldValue = calculateGoldValue(goldWeight, goldRate);
  const metalBase = goldValue + makingCharge;
  const gstOnMetal = calculateGST(metalBase, gstRateOnMetal);
  const gstOnStone = calculateGST(stoneCost, gstRateOnStone);
  const totalGst = parseFloat((gstOnMetal + gstOnStone).toFixed(2));
  const subtotal = parseFloat((metalBase + stoneCost + totalGst).toFixed(2));
  const finalAmount = parseFloat(Math.max(0, subtotal - discount).toFixed(2));

  return {
    goldValue,
    makingCharge,
    stoneCost,
    gstOnMetal,
    gstOnStone,
    totalGst,
    subtotal,
    discount,
    finalAmount,
  };
}

export interface OldGoldInput {
  weight: number;        // gross weight in grams
  purity: number;        // e.g. 22 for 22KT, 18 for 18KT
  currentGoldRate: number; // per gram rate for 24KT
  deductionPercent?: number; // melting/wastage deduction, default 2%
}

export interface OldGoldResult {
  pureGoldWeight: number;
  exchangeValue: number;
  afterDeduction: number;
}

export function oldGoldExchangeCalculator(input: OldGoldInput): OldGoldResult {
  const { weight, purity, currentGoldRate, deductionPercent = 2 } = input;
  const pureGoldWeight = parseFloat(((weight * purity) / 24).toFixed(4));
  const exchangeValue = parseFloat((pureGoldWeight * currentGoldRate).toFixed(2));
  const deduction = parseFloat(((exchangeValue * deductionPercent) / 100).toFixed(2));
  const afterDeduction = parseFloat((exchangeValue - deduction).toFixed(2));
  return { pureGoldWeight, exchangeValue, afterDeduction };
}

// Generate invoice number: MMJ-YYYYMMDD-XXXX
export function generateInvoiceNumber(storeCode = 'MMJ', sequence: number): string {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(sequence).padStart(4, '0');
  return `${storeCode}-${datePart}-${seq}`;
}

// Keep backwards-compatible helpers from the original stub
export function calculateSubtotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function formatInvoiceLine(item: { name: string; price: number; quantity: number }): string {
  return `${item.name} x${item.quantity} @ ${item.price}`;
}
