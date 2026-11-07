"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api";

export function useSession() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const envelope = await authApi.me();
      return envelope.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}