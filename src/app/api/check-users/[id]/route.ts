import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, notFound, noContent, fieldErrors } from "@/mocks/helpers/response";
import { checkUserFormSchema } from "@/features/check-users/schemas";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;
  const user = getDB().checkUsers.find((u) => u.id === id);
  if (!user) return notFound("User not found.");
  return ok(user);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;

  const existing = getDB().checkUsers.find((u) => u.id === id);
  if (!existing) return notFound("User not found.");

  const body = (await request.json().catch(() => null)) as unknown;
  if (!body) return fieldErrors({ _: ["Invalid JSON body."] });

  const parsed = checkUserFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return fieldErrors(errors);
  }

  const updated = mutateDB((db) => {
    const target = db.checkUsers.find((u) => u.id === id);
    if (!target) return null;
    target.name = parsed.data.name;
    target.stateId = parsed.data.stateId;
    target.districtId = parsed.data.districtId;
    target.streetAddress = parsed.data.streetAddress || undefined;
    target.mobileNumber = parsed.data.mobileNumber;
    target.email = parsed.data.email || undefined;
    return target;
  });

  if (!updated) return notFound("User not found.");
  return ok(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;

  const removed = mutateDB((db) => {
    const index = db.checkUsers.findIndex((u) => u.id === id);
    if (index === -1) return false;
    db.checkUsers.splice(index, 1);
    return true;
  });

  if (!removed) return notFound("User not found.");
  return noContent();
}