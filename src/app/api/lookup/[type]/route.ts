import { NextResponse } from "next/server";
import { getDB } from "@/mocks/db";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, notFound } from "@/mocks/helpers/response";

export const dynamic = "force-dynamic";

const LOOKUPS = [
  "states", "districts", "checkpoints", "routes", "sthaniya-sangh",
  "vehicle-types", "plate-types", "plate-colors", "card-types",
  "others-types", "goods", "bills", "fee-types",
] as const;

type LookupType = (typeof LOOKUPS)[number];

function isLookupType(value: string): value is LookupType {
  return (LOOKUPS as readonly string[]).includes(value);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  const { type } = await params;
  if (!isLookupType(type)) return notFound(`Unknown lookup: ${type}`);

  await mockDelay();
  const db = getDB();
  const url = new URL(request.url);
  const parentId = url.searchParams.get("parentId");

  switch (type) {
    case "states":
      return ok(db.states);
    case "districts":
      return ok(parentId ? db.districts.filter((d) => d.stateId === parentId) : db.districts);
    case "checkpoints":
      return ok(db.checkpoints);
    case "routes":
      return ok(db.routes);
    case "sthaniya-sangh":
      return ok(db.sthaniyaSangh);
    case "fee-types":
      return ok(db.feeTypes);
    case "vehicle-types":
      return ok([
        { value: "vehicle-type-truck", label: "Truck" },
        { value: "vehicle-type-tipper", label: "Tipper" },
        { value: "vehicle-type-container", label: "Container" },
        { value: "vehicle-type-tanker", label: "Tanker" },
      ]);
    case "plate-types":
      return ok([
        { value: "plate-type-private", label: "Private" },
        { value: "plate-type-public", label: "Public" },
        { value: "plate-type-government", label: "Government" },
      ]);
    case "plate-colors":
      return ok([
        { value: "plate-color-white", label: "White" },
        { value: "plate-color-yellow", label: "Yellow" },
        { value: "plate-color-green", label: "Green" },
      ]);
    case "card-types":
      return ok([
        { value: "card-type-sthaniya", label: "Sthaniya" },
        { value: "card-type-general", label: "General" },
      ]);
    case "others-types":
      return ok([
        { value: "others-type-temporary", label: "Temporary" },
        { value: "others-type-third-party", label: "Third Party" },
        { value: "others-type-unregistered", label: "Unregistered" },
      ]);
    case "goods":
      return ok([
        { value: "goods-gravel", label: "Gravel" },
        { value: "goods-sand", label: "Sand" },
        { value: "goods-cement", label: "Cement" },
        { value: "goods-steel", label: "Steel rods" },
        { value: "goods-timber", label: "Timber" },
        { value: "goods-fertiliser", label: "Fertiliser" },
        { value: "goods-food-grain", label: "Food grain" },
        { value: "goods-petrol", label: "Petrol" },
      ]);
    case "bills":
      return ok(db.receipts.map((r) => ({ value: r.receiptNo, label: r.receiptNo })));
  }
}