import { NextResponse } from "next/server";

/**
 * When a request includes `?fail=1`, return a 500 with a realistic error body.
 * Used to demo error states and the "Retry" button on every screen.
 */
export function failIfRequested(request: Request): NextResponse | null {
  const url = new URL(request.url);
  if (url.searchParams.get("fail") === "1") {
    return NextResponse.json(
      {
        data: null,
        message: "The server encountered an unexpected condition.",
      },
      { status: 500 }
    );
  }
  return null;
}