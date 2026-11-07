"use client";

import { useQuery } from "@tanstack/react-query";
import { queueApi } from "../api";

export function useQueueDetail(id: string | null) {
  return useQuery({
    queryKey: ["queue", "detail", id],
    queryFn: async () => (await queueApi.get(id!)).data,
    enabled: Boolean(id),
  });
}