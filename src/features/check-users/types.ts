import type { BSDate } from "@/lib/bs-date";

export interface CheckUser {
  id: string;
  "sn": number;
  name: string;
  stateId: string;
  districtId: string;
  streetAddress?: string;
  mobileNumber: string;
  email?: string;
  status: boolean;
  createdAtBS: BSDate;
}

export interface CheckUserListParams {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
}