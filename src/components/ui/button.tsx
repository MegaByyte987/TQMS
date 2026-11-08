"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "relative inline-flex flex-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 ease-[var(--ease)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d8bff] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary pill with sliding label support
        default: "h-[50px] rounded-[980px] border border-transparent bg-[var(--color-fg)] px-6 text-[16px]/[1] text-white overflow-hidden hover:bg-[var(--color-fg)]",
        // Ghost pill for dark backgrounds
        ghost: "h-[50px] rounded-[980px] border border-white/35 bg-white/8 px-6 text-[16px]/[1] text-white backdrop-blur-[14px] hover:bg-white/18",
        // Standard shadcn variants adapted to the theme
        outline: "h-9 rounded-md border border-[var(--color-bd)] bg-[var(--color-card)] px-3 text-sm text-[var(--color-fg)] hover:bg-[var(--color-ac)]",
        secondary: "h-9 rounded-md border border-transparent bg-[var(--color-ac)] px-3 text-sm text-[var(--color-fg)] hover:bg-[var(--color-bd)]",
        destructive: "h-9 rounded-md border border-transparent bg-[var(--color-bad)] px-3 text-sm text-white hover:bg-[var(--color-bad)]",
      },
      size: {
        default: "h-[50px] px-6",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Enables the signature sliding dual-label hover effect */
  slideLabel?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, slideLabel = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    if (slideLabel && variant === "default") {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <span className="label--primary block whitespace-nowrap transition-transform duration-500 ease-[var(--ease)] group-hover:-translate-y-full hover:-translate-y-full">
            {children}
        </span>
          <span
            className="label--duplicate absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-500 ease-[var(--ease)] group-hover:translate-y-0 hover:translate-y-0"
            aria-hidden="true"
          >
            {children}
          </span>
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };