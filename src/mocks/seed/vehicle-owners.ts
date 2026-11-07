import type { VehicleOwner } from "@/mocks/types";

const COMPANY_NAMES = [
  "Himalayan Freight Pvt. Ltd.",
  "Kathmandu Cargo Services",
  "Terai Transport Cooperative",
  "Bagmati Logistics",
  "Gandaki Movers",
  "Lumbini Carriers",
  "Koshi Express",
  "Sudurpaschim Transport",
];

const INDIVIDUAL_NAMES = [
  "Bikash Shrestha", "Anita Gurung", "Ram Bahadur Thapa",
  "Sita Adhikari", "Hari Khadka",
];

export const vehicleOwners: VehicleOwner[] = [
  ...COMPANY_NAMES.map((name, i) => ({
    id: `vo-c-${String(i + 1).padStart(3, "0")}`,
    "sn": i + 1,
    name,
    stateId: "state-3",
    districtId: `dist-${(i % 10) + 1}`,
    localLevel: `Municipality ${i + 1}`,
    streetAddress: `Industrial Area, Block ${i + 1}`,
    email: `contact@${name.toLowerCase().replace(/[^a-z]/g, "")}.local`,
    panNumber: `30${String(100000000 + i * 79).slice(0, 8)}`,
    phoneNumber: `01-${String(4000000 + i * 11111).slice(0, 7)}`,
    isIndividual: false,
    contactPerson: {
      name: `Contact ${i + 1}`,
      email: `person${i + 1}@${name.toLowerCase().replace(/[^a-z]/g, "")}.local`,
      phone: `98${String(41000000 + i * 211).slice(0, 8)}`,
    },
    registration: {
      number: `REG-${String(i + 1).padStart(5, "0")}`,
      documentUrl: undefined,
    },
    createdAtBS: `2083-0${(i % 5) + 1}-${String((i % 27) + 1).padStart(2, "0")}` as const,
  })),
  ...INDIVIDUAL_NAMES.map((name, i) => ({
    id: `vo-i-${String(i + 1).padStart(3, "0")}`,
    "sn": COMPANY_NAMES.length + i + 1,
    name,
    stateId: "state-2",
    districtId: `dist-${(i % 8) + 5}`,
    localLevel: undefined,
    streetAddress: `Ward ${i + 2}, House ${20 + i}`,
    email: undefined,
    panNumber: undefined,
    phoneNumber: `98${String(42000000 + i * 173).slice(0, 8)}`,
    isIndividual: true,
    contactPerson: undefined,
    registration: { number: `REG-I-${String(i + 1).padStart(3, "0")}` },
    createdAtBS: `2083-04-${String((i % 27) + 1).padStart(2, "0")}` as const,
  })),
];