import { NextResponse } from "next/server";
import type { Product } from "@/lib/menu-data";
import { verifyAdminRequest } from "@/lib/admin-auth";
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
    return NextResponse.json({ ...supabaseDiagnostic(), products: [] });
  }

  const { data, error } = await supabaseAdmin.from("products").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...supabaseDiagnostic(),
    products: data || []
  });
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    console.info("[GOIA admin] Supabase env", supabaseDiagnostic());
    return NextResponse.json(supabaseDiagnostic());
  }

  const product = (await request.json()) as Product;
  const { error } = await supabaseAdmin.from("products").upsert(product);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ configured: true, ok: true });
}

export async function DELETE(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    console.info("[GOIA admin] Supabase env", supabaseDiagnostic());
    return NextResponse.json(supabaseDiagnostic());
  }

  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Missing product id." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ configured: true, ok: true });
}
