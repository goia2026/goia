import { NextResponse } from "next/server";
import type { ChichaFlavor } from "@/lib/chicha-flavors";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { normalizeAdminChichaFlavor } from "@/app/api/admin/normalize";
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
    return NextResponse.json({ ...supabaseDiagnostic(), flavors: [] });
  }

  const { data, error } = await supabaseAdmin
    .from("chicha_flavors")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ ...supabaseDiagnostic(), error: error.message, flavors: [] }, { status: 500 });
  }

  return NextResponse.json({
    ...supabaseDiagnostic(),
    flavors: data || []
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

  const flavor = normalizeAdminChichaFlavor((await request.json()) as ChichaFlavor);
  const { error } = await supabaseAdmin.from("chicha_flavors").upsert(flavor);

  if (error) {
    return NextResponse.json({ ...supabaseDiagnostic(), error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ...supabaseDiagnostic(), ok: true });
}

export async function DELETE(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    console.info("[GOIA admin] Supabase env", supabaseDiagnostic());
    return NextResponse.json(supabaseDiagnostic(), { status: 500 });
  }

  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Missing flavor id." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("chicha_flavors").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ ...supabaseDiagnostic(), error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ...supabaseDiagnostic(), ok: true });
}
