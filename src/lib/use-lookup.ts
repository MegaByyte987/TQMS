"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";

interface UseLookupOptions {
  enabled?: boolean;
}

export function useLookup(
  type: string,
  parentId?: string,
  { enabled = true }: UseLookupOptions = {}
) {
  return useQuery({
    queryKey: ["lookup", type, parentId ?? null],
    queryFn: async () => {
      const qs = parentId ? `?parentId=${encodeURIComponent(parentId)}` : "";
      const res = await api.get<LookupOption[]>(`/lookup/${type}${qs}`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}