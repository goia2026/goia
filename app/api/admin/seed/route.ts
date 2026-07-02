import { NextResponse } from "next/server";
import { initialCategories, initialProducts } from "@/lib/menu-data";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ configured: false });
  }

  const { error: categoryError } = await supabaseAdmin
    .from("categories")
    .upsert(initialCategories);

  if (categoryError) {
    return NextResponse.json({ error: categoryError.message }, { status: 500 });
  }

  const { error: productError } = await supabaseAdmin.from("products").upsert(initialProducts);

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    categories: initialCategories.length,
    products: initialProducts.length
  });
}
