import { api } from "@/lib/fetcher";
import type { CheckUser, CheckUserListParams } from "./types";
import type { CheckUserFormValues } from "./schemas";

function toQuery(params: CheckUserListParams): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.page) sp.set("page", String(params.page));
  if (params.pageSize) sp.set("pageSize", String(params.pageSize));
  if (params.sort) sp.set("sort", params.sort);
  if (params.order) sp.set("order", params.order);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const checkUsersApi = {
  list: (params: CheckUserListParams) =>
    api.get<CheckUser[]>(`/check-users${toQuery(params)}`),
  get: (id: string) => api.get<CheckUser>(`/check-users/${id}`),
  create: (body: CheckUserFormValues) =>
    api.post<CheckUser>("/check-users", body),
  update: (id: string, body: CheckUserFormValues) =>
    api.patch<CheckUser>(`/check-users/${id}`, body),
  remove: (id: string) => api.delete<null>(`/check-users/${id}`),
};