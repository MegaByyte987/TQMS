const num = (v: string | undefined, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "TQMS-Pulse",
  mockDelayMin: num(process.env.MOCK_DELAY_MIN, 300),
  mockDelayMax: num(process.env.MOCK_DELAY_MAX, 700),
} as const;