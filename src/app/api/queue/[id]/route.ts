import { getDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, notFound } from "@/mocks/helpers/response";
import type { QueueDetailDto } from "@/features/queue/types";

export const dynamic = "force-dynamic";

/**
 * Builds the detail DTO for a queue entry by joining the entry against
 * vehicles, owners, receipts, and checkpoints. Shared by the GET handler
 * and by check-in/end-journey handlers that need to return the updated DTO.
 */
export function buildQueueDetail(id: string): QueueDetailDto | null {
  const db = getDB();
  const entry = db.queue.find((q) => q.id === id);
  if (!entry) return null;

  const vehicle = db.vehicles.find((v) => v.id === entry.vehicleId);
  const owner = entry.ownerId
    ? db.vehicleOwners.find((o) => o.id === entry.ownerId)
    : undefined;
  const receipt = db.receipts.find((r) => r.receiptNo === entry.receiptNo);
  const fromCp = db.checkpoints.find((c) => c.value === entry.fromCheckpointId);
  const toCp = db.checkpoints.find((c) => c.value === entry.toCheckpointId);
  const lastCp = entry.lastCheckpointId
    ? db.checkpoints.find((c) => c.value === entry.lastCheckpointId)
    : undefined;

  const vehicleType =
    vehicle?.vehicleTypeId === "vehicle-type-truck"
      ? "Truck"
      : vehicle?.vehicleTypeId === "vehicle-type-tipper"
        ? "Tipper"
        : vehicle?.vehicleTypeId === "vehicle-type-container"
          ? "Container"
          : vehicle?.vehicleTypeId === "vehicle-type-tanker"
            ? "Tanker"
            : "—";

  return {
    id: entry.id,
    receiptNo: entry.receiptNo,
    status: entry.status as QueueDetailDto["status"],
    queueNumber: entry.queueNumber,
    entryDateBS: entry.entryDateBS as QueueDetailDto["entryDateBS"],
    vehicleNo: receipt?.vehicleNo ?? vehicle?.plateNo ?? "—",
    vehicleType,
    fromCheckpoint: fromCp?.label ?? "—",
    toCheckpoint: toCp?.label ?? "—",
    routeLabel:
      fromCp && toCp ? `${fromCp.label} → ${toCp.label}` : "—",
    loadDetails: receipt?.goods ?? "—",
    weightKg: receipt?.weightKg ?? 0,
    transportCompany: entry.transportCompany,
    ownerName: owner?.name,
    isRegistered: entry.isRegistered,
    cardRegistered: entry.cardRegistered,
    lastCheckpoint: lastCp?.label ?? "—",
    driverPhone: entry.driverPhone,
    vehicleStatus: "Active",
    cardTypeLabel: entry.cardRegistered ? "Sthaniya" : "General",
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;
  const detail = buildQueueDetail(id);
  if (!detail) return notFound("Queue entry not found.");
  return ok(detail);
}