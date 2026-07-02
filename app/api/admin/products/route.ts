import { NextResponse } from "next/server";
import type { Product } from "@/lib/menu-data";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ configured: false, products: [] });
  }

  const { data, error } = await supabaseAdmin.from("products").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: isSupabaseAdminConfigured,
    products: data || []
  });
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ configured: false });
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
    return NextResponse.json({ configured: false });
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
