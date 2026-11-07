import type { BSDate } from "@/lib/bs-date";

export interface VehicleOwner {
  id: string;
  "s-n": number;
  name: string;
  logoUrl?: string;
  stateId: string;
  districtId: string;
  localLevel?: string;
  streetAddress?: string;
  email?: string;
  panNumber?: string;
  phoneNumber: string;
  isIndividual: boolean;
  contactPerson?: {
    name: string;
    email?: string;
    phone: string;
  };
  registration?: {
    number: string;
    documentUrl?: string;
  };
  createdAtBS: BSDate;
}

export interface VehicleOwnerListParams {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
}