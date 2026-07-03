import { NextResponse } from "next/server";
import { initialCategories, initialProducts } from "@/lib/menu-data";
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

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    console.info("[GOIA admin] Supabase env", supabaseDiagnostic());
    return NextResponse.json(supabaseDiagnostic());
  }
  const admin = supabaseAdmin;

  const { error: categoryError } = await admin
    .from("categories")
    .upsert(initialCategories);

  if (categoryError) {
    return NextResponse.json({ error: categoryError.message }, { status: 500 });
  }

  const { error: productError } = await admin.from("products").upsert(initialProducts);

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  const currentCategoryIds = new Set<string>(initialCategories.map((category) => category.id));
  const currentProductIds = new Set(initialProducts.map((product) => product.id));

  const { data: storedCategories, error: storedCategoryError } = await admin
    .from("categories")
    .select("id");

  if (storedCategoryError) {
    return NextResponse.json({ error: storedCategoryError.message }, { status: 500 });
  }

  const { data: storedProducts, error: storedProductError } = await admin
    .from("products")
    .select("id");

  if (storedProductError) {
    return NextResponse.json({ error: storedProductError.message }, { status: 500 });
  }

  const staleCategoryIds = (storedCategories || [])
    .map((category) => category.id as string)
    .filter((id) => !currentCategoryIds.has(id));
  const staleProductIds = (storedProducts || [])
    .map((product) => product.id as string)
    .filter((id) => !currentProductIds.has(id));

  const productDeleteResults = await Promise.all(
    staleProductIds.map((id) => admin.from("products").delete().eq("id", id))
  );
  const productDeleteError = productDeleteResults.find((result) => result.error)?.error;
  if (productDeleteError) {
    return NextResponse.json({ error: productDeleteError.message }, { status: 500 });
  }

  const categoryDeleteResults = await Promise.all(
    staleCategoryIds.map((id) => admin.from("categories").delete().eq("id", id))
  );
  const categoryDeleteError = categoryDeleteResults.find((result) => result.error)?.error;
  if (categoryDeleteError) {
    return NextResponse.json({ error: categoryDeleteError.message }, { status: 500 });
  }

  return NextResponse.json({
    ...supabaseDiagnostic(),
    categories: initialCategories.length,
    products: initialProducts.length,
    removedCategories: staleCategoryIds.length,
    removedProducts: staleProductIds.length
  });
}
