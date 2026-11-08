"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] p-8 text-center text-[var(--color-fg)]">
      <h1 className="text-3xl font-semibold leading-[1.04] tracking-[-0.055em]">
        Something went wrong
      </h1>
      <p className="max-w-md text-[16px] leading-[1.5] text-[var(--color-mut)]">
        {error.message}
      </p>
      <Button onClick={reset} className="mt-2">
        Try again
      </Button>
    </main>
  );
}