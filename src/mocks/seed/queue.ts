import type { QueueEntry, QueueStatus, JourneyRow } from "@/mocks/types";
import { receipts } from "./receipts";

const STATUSES: QueueStatus[] = ["pending", "in_queue", "in_job", "unregistered", "payment_pending", "closed"];

export const queue: QueueEntry[] = receipts.map((receipt, i) => {
  const status = STATUSES[i % STATUSES.length];
  const journeyCount = status === "closed" || status === "payment_pending" ? 3 : status === "in_job" ? 2 : 1;
  const journey: JourneyRow[] = Array.from({ length: journeyCount }, (_, j) => ({
    sequence: (j + 1) as 1 | 2 | 3,
    entryDateBS: receipt.dateBS,
    from: `Checkpoint ${j + 1}`,
    to: `Checkpoint ${j + 2}`,
    weightKg: receipt.weightKg - j * 100,
    checkpointName: `Checkpoint ${(i + j) % 8 + 1}`,
    billNo: receipt.receiptNo,
  }));

  return {
    id: `q-${String(i + 1).padStart(4, "0")}`,
    receiptNo: receipt.receiptNo,
    status,
    queueNumber: status === "pending" ? undefined : `QN-${String(i + 1).padStart(4, "0")}`,
    entryDateBS: receipt.dateBS,
    lastCheckpointId: `cp-${(i % 8) + 1}`,
    routeId: `route-${(i % 3) + 1}`,
    fromCheckpointId: `cp-${(i % 8) + 1}`,
    toCheckpointId: `cp-${((i + 3) % 8) + 1}`,
    transportCompany: i % 3 === 0 ? undefined : `Transport Co ${i % 5 + 1}`,
    driverPhone: `98${String(43000000 + i * 137).slice(0, 8)}`,
    vehicleId: `veh-${String((i % 38) + 1).padStart(3, "0")}`,
    ownerId: i < 30 ? `vo-c-${String((i % 8) + 1).padStart(3, "0")}` : undefined,
    isRegistered: i % 5 !== 0,
    cardRegistered: i % 4 === 0,
    journey,
    createdAtBS: receipt.dateBS,
  };
});
