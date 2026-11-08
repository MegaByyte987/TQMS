import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-[5px] h-[22px] rounded-[980px] border px-2 text-[11.5px]/[1] font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-[var(--color-bd)] bg-[var(--color-card)] text-[var(--color-fg)]",
        secondary: "border-transparent bg-[var(--color-ac)] text-[var(--color-fg)]",
        outline: "border-[var(--color-bd)] text-[var(--color-fg)] bg-transparent",
        ok: "border-transparent bg-[var(--color-okw)] text-[var(--color-ok)]",
        warn: "border-transparent bg-[var(--color-warnw)] text-[var(--color-warn)]",
        bad: "border-transparent bg-[var(--color-badw)] text-[var(--color-bad)]",
        pri: "border-transparent bg-[var(--color-pri)] text-white",
        // Aliases for shadcn compatibility
        success: "border-transparent bg-[var(--color-okw)] text-[var(--color-ok)]",
        info: "border-transparent bg-[var(--color-priw)] text-[var(--color-pri)]",
        warning: "border-transparent bg-[var(--color-warnw)] text-[var(--color-warn)]",
        destructive: "border-transparent bg-[var(--color-badw)] text-[var(--color-bad)]",
        muted: "border-transparent bg-[var(--color-ac)] text-[var(--color-mut)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };