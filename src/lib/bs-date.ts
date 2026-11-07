import NepaliDate from "nepali-date-converter";

/** Canonical BS date string format used everywhere in the app: "2083-07-20". */
export type BSDate = `${number}-${string}-${string}`;

const BS_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isBSDate(value: string): value is BSDate {
  return BS_PATTERN.test(value);
}

/** Returns today's date as a BS string, e.g. "2083-07-20". */
export function todayBS(): BSDate {
  return formatBS(new NepaliDate());
}

/** Formats a NepaliDate instance as "YYYY-MM-DD" in BS. */
export function formatBS(date: NepaliDate): BSDate {
  const year = date.getYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Converts a BS date string to an AD Date object. */
export function bsToAD(bsDate: string): Date {
  const match = BS_PATTERN.exec(bsDate);
  if (!match) throw new Error(`Invalid BS date: ${bsDate}`);
  const [year, month, day] = [Number(match[1]), Number(match[2]) - 1, Number(match[3])];
  return new NepaliDate(year, month, day).toJsDate();
}

/** Converts an AD Date to a BS date string. */
export function adToBS(date: Date): BSDate {
  return formatBS(new NepaliDate(date));
}

/** Human-readable display, e.g. "2083-07-20" → "20 Mangsir 2083". */
export function displayBS(bsDate: string): string {
  const match = BS_PATTERN.exec(bsDate);
  if (!match) return bsDate;
  const [, year, month, day] = match;
  const monthName = BS_MONTH_NAMES[Number(month) - 1] ?? month;
  return `${Number(day)} ${monthName} ${year}`;
}

const BS_MONTH_NAMES = [
  "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra",
] as const;