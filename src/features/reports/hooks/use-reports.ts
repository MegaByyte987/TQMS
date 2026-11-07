"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { reportsApi } from "../api";
import type { ReportFilters } from "../types";

export function useCheckpointEntryReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ["reports", "checkpoint-entry", filters],
    queryFn: () => reportsApi.checkpointEntry(filters),
    placeholderData: keepPreviousData,
    enabled: Boolean(filters.fromBS && filters.toBS),
  });
}

export function useDetailEntryReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ["reports", "detail-entry", filters],
    queryFn: () => reportsApi.detailEntry(filters),
    placeholderData: keepPreviousData,
    enabled: Boolean(filters.fromBS && filters.toBS),
  });
}