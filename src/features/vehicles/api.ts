import { api } from "@/lib/fetcher";
import type { Vehicle, VehicleListParams } from "./types";
import type { VehicleFormValues } from "./schemas";

function toQuery(params: VehicleListParams): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.page) sp.set("page", String(params.page));
  if (params.pageSize) sp.set("pageSize", String(params.pageSize));
  if (params.sort) sp.set("sort", params.sort);
  if (params.order) sp.set("order", params.order);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const vehiclesApi = {
  list: (params: VehicleListParams) =>
    api.get<Vehicle[]>(`/vehicles${toQuery(params)}`),
  get: (id: string) => api.get<Vehicle>(`/vehicles/${id}`),
  create: (body: VehicleFormValues) => api.post<Vehicle>("/vehicles", body),
  update: (id: string, body: VehicleFormValues) =>
    api.patch<Vehicle>(`/vehicles/${id}`, body),
};