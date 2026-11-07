import type { OtherVehicle } from "@/mocks/types";

const OTHERS_TYPES = ["others-type-temporary", "others-type-third-party", "others-type-unregistered"];
const PLATE_TYPES = ["plate-type-private", "plate-type-public", "plate-type-government"];

export const otherVehicles: OtherVehicle[] = Array.from({ length: 14 }, (_, i) => {
  const number = String(1000 + i * 37).slice(0, 4);
  return {
    id: `oth-${String(i + 1).padStart(3, "0")}`,
    "sn": i + 1,
    formatedNo: `XX ${(i % 9) + 1} CHA ${number}`,
    numberType: ["Numeric", "Alphanumeric"][i % 2],
    plateTypeId: PLATE_TYPES[i % PLATE_TYPES.length],
    othersTypeId: OTHERS_TYPES[i % OTHERS_TYPES.length],
    createdAtBS: `2083-0${(i % 4) + 3}-${String((i % 27) + 1).padStart(2, "0")}` as const,
  };
});