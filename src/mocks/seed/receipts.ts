import type { Receipt } from "@/mocks/types";
import { formatReceiptNo } from "@/mocks/helpers/receipt-number";

const GOODS = ["Gravel", "Sand", "Cement", "Steel rods", "Timber", "Fertiliser", "Food grain", "Petrol"];

export const receipts: Receipt[] = Array.from({ length: 60 }, (_, i) => {
  const year = 2083;
  const receiptNo = formatReceiptNo(`${year}-07-20`, i + 1);
  const weight = 8000 + (i % 20) * 500;
  const feeLines = [{ label: "काटा शुल्क", amount: 50 }];
  return {
    receiptNo,
    type: "loadboard-sthaniya",
    dateBS: `2083-0${(i % 6) + 2}-${String((i % 27) + 1).padStart(2, "0")}` as const,
    time: `${(i % 12) + 1}:${String((i * 7) % 60).padStart(2, "0")} PM`,
    weighStationId: `cp-${(i % 8) + 1}`,
    vehicleNo: `${["BA", "LU", "KO", "PA", "GA"][i % 5]} ${(i % 10) + 1} KHA ${String(1000 + i * 7).slice(0, 4)}`,
    goods: GOODS[i % GOODS.length],
    description: "Loading confirmed at weighbridge",
    weightKg: weight,
    feeLines,
    totalAmount: feeLines.reduce((sum, line) => sum + line.amount, 0),
  };
});