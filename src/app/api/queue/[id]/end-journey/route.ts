import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, notFound, conflict } from "@/mocks/helpers/response";

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
  if (existing.status !== "in_job") {
    return conflict("Only entries in job can be ended.");
  }

  const updated = mutateDB((db) => {
    const target = db.queue.find((q) => q.id === id);
    if (!target) return null;
    target.status = "payment_pending";
    return target;
  });

  if (!updated) return notFound("Queue entry not found.");
  return ok({ id: updated.id, status: updated.status });
}