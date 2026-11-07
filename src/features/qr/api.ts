import { api } from "@/lib/fetcher";
import type { QrDto } from "./types";

export const qrApi = {
  generate: () => api.get<QrDto>("/qr/generate"),
};