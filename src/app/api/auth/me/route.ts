import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mockDelay } from "@/mocks/helpers/delay";

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "tqms-session";

export async function GET() {
  await mockDelay();
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;

  if (!raw) {
    return NextResponse.json({ data: null }, { status: 401 });
  }

  try {
    return NextResponse.json({ data: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ data: null }, { status: 401 });
  }
}