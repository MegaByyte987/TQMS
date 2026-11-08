import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[38px] w-full rounded-[8px] border border-[var(--color-bd)] bg-[var(--color-card)] px-3 py-2 text-[14px] text-[var(--color-fg)] outline-none transition-colors placeholder:text-[var(--color-mut)] focus-visible:ring-2 focus-visible:ring-[#6d8bff] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };