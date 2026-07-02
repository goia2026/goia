import { NextRequest, NextResponse } from "next/server";
import { getAdminCookieName, verifyAdminSessionToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const validSession = await verifyAdminSessionToken(
    request.cookies.get(getAdminCookieName())?.value
  );

  if (isLogin && validSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!isLogin && !validSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
