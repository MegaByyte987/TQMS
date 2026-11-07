import type { Narration } from "@/mocks/types";

export const narrations: Narration[] = [
  { id: "nar-1", sn: 1, text: "Loading gravel at quarry", updatedAtBS: "2083-06-12" as const },
  { id: "nar-2", sn: 2, text: "Returning empty container", updatedAtBS: "2083-06-12" as const },
  { id: "nar-3", sn: 3, text: "Sand delivery to construction site", updatedAtBS: "2083-06-15" as const },
  { id: "nar-4", sn: 4, text: "Cement bags — 200 units", updatedAtBS: "2083-07-01" as const },
  { id: "nar-5", sn: 5, text: "Overloaded — reweighed at checkpoint", updatedAtBS: "2083-07-08" as const },
  { id: "nar-6", sn: 6, text: "Perishable goods — expedited", updatedAtBS: "2083-07-20" as const },
];