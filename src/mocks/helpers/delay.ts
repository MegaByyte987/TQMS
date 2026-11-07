import { env } from "@/lib/env";

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Waits a random amount between MOCK_DELAY_MIN and MOCK_DELAY_MAX (ms).
 * Every route handler awaits this before returning data, so loading
 * skeletons and disabled buttons are exercised in development.
 */
export function mockDelay(): Promise<void> {
  const ms = randomBetween(env.mockDelayMin, env.mockDelayMax);
  return new Promise((resolve) => setTimeout(resolve, ms));
}