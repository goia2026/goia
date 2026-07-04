import { NextResponse } from "next/server";
import type { Category } from "@/lib/menu-data";
import { supabaseAdmin } from "@/lib/supabase-admin";

const nonVotableCategories: Category[] = ["softs-juices", "hot-drinks", "spiritueux"];

function getWeekStart(date = new Date()) {
  const nextDate = new Date(date);
  const day = nextDate.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  nextDate.setUTCDate(nextDate.getUTCDate() + diff);
  nextDate.setUTCHours(0, 0, 0, 0);
  return nextDate.toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { productId } = (await request.json().catch(() => ({}))) as {
    productId?: string;
  };

  if (!productId) {
    return NextResponse.json({ error: "Missing product id." }, { status: 400 });
  }

  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .select("id,category,available")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  if (product.available === false || nonVotableCategories.includes(product.category as Category)) {
    return NextResponse.json({ error: "Product is not votable." }, { status: 400 });
  }

  const weekStart = getWeekStart();
  const { data: vote, error: voteError } = await supabaseAdmin.rpc("increment_product_vote", {
    vote_product_id: productId,
    vote_week_start: weekStart
  });

  if (voteError) {
    return NextResponse.json({ error: voteError.message }, { status: 500 });
  }

  const row = Array.isArray(vote) ? vote[0] : vote;

  return NextResponse.json({
    ok: true,
    vote: {
      product_id: row?.product_id || productId,
      count: row?.count || 1,
      week_start: row?.week_start || weekStart
    }
  });
}
