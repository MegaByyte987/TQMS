import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, created, fieldErrors } from "@/mocks/helpers/response";
import { paginate } from "@/mocks/helpers/paginate";
import { searchRows } from "@/mocks/helpers/filter";
import { otherVehicleFormSchema } from "@/features/others-vehicles/schemas";
import { todayBS } from "@/lib/bs-date";
import type { OtherVehicle } from "@/mocks/types";

export const dynamic = "force-dynamic";

const SORTABLE = new Set(["s-n", "formatedNo"]);

const TYPE_MAP: Record<
  string,
  { prefix: string; numberType: string; plateTypeId: string }
> = {
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

function sortRows(rows: OtherVehicle[], sort: string, order: "asc" | "desc") {
  const field = SORTABLE.has(sort) ? (sort as keyof OtherVehicle) : "sn";
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

  const filtered = searchRows(getDB().otherVehicles, q, ["formatedNo"]);
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

  const parsed = otherVehicleFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return fieldErrors(errors);
  }

  const mapping = TYPE_MAP[parsed.data.othersTypeId] ?? {
    prefix: "OT",
    numberType: "Alphanumeric",
    plateTypeId: "plate-type-private",
  };

  const db = getDB();
  const nextSeq =
    Math.max(
      0,
      ...db.otherVehicles.map((o) => {
        const tail = o.formatedNo.split(" ").pop() ?? "";
        return Number(tail) || 0;
      })
    ) + 1;
  const padded = String(nextSeq).padStart(4, "0");
  const formatedNo = `${mapping.prefix} ${(nextSeq % 9) + 1} CHA ${padded}`;

  const now = todayBS();
  const newEntry: OtherVehicle = {
    id: `oth-${crypto.randomUUID().slice(0, 8)}`,
    "sn": 0,
    formatedNo,
    numberType: mapping.numberType,
    plateTypeId: mapping.plateTypeId,
    othersTypeId: parsed.data.othersTypeId,
    createdAtBS: now,
  };

  mutateDB((db) => {
    newEntry["sn"] =
      Math.max(0, ...db.otherVehicles.map((o) => o["sn"])) + 1;
    db.otherVehicles.push(newEntry);
  });

  return created(newEntry);
}