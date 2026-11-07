import type { CheckUser } from "@/mocks/types";

const FIRST = ["Ram", "Sita", "Gita", "Hari", "Nabin", "Puja", "Suresh", "Anita", "Bikash", "Kiran"];
const LAST = ["Shrestha", "Thapa", "Gurung", "Khadka", "Adhikari", "Rai", "Sharma", "Poudel", "Magar", "Tamang"];
const STATES = ["state-1", "state-2", "state-3", "state-4", "state-5"];
const STHANIYA_SANGH = ["sth-1", "sth-2", "sth-3"];

export const checkUsers: CheckUser[] = Array.from({ length: 42 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[Math.floor(i / FIRST.length) % LAST.length];
  return {
    id: `cu-${String(i + 1).padStart(3, "0")}`,
    "sn": i + 1,
    name: `${first} ${last}`,
    stateId: STATES[i % STATES.length],
    districtId: `dist-${(i % 20) + 1}`,
    streetAddress: i % 4 === 0 ? undefined : `Street ${i + 1}, Ward ${(i % 15) + 1}`,
    mobileNumber: `98${String(40000000 + i * 137).slice(0, 8)}`,
    email: i % 3 === 0 ? undefined : `${first.toLowerCase()}.${last.toLowerCase()}${i}@tqms.local`,
    status: i % 7 !== 0,
    createdAtBS: `2083-0${(i % 6) + 1}-${String((i % 27) + 1).padStart(2, "0")}` as const,
    sthaniyaSanghId: STHANIYA_SANGH[i % STHANIYA_SANGH.length]
  };
});