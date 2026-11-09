import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Added "/" to allow unauthenticated users to see the landing page
const PUBLIC_PREFIXES = ["/", "/login", "/api", "/dev"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
    )
  ) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has("tqms-session");
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};