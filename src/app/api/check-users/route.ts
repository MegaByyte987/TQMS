import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, created, fieldErrors } from "@/mocks/helpers/response";
import { paginate } from "@/mocks/helpers/paginate";
import { searchRows } from "@/mocks/helpers/filter";
import { checkUserFormSchema } from "@/features/check-users/schemas";
import { todayBS } from "@/lib/bs-date";
import type { CheckUser } from "@/mocks/types";

export const dynamic = "force-dynamic";

const SORTABLE = new Set(["s-n", "name"]);

function sortRows(rows: CheckUser[], sort: string, order: "asc" | "desc") {
  const field = SORTABLE.has(sort) ? sort : "s-n";
  const dir = order === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const av = a[field as keyof CheckUser];
    const bv = b[field as keyof CheckUser];
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

  const filtered = searchRows(getDB().checkUsers, q, ["name"]);
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

  const parsed = checkUserFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return fieldErrors(errors);
  }

  const now = todayBS();
  const newUser: CheckUser = {
    id: `cu-${crypto.randomUUID().slice(0, 8)}`,
    "sn": 0,
    name: parsed.data.name,
    stateId: parsed.data.stateId,
    districtId: parsed.data.districtId,
    streetAddress: parsed.data.streetAddress || undefined,
    mobileNumber: parsed.data.mobileNumber,
    email: parsed.data.email || undefined,
    status: true,
    createdAtBS: now,
  };

  mutateDB((db) => {
    newUser["sn"] =
      Math.max(0, ...db.checkUsers.map((u) => u["sn"])) + 1;
    db.checkUsers.push(newUser);
  });

  return created(newUser);
}