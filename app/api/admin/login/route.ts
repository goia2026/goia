import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminPassword,
  getAdminSessionMaxAge
} from "@/lib/admin-auth";

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

  const sessionToken = await createAdminSessionToken();
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: getAdminCookieName(),
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getAdminSessionMaxAge()
  });

  return response;
}
