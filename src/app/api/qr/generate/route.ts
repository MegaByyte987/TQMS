import QRCode from "qrcode";
import { mockDelay } from "@/mocks/helpers/delay";
import { failIfRequested } from "@/mocks/helpers/error";
import { ok } from "@/mocks/helpers/response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const failure = failIfRequested(request);
  if (failure) return failure;

  await mockDelay();

  const payload = crypto.randomUUID();
  const dataUrl = await QRCode.toDataURL(payload, {
    width: 288,
    margin: 2,
    color: { dark: "#0f172a", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });

  return ok({ payload, dataUrl });
}