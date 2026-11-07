"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queueApi } from "../api";
import type { QueueListParams } from "../types";

export function usePendingQueue(params: QueueListParams) {
  return useQuery({
    queryKey: ["queue", "pending", params],
    queryFn: () => queueApi.list({ ...params, status: "pending" }),
    placeholderData: keepPreviousData,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
}