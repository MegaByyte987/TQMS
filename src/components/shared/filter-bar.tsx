import { cn } from "@/lib/cn";

interface FilterBarProps {
  children: React.ReactNode;
  onClear?: () => void;
  clearLabel?: string;
  className?: string;
}

/**
 * A horizontal wrapper for filter controls with an optional "Clear" action.
 * Stacks vertically on narrow screens; row on `sm:` and above.
 */
export function FilterBar({
  children,
  onClear,
  clearLabel = "Clear filters",
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:flex-wrap sm:items-center",
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="self-start rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:self-auto"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}