import type { BSDate } from "@/lib/bs-date";

export interface FeeLine {
  label: string;
  amount: number;
}

export interface ReceiptDto {
  receiptNo: string;
  type: string;
  dateBS: BSDate;
  time: string;
  weighStation: string;
  vehicleNo: string;
  goods: string;
  description: string;
  weightKg: number;
  feeLines: FeeLine[];
  totalAmount: number;
}

export interface CreatedQueueDto {
  id: string;
  receiptNo: string;
  status: "pending";
  entryDateBS: BSDate;
}

export interface CreateQueueResponse {
  queue: CreatedQueueDto;
  receipt: ReceiptDto;
}

/** Draft shape used by the live preview before submit. */
export interface ReceiptDraft {
  /** Populated only after the server issues the receipt. */
  receiptNo?: string;
  dateBS: string;
  time: string;
  weighStation: string;
  vehicleNo: string;
  goods: string;
  description: string;
  weightKg: number;
  feeLines: FeeLine[];
}