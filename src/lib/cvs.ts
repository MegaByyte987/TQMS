
export function toCSV(headers: string[], rows: string[][]): string {
  const escape = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return "";
    const s = String(value);
    if (/[",\n\r]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const headerLine = headers.map(escape).join(",");
  const dataLines = rows.map((row) => row.map(escape).join(","));
  return "\uFEFF" + [headerLine, ...dataLines].join("\r\n");
}

export function csvResponse(
  filename: string,
  headers: string[],
  rows: string[][]
): Response {
  return new Response(toCSV(headers, rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}