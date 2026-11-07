type Primitive = string | number | boolean;

/**
 * Case-insensitive contains search across the given fields.
 */
export function searchRows<T extends Record<string, unknown>>(
  rows: T[],
  query: string | null | undefined,
  fields: (keyof T)[]
): T[] {
  const q = (query ?? "").trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) =>
    fields.some((field) => {
      const value = row[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(q);
    })
  );
}

/**
 * Filters rows to those whose field strictly equals one of the supplied values.
 * Empty arrays mean "no filter".
 */
export function filterIn<T extends Record<string, unknown>>(
  rows: T[],
  field: keyof T,
  values: Primitive[] | null | undefined
): T[] {
  if (!values || values.length === 0) return rows;
  const allowed = new Set(values.map(String));
  return rows.filter((row) => allowed.has(String(row[field])));
}

/**
 * Filters rows to those whose BS date field falls within [from, to] inclusive.
 * Strings compare correctly for the canonical YYYY-MM-DD format.
 */
export function filterBSRange<T extends Record<string, unknown>>(
  rows: T[],
  field: keyof T,
  from: string | null | undefined,
  to: string | null | undefined
): T[] {
  return rows.filter((row) => {
    const value = String(row[field] ?? "");
    if (from && value < from) return false;
    if (to && value > to) return false;
    return true;
  });
}