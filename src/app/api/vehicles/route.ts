import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, created, fieldErrors } from "@/mocks/helpers/response";
import { paginate } from "@/mocks/helpers/paginate";
import { searchRows } from "@/mocks/helpers/filter";
import { vehicleFormSchema } from "@/features/vehicles/schemas";
import { todayBS } from "@/lib/bs-date";
import type { Vehicle } from "@/mocks/types";

export const dynamic = "force-dynamic";

const SORTABLE = new Set(["s-n", "plateNo"]);

function sortRows(rows: Vehicle[], sort: string, order: "asc" | "desc") {
  const field = SORTABLE.has(sort) ? (sort as keyof Vehicle) : "sn";
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

  const filtered = searchRows(getDB().vehicles, q, ["plateNo", "vehicleNumber"]);
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

  const parsed = vehicleFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return fieldErrors(errors);
  }

  const existing = getDB().vehicles.find(
    (v) => v.plateNo.toLowerCase() === parsed.data.plateNo.toLowerCase()
  );
  if (existing) {
    return fieldErrors({ plateNo: ["A vehicle with this plate already exists."] });
  }

  const now = todayBS();
  const newVehicle: Vehicle = {
    id: `veh-${crypto.randomUUID().slice(0, 8)}`,
    "sn": 0,
    plateNo: parsed.data.plateNo,
    lotNo: parsed.data.lotNo || undefined,
    vehicleNumber: parsed.data.vehicleNumber,
    vehicleTypeId: parsed.data.vehicleTypeId,
    sthaniyaSanghId: parsed.data.sthaniyaSanghId,
    ownerId: parsed.data.ownerId,
    plateColorId: parsed.data.plateColorId,
    plateTypeId: parsed.data.plateTypeId,
    engineNumber: parsed.data.engineNumber || undefined,
    chassisNumber: parsed.data.chassisNumber || undefined,
    companyName: parsed.data.companyName || undefined,
    modelNo: parsed.data.modelNo || undefined,
    createdAtBS: now,
  };

  mutateDB((db) => {
    newVehicle["sn"] =
      Math.max(0, ...db.vehicles.map((v) => v["sn"])) + 1;
    db.vehicles.push(newVehicle);
  });

  return created(newVehicle);
}