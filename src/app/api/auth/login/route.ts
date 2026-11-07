import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { badRequest } from "@/mocks/helpers/response";

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "tqms-session";
const DEMO_USER = {
  id: "user-1",
  name: "Checkpoint User",
  role: "checkpoint-user",
  checkpoint: "Lodbod Checkpoint",
};

export async function POST(request: Request) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  if (!body?.username || !body?.password) {
    return badRequest("Username and password are required.");
  }

  await mockDelay();

  if (body.username !== "checkpoint" || body.password !== "checkpoint123") {
    return NextResponse.json(
      { data: null, message: "Invalid username or password." },
      { status: 401 }
    );
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify(DEMO_USER), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ data: DEMO_USER });
}