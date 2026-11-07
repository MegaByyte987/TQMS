import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, notFound, fieldErrors } from "@/mocks/helpers/response";
import { narrationEditSchema } from "@/features/narrations/schemas";
import { todayBS } from "@/lib/bs-date";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;

  const existing = getDB().narrations.find((n) => n.id === id);
  if (!existing) return notFound("Narration not found.");

  const body = (await request.json().catch(() => null)) as unknown;
  if (!body) return fieldErrors({ _: ["Invalid JSON body."] });

  const parsed = narrationEditSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return fieldErrors(errors);
  }

  const updated = mutateDB((db) => {
    const target = db.narrations.find((n) => n.id === id);
    if (!target) return null;
    target.text = parsed.data.text;
    target.updatedAtBS = todayBS();
    return target;
  });

  if (!updated) return notFound("Narration not found.");
  return ok(updated);
}