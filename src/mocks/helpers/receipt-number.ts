import { todayBS } from "@/lib/bs-date";

/**
 * Formats a receipt number in the canonical BS format: INX_<BS year>_<sequence>.
 * The year is the BS year of the receipt, never the AD year.
 */
export function formatReceiptNo(bsDate: string, sequence: number): string {
  const year = bsDate.slice(0, 4);
  const padded = String(sequence).padStart(4, "0");
  return `INX_${year}_${padded}`;
}

/**
 * Given an existing list of receipt numbers, returns the next sequence
 * for the given BS year.
 */
export function nextReceiptSequence(
  existing: { receiptNo: string }[],
  bsYear: string
): number {
  const prefix = `INX_${bsYear}_`;
  const sequences = existing
    .filter((r) => r.receiptNo.startsWith(prefix))
    .map((r) => Number(r.receiptNo.slice(prefix.length)))
    .filter((n) => Number.isFinite(n));
  return sequences.length === 0 ? 1 : Math.max(...sequences) + 1;
}

/** Convenience: next receipt number for today's BS year. */
export function nextReceiptNo(existing: { receiptNo: string }[]): string {
  const today = todayBS();
  const sequence = nextReceiptSequence(existing, today.slice(0, 4));
  return formatReceiptNo(today, sequence);
}