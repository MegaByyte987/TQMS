import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mockDelay } from "@/mocks/helpers/delay";

export const dynamic = "force-dynamic";

export async function POST() {
  await mockDelay();
  const store = await cookies();
  store.delete("tqms-session");
  return new NextResponse(null, { status: 204 });
}