import type { BSDate } from "@/lib/bs-date";

export interface Vehicle {
  id: string;
  "s-n": number;
  plateNo: string;
  lotNo?: string;
  vehicleNumber: string;
  vehicleTypeId: string;
  sthaniyaSanghId: string;
  ownerId: string;
  plateColorId: string;
  plateTypeId: string;
  engineNumber?: string;
  chassisNumber?: string;
  companyName?: string;
  modelNo?: string;
  createdAtBS: BSDate;
}

export interface VehicleListParams {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
}