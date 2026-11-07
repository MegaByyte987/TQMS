import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, notFound, fieldErrors } from "@/mocks/helpers/response";
import { otherVehicleFormSchema } from "@/features/others-vehicles/schemas";

export const dynamic = "force-dynamic";

const PREFIX_MAP: Record<string, { prefix: string; numberType: string; plateTypeId: string }> = {
  "others-type-temporary": {
    prefix: "XX",
    numberType: "Alphanumeric",
    plateTypeId: "plate-type-private",
  },
  "others-type-third-party": {
    prefix: "TP",
    numberType: "Alphanumeric",
    plateTypeId: "plate-type-public",
  },
  "others-type-unregistered": {
    prefix: "UR",
    numberType: "Numeric",
    plateTypeId: "plate-type-government",
  },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;
  const entry = getDB().otherVehicles.find((o) => o.id === id);
  if (!entry) return notFound("Entry not found.");
  return ok(entry);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const { id } = await params;

  const existing = getDB().otherVehicles.find((o) => o.id === id);
  if (!existing) return notFound("Entry not found.");

  const body = (await request.json().catch(() => null)) as unknown;
  if (!body) return fieldErrors({ _: ["Invalid JSON body."] });

  const parsed = otherVehicleFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return fieldErrors(errors);
  }

  const mapping = PREFIX_MAP[parsed.data.othersTypeId] ?? {
    prefix: "OT",
    numberType: "Alphanumeric",
    plateTypeId: "plate-type-private",
  };

  const updated = mutateDB((db) => {
    const target = db.otherVehicles.find((o) => o.id === id);
    if (!target) return null;
    const parts = target.formatedNo.split(" ");
    const tail = parts.slice(1).join(" ");
    target.formatedNo = `${mapping.prefix} ${tail}`;
    target.numberType = mapping.numberType;
    target.plateTypeId = mapping.plateTypeId;
    target.othersTypeId = parsed.data.othersTypeId;
    return target;
  });

  if (!updated) return notFound("Entry not found.");
  return ok(updated);
}