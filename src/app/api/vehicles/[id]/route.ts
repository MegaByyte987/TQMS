import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, notFound, fieldErrors } from "@/mocks/helpers/response";
import { vehicleFormSchema } from "@/features/vehicles/schemas";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;
  const vehicle = getDB().vehicles.find((v) => v.id === id);
  if (!vehicle) return notFound("Vehicle not found.");
  return ok(vehicle);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;

  const existing = getDB().vehicles.find((v) => v.id === id);
  if (!existing) return notFound("Vehicle not found.");

  const body = (await request.json().catch(() => null)) as unknown;
  if (!body) return fieldErrors({ _: ["Invalid JSON body."] });

  const parsed = vehicleFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return fieldErrors(errors);
  }

  const conflict = getDB().vehicles.find(
    (v) =>
      v.id !== id &&
      v.plateNo.toLowerCase() === parsed.data.plateNo.toLowerCase()
  );
  if (conflict) {
    return fieldErrors({ plateNo: ["A vehicle with this plate already exists."] });
  }

  const updated = mutateDB((db) => {
    const target = db.vehicles.find((v) => v.id === id);
    if (!target) return null;
    target.plateNo = parsed.data.plateNo;
    target.lotNo = parsed.data.lotNo || undefined;
    target.vehicleNumber = parsed.data.vehicleNumber;
    target.vehicleTypeId = parsed.data.vehicleTypeId;
    target.sthaniyaSanghId = parsed.data.sthaniyaSanghId;
    target.ownerId = parsed.data.ownerId;
    target.plateColorId = parsed.data.plateColorId;
    target.plateTypeId = parsed.data.plateTypeId;
    target.engineNumber = parsed.data.engineNumber || undefined;
    target.chassisNumber = parsed.data.chassisNumber || undefined;
    target.companyName = parsed.data.companyName || undefined;
    target.modelNo = parsed.data.modelNo || undefined;
    return target;
  });

  if (!updated) return notFound("Vehicle not found.");
  return ok(updated);
}