// Runs before every matching request. It only checks that a session cookie exists,
// which is quick, and sends visitors without one to the login page. The real check
// (is the session valid, and whose is it?) still happens in requireMember().
import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { loginPath } from "@/lib/redirects";

export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  return NextResponse.redirect(new URL(loginPath(pathname + search), request.url));
}

export const config = {
  matcher: ["/tools/new"],
};
