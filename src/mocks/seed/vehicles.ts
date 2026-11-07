import type { Vehicle } from "@/mocks/types";

const TYPES = ["vehicle-type-truck", "vehicle-type-tipper", "vehicle-type-container", "vehicle-type-tanker"];
const COLORS = ["plate-color-white", "plate-color-yellow", "plate-color-green"];
const PLATE_TYPES = ["plate-type-private", "plate-type-public"];
const STHANIYA = ["sth-1", "sth-2", "sth-3"];

const COMPANIES = ["Tata", "Ashok Leyland", "Eicher", "Mahindra"];
const MODELS = ["LPT 1613", "Ecomet 1615", "Pro 3015", "Blazo X"];

export const vehicles: Vehicle[] = Array.from({ length: 38 }, (_, i) => {
  const zone = ["BA", "LU", "KO", "PA", "GA"][i % 5];
  const plateNo = `${zone} ${(i % 10) + 1} KHA ${String(1000 + i * 7).slice(0, 4)}`;
  const owner = i < 26 ? `vo-c-${String((i % 8) + 1).padStart(3, "0")}` : `vo-i-${String((i % 5) + 1).padStart(3, "0")}`;

  return {
    id: `veh-${String(i + 1).padStart(3, "0")}`,
    "sn": i + 1,
    plateNo,
    lotNo: i % 3 === 0 ? `LOT-${String(i + 1).padStart(3, "0")}` : undefined,
    vehicleNumber: `VH${String(100000 + i * 13).slice(0, 6)}`,
    vehicleTypeId: TYPES[i % TYPES.length],
    sthaniyaSanghId: STHANIYA[i % STHANIYA.length],
    ownerId: owner,
    plateColorId: COLORS[i % COLORS.length],
    plateTypeId: PLATE_TYPES[i % PLATE_TYPES.length],
    engineNumber: i % 4 === 0 ? undefined : `ENG${String(500000 + i * 19).slice(0, 6)}`,
    chassisNumber: i % 4 === 0 ? undefined : `CHS${String(900000 + i * 29).slice(0, 6)}`,
    companyName: COMPANIES[i % COMPANIES.length],
    modelNo: MODELS[i % MODELS.length],
    createdAtBS: `2083-0${(i % 6) + 1}-${String((i % 27) + 1).padStart(2, "0")}` as const,
  };
});