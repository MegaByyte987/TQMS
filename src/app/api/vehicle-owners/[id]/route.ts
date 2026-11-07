import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, notFound, fieldErrors } from "@/mocks/helpers/response";
import { vehicleOwnerFormSchema } from "@/features/vehicle-owners/schemas";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;
  const owner = getDB().vehicleOwners.find((o) => o.id === id);
  if (!owner) return notFound("Owner not found.");
  return ok(owner);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;

  const existing = getDB().vehicleOwners.find((o) => o.id === id);
  if (!existing) return notFound("Owner not found.");

  const body = (await request.json().catch(() => null)) as unknown;
  if (!body) return fieldErrors({ _: ["Invalid JSON body."] });

  const parsed = vehicleOwnerFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return fieldErrors(errors);
  }

  const updated = mutateDB((db) => {
    const target = db.vehicleOwners.find((o) => o.id === id);
    if (!target) return null;
    target.name = parsed.data.name;
    target.stateId = parsed.data.stateId;
    target.districtId = parsed.data.districtId;
    target.localLevel = parsed.data.localLevel || undefined;
    target.streetAddress = parsed.data.streetAddress || undefined;
    target.email = parsed.data.email || undefined;
    target.panNumber = parsed.data.panNumber || undefined;
    target.phoneNumber = parsed.data.phoneNumber;
    target.isIndividual = parsed.data.isIndividual;
    target.contactPerson =
      !parsed.data.isIndividual && parsed.data.contactName
        ? {
            name: parsed.data.contactName,
            email: parsed.data.contactEmail || undefined,
            phone: parsed.data.contactPhone ?? "",
          }
        : undefined;
    target.registration =
      !parsed.data.isIndividual && parsed.data.registrationNumber
        ? { number: parsed.data.registrationNumber }
        : undefined;
    return target;
  });

  if (!updated) return notFound("Owner not found.");
  return ok(updated);
}