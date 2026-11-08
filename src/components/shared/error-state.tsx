"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/fetcher";
import { cn } from "@/lib/cn";

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}

function humanMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) return "Network error. Check your connection.";
    if (error.status === 401) return "Your session has expired. Sign in again.";
    if (error.status === 404) return "The requested record was not found.";
    if (error.status >= 500) return "The server encountered an error. Please try again.";
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}

export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[12px] border border-[var(--color-badw)] bg-[var(--color-badw)] px-6 py-10 text-center",
        className
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-[var(--color-badw)] text-[var(--color-bad)]">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-[var(--color-bad)]">
          Could not load data
        </p>
        <p className="max-w-md text-sm text-[var(--color-bad)]">{humanMessage(error)}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-1">
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  );
}