import { api } from "@/lib/fetcher";
import type { Narration, NarrationListParams } from "./types";
import type { NarrationEditValues } from "./schemas";

function toQuery(params: NarrationListParams): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.page) sp.set("page", String(params.page));
  if (params.pageSize) sp.set("pageSize", String(params.pageSize));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const narrationsApi = {
  list: (params: NarrationListParams = {}) =>
    api.get<Narration[]>(`/narrations${toQuery(params)}`),
  update: (id: string, body: NarrationEditValues) =>
    api.patch<Narration>(`/narrations/${id}`, body),
};