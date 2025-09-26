import Decimal from "decimal.js/decimal";

// Hàm cộng
export function add(a: number | string, b: number | string): number {
  const result = new Decimal(a).plus(b);
  return result.toNumber(); // Convert to normal number if needed
}

// Hàm trừ
export function subtract(a: number | string, b: number | string): number {
  const result = new Decimal(a).minus(b);
  return result.toNumber(); // Convert to normal number if needed
}

// Hàm nhân
export function multiply(a: number | string, b: number | string): number {
  const result = new Decimal(a).times(b);
  return result.toNumber(); // Convert to normal number if needed
}

// Hàm chia
export function divide(a: number | string, b: number | string): number {
  const result = new Decimal(a).dividedBy(b);
  return result.toNumber(); // Convert to normal number if needed
}

// Hàm định dạng tiền
export function formatMoney(amount: number | string): string {
  const result = new Decimal(amount).toFixed(2); // Format to 2 decimal places
  return result; // Returns string
}

// Hàm so sánh
export function compare(a: number | string, b: number | string): number {
  const decimalA = new Decimal(a);
  const decimalB = new Decimal(b);

  if (decimalA.lessThan(decimalB)) return -1; // a < b
  if (decimalA.greaterThan(decimalB)) return 1; // a > b
  return 0; // a == b
}
