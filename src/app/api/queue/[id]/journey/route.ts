import { getDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, notFound } from "@/mocks/helpers/response";
import type { JourneyRowDto, CheckpointVisit } from "@/features/queue/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;
  const db = getDB();
  const entry = db.queue.find((q) => q.id === id);
  if (!entry) return notFound("Queue entry not found.");

  // The queue entry stores a journey array (up to 3 rows). Build the
  // fixed-length tuple of nullable visits expected by JourneyRowDto.
  const checkpoints: [
    CheckpointVisit | null,
    CheckpointVisit | null,
    CheckpointVisit | null,
  ] = [null, null, null];

  entry.journey.forEach((j) => {
    const idx = j.sequence - 1;
    if (idx >= 0 && idx < 3) {
      checkpoints[idx] = {
        name: j.checkpointName,
        weightKg: j.weightKg,
        billNo: j.billNo,
      };
    }
  });

  const fromCp = db.checkpoints.find((c) => c.value === entry.fromCheckpointId);
  const toCp = db.checkpoints.find((c) => c.value === entry.toCheckpointId);

  const row: JourneyRowDto = {
    id: `${entry.id}-journey`,
    queueId: entry.id,
    sN: 1,
    entryDateBS: entry.entryDateBS as JourneyRowDto["entryDateBS"],
    from: fromCp?.label ?? "—",
    to: toCp?.label ?? "—",
    checkpoints,
  };

  return ok([row]);
}