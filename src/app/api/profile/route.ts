import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, notFound } from "@/mocks/helpers/response";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();
  const session = await getSession();
  if (!session) return notFound("Not signed in.");
  return ok(session);
}