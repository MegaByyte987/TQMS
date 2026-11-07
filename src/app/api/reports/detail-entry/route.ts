import { getDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok } from "@/mocks/helpers/response";
import { paginate } from "@/mocks/helpers/paginate";
import { filterBSRange } from "@/mocks/helpers/filter";
import type { DetailEntryRow } from "@/features/reports/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();

  const url = new URL(request.url);
  const fromBS = url.searchParams.get("fromBS");
  const toBS = url.searchParams.get("toBS");
  const vehicleNo = url.searchParams.get("vehicleNo");
  const goods = url.searchParams.get("goods");
  const billNo = url.searchParams.get("billNo");
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "25");

  const db = getDB();
  const inRange = filterBSRange(db.receipts, "dateBS", fromBS, toBS);

  const rows: DetailEntryRow[] = inRange
    .filter((r) => !vehicleNo || r.vehicleNo.includes(vehicleNo))
    .filter((r) => !goods || r.goods.toLowerCase().includes(goods.toLowerCase()))
    .filter((r) => !billNo || r.receiptNo.includes(billNo))
    .map((receipt, i) => {
      const entry = db.queue.find((q) => q.receiptNo === receipt.receiptNo);
      const vehicle = entry
        ? db.vehicles.find((v) => v.id === entry.vehicleId)
        : undefined;
      const weighStation = db.checkpoints.find((c) => c.value === receipt.weighStationId);
      return {
        id: receipt.receiptNo,
        "s-n": i + 1,
        dateTime: `${receipt.dateBS} ${receipt.time}`,
        receiptNo: receipt.receiptNo,
        vehicleNo: receipt.vehicleNo,
        vehicleType: vehicle?.vehicleTypeId?.replace("vehicle-type-", "") ?? "—",
        checkpointName: weighStation?.label ?? "—",
        route:
          entry?.fromCheckpointId && entry?.toCheckpointId
            ? `${entry.fromCheckpointId} → ${entry.toCheckpointId}`
            : "—",
        grossWeightKg: receipt.weightKg,
        material: receipt.goods,
        remarks: receipt.description || "—",
      };
    });

  const paged = paginate(rows, { page, pageSize });
  return ok(paged.items, paged.meta);
}