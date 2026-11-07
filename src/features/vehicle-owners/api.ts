import { api } from "@/lib/fetcher";
import type { VehicleOwner, VehicleOwnerListParams } from "./types";
import type { VehicleOwnerFormValues } from "./schemas";

function toQuery(params: VehicleOwnerListParams): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.page) sp.set("page", String(params.page));
  if (params.pageSize) sp.set("pageSize", String(params.pageSize));
  if (params.sort) sp.set("sort", params.sort);
  if (params.order) sp.set("order", params.order);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const vehicleOwnersApi = {
  list: (params: VehicleOwnerListParams) =>
    api.get<VehicleOwner[]>(`/vehicle-owners${toQuery(params)}`),
  get: (id: string) => api.get<VehicleOwner>(`/vehicle-owners/${id}`),
  create: (body: VehicleOwnerFormValues) =>
    api.post<VehicleOwner>("/vehicle-owners", body),
  update: (id: string, body: VehicleOwnerFormValues) =>
    api.patch<VehicleOwner>(`/vehicle-owners/${id}`, body),
};