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
  default: "bg-[var(--color-fg)]",
  secondary: "bg-[var(--color-mut)]",
  outline: "bg-[var(--color-mut)]",
  ok: "bg-[var(--color-ok)]",
  warn: "bg-[var(--color-warn)]",
  bad: "bg-[var(--color-bad)]",
  pri: "bg-[var(--color-pri)]",
  muted: "bg-[var(--color-mut)]",
  // Aliases mapped to their semantic equivalents
  success: "bg-[var(--color-ok)]",
  info: "bg-[var(--color-pri)]",
  warning: "bg-[var(--color-warn)]",
  destructive: "bg-[var(--color-bad)]",
};