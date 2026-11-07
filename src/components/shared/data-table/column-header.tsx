"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Column } from "@tanstack/react-table";
import { cn } from "@/lib/cn";

interface ColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export function ColumnHeader<TData, TValue>({
  column,
  title,
}: ColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {title}
      </span>
    );
  }

  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        "-ml-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wide transition-colors",
        "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      )}
      aria-sort={
        sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"
      }
    >
      {title}
      {sorted === "asc" && <ArrowUp className="size-3" aria-hidden="true" />}
      {sorted === "desc" && <ArrowDown className="size-3" aria-hidden="true" />}
      {!sorted && <ArrowUpDown className="size-3 opacity-40" aria-hidden="true" />}
    </button>
  );
}