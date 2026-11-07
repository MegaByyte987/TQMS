"use client";

import { useQuery } from "@tanstack/react-query";
import { qrApi } from "../api";

export function useQr() {
  return useQuery({
    queryKey: ["qr", "current"],
    queryFn: () => qrApi.generate(),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
}