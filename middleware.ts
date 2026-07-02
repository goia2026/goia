import { NextRequest, NextResponse } from "next/server";

const cookieName = "goia_admin_session";

function getAdminPassword() {
  return process.env.GOIA_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "";
}

function getSessionSecret() {
  return (
    process.env.GOIA_ADMIN_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    getAdminPassword()
  );
}

async function sign(value: string) {
  const secret = getSessionSecret();
  if (!secret) return "";

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hasValidSession(request: NextRequest) {
  const value = request.cookies.get(cookieName)?.value;
  if (!value) return false;

  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature || Number(expiresAt) <= Date.now()) return false;

  const expectedSignature = await sign(expiresAt);
  return signature === expectedSignature;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const validSession = await hasValidSession(request);

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
