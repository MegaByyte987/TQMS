import { api } from "@/lib/fetcher";
import type {
  CheckpointEntryRow,
  DetailEntryRow,
  ReportFilters,
} from "./types";

function toQuery(filters: ReportFilters): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") sp.set(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const reportsApi = {
  checkpointEntry: (filters: ReportFilters) =>
    api.get<CheckpointEntryRow[]>(
      `/reports/checkpoint-entry${toQuery(filters)}`
    ),
  detailEntry: (filters: ReportFilters) =>
    api.get<DetailEntryRow[]>(`/reports/detail-entry${toQuery(filters)}`),
  detailEntryExportUrl: (filters: ReportFilters) =>
    `/api/reports/detail-entry/export${toQuery(filters)}`,
};