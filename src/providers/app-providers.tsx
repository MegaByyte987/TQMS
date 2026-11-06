"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Tooltip } from "radix-ui";
import { useState, type ReactNode } from "react";
import { makeQueryClient } from "@/lib/query-client";
import { ToastProvider } from "./toast-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider delayDuration={200} skipDelayDuration={300}>
        <ToastProvider>{children}</ToastProvider>
      </Tooltip.Provider>
    </QueryClientProvider>
  );
}