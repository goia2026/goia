import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function hasValidServiceRoleKey(key?: string) {
  if (!key) return false;
  if (key.startsWith("sb_secret_")) return true;
  if (key.startsWith("sb_publishable_")) return false;

  const payload = key.split(".")[1];
  if (!payload) return false;

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(
      Buffer.from(normalizedPayload, "base64").toString("utf8")
    ) as { role?: string };
    return decoded.role === "service_role";
  } catch {
    return false;
  }
}

const hasServiceRoleKey = hasValidServiceRoleKey(serviceRoleKey);

export const supabaseAdminEnvStatus = {
  NEXT_PUBLIC_SUPABASE_URL: Boolean(supabaseUrl),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(supabaseAnonKey),
  SUPABASE_SERVICE_ROLE_KEY: Boolean(serviceRoleKey),
  SUPABASE_SERVICE_ROLE_KEY_IS_SERVER_KEY: hasServiceRoleKey
};

export const missingSupabaseAdminEnv = Object.entries(supabaseAdminEnvStatus)
  .filter(([, present]) => !present)
  .map(([name]) => name);

export const isSupabaseAdminConfigured = missingSupabaseAdminEnv.length === 0;

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl as string, serviceRoleKey as string, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
