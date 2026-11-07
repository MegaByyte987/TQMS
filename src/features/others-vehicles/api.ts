import { api } from "@/lib/fetcher";
import type { OtherVehicle, OtherVehicleListParams } from "./types";
import type { OtherVehicleFormValues } from "./schemas";

function toQuery(params: OtherVehicleListParams): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.page) sp.set("page", String(params.page));
  if (params.pageSize) sp.set("pageSize", String(params.pageSize));
  if (params.sort) sp.set("sort", params.sort);
  if (params.order) sp.set("order", params.order);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const othersVehiclesApi = {
  list: (params: OtherVehicleListParams) =>
    api.get<OtherVehicle[]>(`/others-vehicles${toQuery(params)}`),
  get: (id: string) => api.get<OtherVehicle>(`/others-vehicles/${id}`),
  create: (body: OtherVehicleFormValues) =>
    api.post<OtherVehicle>("/others-vehicles", body),
  update: (id: string, body: OtherVehicleFormValues) =>
    api.patch<OtherVehicle>(`/others-vehicles/${id}`, body),
};