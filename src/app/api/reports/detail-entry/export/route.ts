import { getDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { filterBSRange } from "@/mocks/helpers/filter";
import { csvResponse } from "@/lib/cvs";
import { formatWeight } from "@/lib/formatters";
import { displayBS, todayBS } from "@/lib/bs-date";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();

  const url = new URL(request.url);
  const fromBS = url.searchParams.get("fromBS") ?? todayBS();
  const toBS = url.searchParams.get("toBS") ?? todayBS();
  const vehicleNo = url.searchParams.get("vehicleNo");
  const goods = url.searchParams.get("goods");
  const billNo = url.searchParams.get("billNo");

  const db = getDB();
  const inRange = filterBSRange(db.receipts, "dateBS", fromBS, toBS);

  const rows = inRange
    .filter((r) => !vehicleNo || r.vehicleNo.includes(vehicleNo))
    .filter((r) => !goods || r.goods.toLowerCase().includes(goods.toLowerCase()))
    .filter((r) => !billNo || r.receiptNo.includes(billNo))
    .map((receipt) => {
      const entry = db.queue.find((q) => q.receiptNo === receipt.receiptNo);
      const vehicle = entry ? db.vehicles.find((v) => v.id === entry.vehicleId) : undefined;
      const weighStation = db.checkpoints.find((c) => c.value === receipt.weighStationId);
      return [
        `${receipt.dateBS} ${receipt.time}`,
        receipt.receiptNo,
        receipt.vehicleNo,
        vehicle?.vehicleTypeId?.replace("vehicle-type-", "") ?? "—",
        weighStation?.label ?? "—",
        entry?.fromCheckpointId && entry?.toCheckpointId
          ? `${entry.fromCheckpointId} → ${entry.toCheckpointId}`
          : "—",
        formatWeight(receipt.weightKg),
        receipt.goods,
        receipt.description || "—",
      ];
    });

  return csvResponse(`detail-entry-${fromBS}-${toBS}.csv`, HEADERS, rows);
}

const HEADERS = [
  "Date & time",
  "Receipt no.",
  "Vehicle no.",
  "Vehicle type",
  "Checkpoint",
  "From → to",
  "Gross weight",
  "Material",
  "Remarks",
];