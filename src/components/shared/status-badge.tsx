import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type StatusVariant = NonNullable<BadgeProps["variant"]>;

interface StatusBadgeProps {
  /** Human-readable status label. Required — colour alone is not permitted. */
  label: string;
  variant: StatusVariant;
  className?: string;
}

/**
 * A badge that always renders text alongside its colour.
 * This is the accessibility fix for the source system's colour-only status
 * indicators (WCAG 1.4.1) recorded in docs/system-analysis.md.
 */
export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={variant}
      aria-label={`Status: ${label}`}
      className={cn("gap-1.5", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block size-1.5 rounded-full",
          variantDot[variant]
        )}
      />
      {label}
    </Badge>
  );
}

const variantDot: Record<StatusVariant, string> = {
  default: "bg-white",
  secondary: "bg-slate-500",
  outline: "bg-slate-500",
  success: "bg-emerald-600",
  warning: "bg-amber-600",
  destructive: "bg-rose-600",
  info: "bg-blue-600",
  muted: "bg-slate-400",
};