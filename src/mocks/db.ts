import type {
  CheckUser,
  Narration,
  VehicleOwner,
  Vehicle,
  OtherVehicle,
  QueueEntry,
  Receipt,
} from "@/mocks/types";
import * as checkUsersSeed from "@/mocks/seed/check-users";
import * as narrationsSeed from "@/mocks/seed/narrations";
import * as vehicleOwnersSeed from "@/mocks/seed/vehicle-owners";
import * as vehiclesSeed from "@/mocks/seed/vehicles";
import * as otherVehiclesSeed from "@/mocks/seed/others-vehicles";
import * as receiptsSeed from "@/mocks/seed/receipts";
import * as queueSeed from "@/mocks/seed/queue";
import * as checkpointsSeed from "@/mocks/seed/checkpoints";
import * as routesSeed from "@/mocks/seed/routes";
import * as sthaniyaSanghSeed from "@/mocks/seed/sthaniya-sangh";
import * as statesSeed from "@/mocks/seed/states";
import * as districtsSeed from "@/mocks/seed/districts";
import * as feeTypesSeed from "@/mocks/seed/fee-types";

const STORAGE_KEY = "tqms-pulse-db-v1";
const isServer = typeof window === "undefined";

export interface MockDB {
  checkUsers: CheckUser[];
  narrations: Narration[];
  vehicleOwners: VehicleOwner[];
  vehicles: Vehicle[];
  otherVehicles: OtherVehicle[];
  receipts: Receipt[];
  queue: QueueEntry[];
  checkpoints: typeof checkpointsSeed.checkpoints;
  routes: typeof routesSeed.routes;
  sthaniyaSangh: typeof sthaniyaSanghSeed.sthaniyaSangh;
  states: typeof statesSeed.states;
  districts: typeof districtsSeed.districts;
  feeTypes: typeof feeTypesSeed.feeTypes;
}

function seedDatabase(): MockDB {
  return {
    checkUsers: structuredClone(checkUsersSeed.checkUsers),
    narrations: structuredClone(narrationsSeed.narrations),
    vehicleOwners: structuredClone(vehicleOwnersSeed.vehicleOwners),
    vehicles: structuredClone(vehiclesSeed.vehicles),
    otherVehicles: structuredClone(otherVehiclesSeed.otherVehicles),
    receipts: structuredClone(receiptsSeed.receipts),
    queue: structuredClone(queueSeed.queue),
    checkpoints: structuredClone(checkpointsSeed.checkpoints),
    routes: structuredClone(routesSeed.routes),
    sthaniyaSangh: structuredClone(sthaniyaSanghSeed.sthaniyaSangh),
    states: structuredClone(statesSeed.states),
    districts: structuredClone(districtsSeed.districts),
    feeTypes: structuredClone(feeTypesSeed.feeTypes),
  };
}

let db: MockDB = loadFromStorage() ?? seedDatabase();

function loadFromStorage(): MockDB | null {
  if (isServer) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockDB) : null;
  } catch {
    return null;
  }
}

function persist(): void {
  if (isServer) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
  }
}

export function getDB(): MockDB {
  return db;
}

export function mutateDB<T>(mutator: (draft: MockDB) => T): T {
  const result = mutator(db);
  persist();
  return result;
}

export function resetDB(): void {
  db = seedDatabase();
  persist();
}