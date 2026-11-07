import type { BSDate } from "@/lib/bs-date";

export interface CheckUser {
  id: string;
  sn: number;                 
  name: string;
  stateId: string;
  districtId: string;
  streetAddress?: string;
  mobileNumber: string;
  email?: string;
  status: boolean;            
  createdAtBS: BSDate;
}

export interface Narration {
  id: string;
  sn: number;
  text: string;
  updatedAtBS: BSDate;
}

export interface VehicleOwner {
  id: string;
  sn: number;
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
  contactPerson?: { name: string; email?: string; phone: string };
  registration?: { number: string; documentUrl?: string };
  createdAtBS: BSDate;
}

export interface Vehicle {
  id: string;
  sn: number;
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

export interface OtherVehicle {
  id: string;
  sn: number;
  formatedNo: string;
  numberType: string;
  plateTypeId: string;
  othersTypeId: string;
  createdAtBS: BSDate;
}

export interface FeeLine {
  label: string;
  amount: number;
}

export interface Receipt {
  receiptNo: string;
  type: "loadboard-sthaniya";
  dateBS: BSDate;
  time: string;                // "10:12 PM"
  weighStationId: string;
  vehicleNo: string;
  goods: string;
  description: string;
  weightKg: number;
  feeLines: FeeLine[];
  totalAmount: number;
}

export type QueueStatus =
  | "pending"
  | "in_queue"
  | "in_job"
  | "unregistered"
  | "payment_pending"
  | "closed";

export interface JourneyRow {
  sequence: 1 | 2 | 3;
  entryDateBS: BSDate;
  from: string;
  to: string;
  weightKg: number;
  checkpointName: string;
  billNo: string;
}

export interface QueueEntry {
  id: string;
  receiptNo: string;
  status: QueueStatus;
  queueNumber?: string;
  entryDateBS: BSDate;
  lastCheckpointId?: string;
  routeId: string;
  fromCheckpointId: string;
  toCheckpointId: string;
  transportCompany?: string;
  driverPhone?: string;
  vehicleId: string;           // internal — denormalised to vehicleNo in the API
  ownerId?: string;
  isRegistered: boolean;
  cardRegistered: boolean;
  journey: JourneyRow[];        // fixed at 3 entries or fewer
  createdAtBS: BSDate;
}