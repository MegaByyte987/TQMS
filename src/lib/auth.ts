import { cookies } from "next/headers";

const SESSION_COOKIE = "tqms-session";

export async function getSession(): Promise<AuthUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}