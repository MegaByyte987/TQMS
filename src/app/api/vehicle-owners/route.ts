import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, created, fieldErrors } from "@/mocks/helpers/response";
import { paginate } from "@/mocks/helpers/paginate";
import { searchRows } from "@/mocks/helpers/filter";
import { vehicleOwnerFormSchema } from "@/features/vehicle-owners/schemas";
import { todayBS } from "@/lib/bs-date";
import type { VehicleOwner } from "@/mocks/types";

export const dynamic = "force-dynamic";

const SORTABLE = new Set(["sn", "name"]);

function sortRows(rows: VehicleOwner[], sort: string, order: "asc" | "desc") {
  const field = SORTABLE.has(sort) ? (sort as keyof VehicleOwner) : "sn";
  const dir = order === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}

export async function GET(request: Request) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();

  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "25");
  const sort = url.searchParams.get("sort") ?? "s-n";
  const order: "asc" | "desc" =
    url.searchParams.get("order") === "desc" ? "desc" : "asc";

  const filtered = searchRows(getDB().vehicleOwners, q, ["name"]);
  const sorted = sortRows(filtered, sort, order);
  const paged = paginate(sorted, { page, pageSize });
  return ok(paged.items, paged.meta);
}

export async function POST(request: Request) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();

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

  const now = todayBS();
  const newOwner: VehicleOwner = {
    id: `vo-${crypto.randomUUID().slice(0, 8)}`,
    "sn": 0,
    name: parsed.data.name,
    stateId: parsed.data.stateId,
    districtId: parsed.data.districtId,
    localLevel: parsed.data.localLevel || undefined,
    streetAddress: parsed.data.streetAddress || undefined,
    email: parsed.data.email || undefined,
    panNumber: parsed.data.panNumber || undefined,
    phoneNumber: parsed.data.phoneNumber,
    isIndividual: parsed.data.isIndividual,
    contactPerson:
      !parsed.data.isIndividual && parsed.data.contactName
        ? {
            name: parsed.data.contactName,
            email: parsed.data.contactEmail || undefined,
            phone: parsed.data.contactPhone ?? "",
          }
        : undefined,
    registration:
      !parsed.data.isIndividual && parsed.data.registrationNumber
        ? { number: parsed.data.registrationNumber }
        : undefined,
    createdAtBS: now,
  };

  mutateDB((db) => {
    newOwner["sn"] =
      Math.max(0, ...db.vehicleOwners.map((o) => o["sn"])) + 1;
    db.vehicleOwners.push(newOwner);
  });

  return created(newOwner);
}