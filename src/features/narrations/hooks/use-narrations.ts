"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { narrationsApi } from "../api";
import type { NarrationListParams } from "../types";

export function useNarrations(params: NarrationListParams = {}) {
  return useQuery({
    queryKey: ["narrations", params],
    queryFn: () => narrationsApi.list(params),
    placeholderData: keepPreviousData,
  });
}