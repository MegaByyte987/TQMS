import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, hint, icon: Icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-4",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-mut)]">
          {label}
        </span>
        <span className="text-2xl font-semibold tabular-nums text-[var(--color-fg)]">
          {value}
        </span>
        {hint && <span className="text-xs text-[var(--color-mut)]">{hint}</span>}
      </div>
      {Icon && (
        <div className="flex size-9 items-center justify-center rounded-[8px] bg-[var(--color-ac)] text-[var(--color-mut)]">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}