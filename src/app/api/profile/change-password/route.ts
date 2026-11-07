import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok, badRequest, fieldErrors } from "@/mocks/helpers/response";
import { getSession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

// In-memory store, resets on server restart. In the source system, this
// would be a bcrypt-verified password update. Documented in README.
let currentPassword = "checkpoint123";

export async function POST(request: Request) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();

  const session = await getSession();
  if (!session) return badRequest("Session expired. Sign in again.");

  const body = (await request.json().catch(() => null)) as unknown;
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      errors[key] = [...(errors[key] ?? []), issue.message];
    }
    return fieldErrors(errors);
  }

  if (parsed.data.currentPassword !== currentPassword) {
    return fieldErrors({ currentPassword: ["Current password is incorrect."] });
  }

  currentPassword = parsed.data.newPassword;
  return ok(null);
}