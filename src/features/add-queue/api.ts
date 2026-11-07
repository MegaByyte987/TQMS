import { api } from "@/lib/fetcher";
import type { AddQueueFormValues } from "./schemas";
import type { CreateQueueResponse, ReceiptDto } from "./types";

export const addQueueApi = {
  create: (values: AddQueueFormValues) =>
    api.post<CreateQueueResponse>("/queue", values),
  receipt: (receiptNo: string) =>
    api.get<ReceiptDto>(`/receipts/${receiptNo}`),
};