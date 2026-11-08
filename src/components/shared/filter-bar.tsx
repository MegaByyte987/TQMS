import { cn } from "@/lib/cn";

interface FilterBarProps {
  children: React.ReactNode;
  onClear?: () => void;
  clearLabel?: string;
  className?: string;
}

export function FilterBar({
  children,
  onClear,
  clearLabel = "Clear filters",
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-3 sm:flex-row sm:flex-wrap sm:items-center",
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="self-start rounded-[8px] px-2 py-1 text-xs font-medium text-[var(--color-mut)] hover:bg-[var(--color-ac)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d8bff] sm:self-auto"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}