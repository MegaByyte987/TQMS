import { api } from "@/lib/fetcher";
import type {
  JourneyRowDto,
  QueueCardDto,
  QueueDetailDto,
  QueueListParams,
} from "./types";

function toQuery(params: QueueListParams): string {
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.vehicleName) sp.set("vehicleName", params.vehicleName);
  if (params.cardType) sp.set("cardType", params.cardType);
  if (params.vehicleType) sp.set("vehicleType", params.vehicleType);
  if (params.page) sp.set("page", String(params.page));
  if (params.pageSize) sp.set("pageSize", String(params.pageSize));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const queueApi = {
  list: (params: QueueListParams) =>
    api.get<QueueCardDto[]>(`/queue${toQuery(params)}`),
  get: (id: string) => api.get<QueueDetailDto>(`/queue/${id}`),
  journey: (id: string) =>
    api.get<JourneyRowDto[]>(`/queue/${id}/journey`),
  checkIn: (id: string) =>
    api.post<QueueDetailDto>(`/queue/${id}/check-in`),
  endJourney: (id: string) =>
    api.post<QueueCardDto>(`/queue/${id}/end-journey`),
};