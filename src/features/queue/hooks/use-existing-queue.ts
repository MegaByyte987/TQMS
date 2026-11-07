"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queueApi } from "../api";
import type { QueueListParams } from "../types";

export function useExistingQueue(params: QueueListParams) {
  return useQuery({
    queryKey: ["queue", "existing", params],
    queryFn: () => queueApi.list(params),
    placeholderData: keepPreviousData,
  });
}