"use client";

import { cn } from "@/lib/cn";

type ToastKind = "success" | "error" | "info";

const kindClasses: Record<ToastKind, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-slate-200 bg-white text-slate-900",
};

interface ToastProps {
  kind: ToastKind;
  children: React.ReactNode;
  className?: string;
}

function Toast({ kind, children, className }: ToastProps) {
  return (
    <div
      role="status"
      data-slot="toast"
      data-kind={kind}
      className={cn(
        "pointer-events-auto animate-fade-in rounded-md border px-4 py-3 text-sm shadow-md",
        kindClasses[kind],
        className
      )}
    >
      {children}
    </div>
  );
}

function ToastViewport({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="toast-viewport"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
    >
      {children}
    </div>
  );
}

export { Toast, ToastViewport };
export type { ToastKind, ToastProps };