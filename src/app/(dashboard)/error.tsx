"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-8 text-center">
      <h2 className="text-lg font-semibold leading-[1.2] tracking-[-0.03em] text-[var(--color-bad)]">
        Something went wrong
      </h2>
      <p className="text-[14px] leading-[1.5] text-[var(--color-mut)]">
        {error.message}
      </p>
      <Button variant="outline" onClick={reset} className="mt-2">
        Try again
      </Button>
    </div>
  );
}