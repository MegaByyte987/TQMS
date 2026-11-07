import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, notFound, conflict } from "@/mocks/helpers/response";
import { todayBS } from "@/lib/bs-date";
import { buildQueueDetail } from "../route";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;

  const existing = getDB().queue.find((q) => q.id === id);
  if (!existing) return notFound("Queue entry not found.");
  if (existing.status !== "pending") {
    return conflict("This entry has already been checked in.");
  }

  const queueNumber = `QN-${Math.floor(Math.random() * 9000 + 1000)}`;
  const now = todayBS();

  mutateDB((db) => {
    const target = db.queue.find((q) => q.id === id);
    if (!target) return;
    target.status = "in_job";
    target.queueNumber = queueNumber;
    target.entryDateBS = now;
    target.lastCheckpointId = target.fromCheckpointId;
  });

  const detail = buildQueueDetail(id);
  if (!detail) return notFound("Queue entry not found.");
  return ok(detail);
}