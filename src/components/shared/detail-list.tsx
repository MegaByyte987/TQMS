import { Fragment } from "react";
import { cn } from "@/lib/cn";

export interface DetailRow {
  label: string;
  value: React.ReactNode;
}

interface DetailListProps {
  rows: DetailRow[];
  className?: string;
}

export function DetailList({ rows, className }: DetailListProps) {
  return (
    <dl
      className={cn(
        "grid grid-cols-[minmax(0,8rem)_1fr] gap-x-4 gap-y-3 text-sm",
        className
      )}
    >
      {rows.map((row, i) => (
        <Fragment key={i}>
          <dt className="text-[var(--color-mut)] truncate">{row.label}</dt>
          <dd className="min-w-0 break-words text-[var(--color-fg)]">{row.value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}