import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type StatusVariant = NonNullable<BadgeProps["variant"]>;

interface StatusBadgeProps {
  label: string;
  variant: StatusVariant;
  className?: string;
}

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
  muted: "border-transparent bg-gray-100 text-gray-500",
  success: "border-transparent bg-[var(--color-okw)] text-[var(--color-ok)]",
  info: "border-transparent bg-[var(--color-pri)] text-white",
  warning: "border-transparent bg-[var(--color-warnw)] text-[var(--color-warn)]",
};