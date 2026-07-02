import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdminEnvStatus = {
  NEXT_PUBLIC_SUPABASE_URL: Boolean(supabaseUrl),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(supabaseAnonKey),
  SUPABASE_SERVICE_ROLE_KEY: Boolean(serviceRoleKey)
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
