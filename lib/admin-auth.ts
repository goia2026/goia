const cookieName = "goia_admin_session";
const sessionHours = 8;

export function getAdminPassword() {
  return process.env.GOIA_ADMIN_PASSWORD || "";
}

export function getSessionSecret() {
  return getAdminPassword();
}

export function getAdminCookieName() {
  return cookieName;
}

export function getAdminSessionMaxAge() {
  return sessionHours * 60 * 60;
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

export async function createAdminSessionToken() {
  const expiresAt = Date.now() + getAdminSessionMaxAge() * 1000;
  const signature = await sign(String(expiresAt));
  return `${expiresAt}.${signature}`;
}

export async function verifyAdminSessionToken(value?: string) {
  if (!value) return false;

  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature || Number(expiresAt) <= Date.now()) return false;

  const expectedSignature = await sign(expiresAt);
  return Boolean(expectedSignature) && signature === expectedSignature;
}

export async function verifyAdminRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${cookieName}=`));

  return verifyAdminSessionToken(sessionCookie?.split("=")[1]);
}
