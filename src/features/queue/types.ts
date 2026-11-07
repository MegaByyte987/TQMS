import type { BSDate } from "@/lib/bs-date";

export type QueueStatus =
  | "pending"
  | "in_queue"
  | "in_job"
  | "unregistered"
  | "payment_pending"
  | "closed";

/** Card-shaped DTO returned by /api/queue — one row per card. */
export interface QueueCardDto {
  id: string;
  receiptNo: string;
  status: QueueStatus;
  queueNumber?: string;
  entryDateBS: BSDate;
  vehicleNo: string;
  vehicleType: string;
  fromCheckpoint: string;
  toCheckpoint: string;
  routeLabel: string;
  loadDetails: string;
  weightKg: number;
  transportCompany?: string;
  ownerName?: string;
  isRegistered: boolean;
  cardRegistered: boolean;
}

/** Detail DTO returned by /api/queue/:id — the check-in panel's 15 fields. */
export interface QueueDetailDto extends QueueCardDto {
  lastCheckpoint: string;
  driverPhone?: string;
  vehicleStatus: string;
  cardTypeLabel?: string;
}

export interface CheckpointVisit {
  name: string;
  weightKg: number;
  billNo: string;
}

/** One row of the CP1–CP3 journey table. Checkpoints may be null if unvisited. */
export interface JourneyRowDto {
  id: string;
  queueId: string;
  sN: number;
  entryDateBS: BSDate;
  from: string;
  to: string;
  checkpoints: [CheckpointVisit | null, CheckpointVisit | null, CheckpointVisit | null];
}

export interface QueueListParams {
  status?: QueueStatus | "all";
  vehicleName?: string;
  cardType?: string;
  vehicleType?: string;
  page?: number;
  pageSize?: number;
}

export interface EndJourneyPayload {
  queueId: string;
}