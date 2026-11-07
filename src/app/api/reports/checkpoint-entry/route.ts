import { getDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok } from "@/mocks/helpers/response";
import { paginate } from "@/mocks/helpers/paginate";
import { filterBSRange } from "@/mocks/helpers/filter";
import type { CheckpointEntryRow } from "@/features/reports/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();

  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const fromBS = url.searchParams.get("fromBS");
  const toBS = url.searchParams.get("toBS");
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "25");

  const db = getDB();

  // Aggregate receipts by checkpoint user, filtered by date range.
  const receiptsInRange = filterBSRange(db.receipts, "dateBS", fromBS, toBS);
  const byUser = new Map<string, { count: number; amount: number; dateBS: string }>();

  for (const receipt of receiptsInRange) {
    const uid = receipt.checkpointUserId ?? "unassigned";
    const agg = byUser.get(uid) ?? { count: 0, amount: 0, dateBS: receipt.dateBS };
    agg.count += 1;
    agg.amount += receipt.totalAmount;
    if (receipt.dateBS > agg.dateBS) agg.dateBS = receipt.dateBS;
    byUser.set(uid, agg);
  }

  const rows: CheckpointEntryRow[] = Array.from(byUser.entries())
    .filter(([uid]) => !userId || uid === userId)
    .map(([uid, agg], i) => {
      const user = db.checkUsers.find((u) => u.id === uid);
      const sangh = user?.sthaniyaSanghId
        ? db.sthaniyaSangh.find((s) => s.value === user.sthaniyaSanghId)
        : undefined;
      return {
        id: uid,
        "s-n": i + 1,
        sthaniyaSangh: sangh?.label ?? "—",
        checkpoint: user?.districtId ?? "—",
        checkpointUser: user?.name ?? "Unassigned",
        entryDateBS: agg.dateBS as CheckpointEntryRow["entryDateBS"],
        totalVehicle: agg.count,
        totalAmount: agg.amount,
      };
    })
    .sort((a, b) => a["s-n"] - b["s-n"]);

  const paged = paginate(rows, { page, pageSize });
  return ok(paged.items, paged.meta);
}