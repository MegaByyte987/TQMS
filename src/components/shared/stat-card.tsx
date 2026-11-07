import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
        <span className="text-2xl font-semibold tabular-nums text-slate-900">
          {value}
        </span>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
      {Icon && (
        <div className="flex size-9 items-center justify-center rounded-md bg-slate-100 text-slate-600">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}