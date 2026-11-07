"use client";

import { useQuery } from "@tanstack/react-query";
import { queueApi } from "../api";

export function useJourney(queueId: string | null) {
  return useQuery({
    queryKey: ["queue", "journey", queueId],
    queryFn: async () => (await queueApi.journey(queueId!)).data,
    enabled: Boolean(queueId),
  });
}