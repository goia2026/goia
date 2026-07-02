import { NextResponse } from "next/server";
import type { MenuCategory } from "@/lib/menu-data";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ configured: false, categories: [] });
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: isSupabaseAdminConfigured,
    categories: data || []
  });
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ configured: false });
  }

  const category = (await request.json()) as MenuCategory;
  const { error } = await supabaseAdmin.from("categories").upsert(category);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ configured: true, ok: true });
}
