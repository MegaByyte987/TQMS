import { getDB, mutateDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, created, fieldErrors } from "@/mocks/helpers/response";
import { paginate } from "@/mocks/helpers/paginate";
import { searchRows, filterIn } from "@/mocks/helpers/filter";
import { addQueueFormSchema } from "@/features/add-queue/schemas";
import { nextReceiptNo } from "@/mocks/helpers/receipt-number";
import { todayBS } from "@/lib/bs-date";
import type {
  QueueCardDto,
  QueueDetailDto,
} from "@/features/queue/types";
import type { CheckUser } from "@/mocks/types";

export const dynamic = "force-dynamic";

// ---------- Shared join helper ----------
function denormalize(
  entry: { id: string; receiptNo: string; status: string; queueNumber?: string; entryDateBS: string; vehicleId: string; ownerId?: string; routeId: string; fromCheckpointId: string; toCheckpointId: string; lastCheckpointId?: string; transportCompany?: string; driverPhone?: string; isRegistered: boolean; cardRegistered: boolean }
): QueueCardDto {
  const db = getDB();
  const vehicle = db.vehicles.find((v) => v.id === entry.vehicleId);
  const owner = entry.ownerId
    ? db.vehicleOwners.find((o) => o.id === entry.ownerId)
    : undefined;
  const receipt = db.receipts.find((r) => r.receiptNo === entry.receiptNo);
  const fromCp = db.checkpoints.find((c) => c.value === entry.fromCheckpointId);
  const toCp = db.checkpoints.find((c) => c.value === entry.toCheckpointId);
  const lastCp = entry.lastCheckpointId
    ? db.checkpoints.find((c) => c.value === entry.lastCheckpointId)
    : undefined;

  const vehicleTypeId = vehicle?.vehicleTypeId;
  const vehicleType =
    vehicleTypeId === "vehicle-type-truck"
      ? "Truck"
      : vehicleTypeId === "vehicle-type-tipper"
        ? "Tipper"
        : vehicleTypeId === "vehicle-type-container"
          ? "Container"
          : vehicleTypeId === "vehicle-type-tanker"
            ? "Tanker"
            : "—";

  return {
    id: entry.id,
    receiptNo: entry.receiptNo,
    status: entry.status as QueueCardDto["status"],
    queueNumber: entry.queueNumber,
    entryDateBS: entry.entryDateBS as QueueCardDto["entryDateBS"],
    vehicleNo: receipt?.vehicleNo ?? vehicle?.plateNo ?? "—",
    vehicleType,
    fromCheckpoint: fromCp?.label ?? "—",
    toCheckpoint: toCp?.label ?? "—",
    routeLabel:
      fromCp && toCp
        ? `${fromCp.label} → ${toCp.label}`
        : "—",
    loadDetails: receipt?.goods ?? "—",
    weightKg: receipt?.weightKg ?? 0,
    transportCompany: entry.transportCompany,
    ownerName: owner?.name,
    isRegistered: entry.isRegistered,
    cardRegistered: entry.cardRegistered,
  };
}

function filterByStatus(
  entries: QueueCardDto[],
  status: string | null
): QueueCardDto[] {
  if (!status || status === "all") {
    return entries.filter((e) => e.status !== "pending");
  }
  return entries.filter((e) => e.status === status);
}

export async function GET(request: Request) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const vehicleName = url.searchParams.get("vehicleName");
  const cardType = url.searchParams.get("cardType");
  const vehicleType = url.searchParams.get("vehicleType");
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "12");

  const db = getDB();
  const allCards = db.queue.map(denormalize);
  const statusFiltered = filterByStatus(allCards, status);
  const vehicleFiltered = vehicleName
    ? searchRows(statusFiltered, vehicleName, ["vehicleNo", "ownerName"])
    : statusFiltered;

  // Card-type / vehicle-type filters are illustrative; the seed does not
  // currently carry explicit cardType / vehicleTypeId fields on cards, so
  // they are no-ops in the mock. Real backend would join to the card table.
  const final = vehicleFiltered;

  const paged = paginate(final, { page, pageSize });
  return ok(paged.items, paged.meta);
}

export async function POST(request: Request) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();

  const body = (await request.json().catch(() => null)) as unknown;
  if (!body) return fieldErrors({ _: ["Invalid JSON body."] });

  const parsed = addQueueFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return fieldErrors(errors);
  }

  const db = getDB();
  const vehicle = db.vehicles.find((v) => v.id === parsed.data.vehicleId);
  if (!vehicle) {
    return fieldErrors({ vehicleId: ["Vehicle not found."] });
  }

  const fromCp = db.checkpoints.find(
    (c) => c.value === parsed.data.fromCheckpointId
  );
  if (!fromCp) {
    return fieldErrors({ fromCheckpointId: ["Invalid start point."] });
  }

  const now = todayBS();

  const receiptNo = nextReceiptNo(db.receipts);
  const feeLines = [{ label: "काटा शुल्क", amount: 50 }];
  const totalAmount = feeLines.reduce((s, l) => s + l.amount, 0);

  const newReceipt = {
    receiptNo,
    type: "loadboard-sthaniya" as const,
    dateBS: parsed.data.entryDateBS as `${number}-${string}-${string}`,
    time: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    weighStationId: parsed.data.fromCheckpointId,
    vehicleNo: vehicle.plateNo,
    goods: parsed.data.loadDetails,
    description: parsed.data.narration ?? "",
    weightKg: parsed.data.grossWeight,
    feeLines,
    totalAmount,
  };

  const queueId = `q-${crypto.randomUUID().slice(0, 8)}`;
  const newEntry = {
    id: queueId,
    receiptNo,
    status: "pending" as const,
    entryDateBS: parsed.data.entryDateBS as `${number}-${string}-${string}`,
    routeId: "route-1",
    fromCheckpointId: parsed.data.fromCheckpointId,
    toCheckpointId: parsed.data.toCheckpointId,
    transportCompany: parsed.data.transportCompany || undefined,
    driverPhone: parsed.data.driverPhone || undefined,
    vehicleId: parsed.data.vehicleId,
    ownerId: vehicle.ownerId,
    isRegistered: true,
    cardRegistered: false,
    journey: [],
    createdAtBS: now,
  };

  mutateDB((db) => {
    db.receipts.push(newReceipt);
    db.queue.push(newEntry);
  });

  return created({
    queue: {
      id: queueId,
      receiptNo,
      status: "pending" as const,
      entryDateBS: parsed.data.entryDateBS,
    },
    receipt: {
      ...newReceipt,
      weighStation: fromCp.label,
    },
  });
}