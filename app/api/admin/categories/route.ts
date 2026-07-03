import { NextResponse } from "next/server";
import type { MenuCategory } from "@/lib/menu-data";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { normalizeAdminCategory } from "@/app/api/admin/normalize";
import {
  isSupabaseAdminConfigured,
  missingSupabaseAdminEnv,
  supabaseAdmin,
  supabaseAdminEnvStatus
} from "@/lib/supabase-admin";

function supabaseDiagnostic() {
  return {
    configured: isSupabaseAdminConfigured,
    env: supabaseAdminEnvStatus,
    missing: missingSupabaseAdminEnv
  };
}

export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    console.info("[GOIA admin] Supabase env", supabaseDiagnostic());
    return NextResponse.json({ ...supabaseDiagnostic(), categories: [] });
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...supabaseDiagnostic(),
    categories: data || []
  });
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    console.info("[GOIA admin] Supabase env", supabaseDiagnostic());
    return NextResponse.json(supabaseDiagnostic(), { status: 500 });
  }

  const category = normalizeAdminCategory((await request.json()) as MenuCategory);
  const { error } = await supabaseAdmin.from("categories").upsert(category);

  if (error) {
    return NextResponse.json({ ...supabaseDiagnostic(), error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ...supabaseDiagnostic(), ok: true });
}
