import { cookies } from "next/headers";

export interface AuthUser {
  id: string;
  name: string;
  role: string;
  checkpoint: string;
}

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