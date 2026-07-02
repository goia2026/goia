import { NextResponse } from "next/server";

const cookieName = "goia_admin_session";
const sessionHours = 8;

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

export async function POST(request: Request) {
  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    return NextResponse.json(
      { error: "GOIA_ADMIN_PASSWORD is missing." },
      { status: 500 }
    );
  }

  const { password } = (await request.json().catch(() => ({}))) as { password?: string };

  if (!password || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const expiresAt = Date.now() + sessionHours * 60 * 60 * 1000;
  const signature = await sign(String(expiresAt));
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: cookieName,
    value: `${expiresAt}.${signature}`,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionHours * 60 * 60
  });

  return response;
}
