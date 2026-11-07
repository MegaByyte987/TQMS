/**
 * Formats a number as Nepali Rupees: 1500 → "Rs. 1,500.00".
 * Uses en-NP locale for grouping; the app does not yet ship a full
 * localisation framework, so this is the single source of currency display.
 */
export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-NP", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Formats a weight in kilograms with thousands grouping.
 * Weights in TQMS are always integral kilograms.
 */
export function formatWeight(kg: number): string {
  return `${kg.toLocaleString("en-NP")} kg`;
}

/**
 * Formats a Nepali phone number for display.
 * Input is stored as digits (e.g. "9841234567"); output is "984-1234567".
 * Landlines with a dash are passed through unchanged.
 */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && /^9[78]/.test(digits)) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  if (digits.length === 9 && /^1/.test(digits)) {
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  }
  return raw;
}

/**
 * Renders a value or an em-dash placeholder for missing data.
 * The Details drawers rely on this so an empty field never renders
 * as blank whitespace.
 */
export function orDash(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const text = String(value).trim();
  return text.length === 0 ? "—" : text;
}