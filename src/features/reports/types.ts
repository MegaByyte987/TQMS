import type { BSDate } from "@/lib/bs-date";

export interface CheckpointEntryRow {
  id: string;
  "s-n": number;
  sthaniyaSangh: string;
  checkpoint: string;
  checkpointUser: string;
  entryDateBS: BSDate;
  totalVehicle: number;
  totalAmount: number;
}

export interface DetailEntryRow {
  id: string;
  "s-n": number;
  dateTime: string;
  receiptNo: string;
  vehicleNo: string;
  vehicleType: string;
  checkpointName: string;
  route: string;
  grossWeightKg: number;
  material: string;
  remarks: string;
}

export interface ReportFilters {
  userId?: string;
  fromBS?: string;
  toBS?: string;
  vehicleNo?: string;
  goods?: string;
  billNo?: string;
  page?: number;
  pageSize?: number;
}