import type { BSDate } from "@/lib/bs-date";

export interface OtherVehicle {
  id: string;
  "s-n": number;
  formatedNo: string;
  numberType: string;
  plateTypeId: string;
  othersTypeId: string;
  createdAtBS: BSDate;
}

export interface OtherVehicleListParams {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
}