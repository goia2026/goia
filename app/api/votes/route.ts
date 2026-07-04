import { NextResponse } from "next/server";
import type { Category } from "@/lib/menu-data";
import { supabaseAdmin } from "@/lib/supabase-admin";

const nonVotableCategories: Category[] = [
  "chichas",
  "softs-juices",
  "hot-drinks",
  "spiritueux"
];

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

  const { productId, targetId, targetType } = (await request.json().catch(() => ({}))) as {
    productId?: string;
    targetId?: string;
    targetType?: "product" | "flavor";
  };
  const voteTargetType = targetType === "flavor" ? "flavor" : "product";
  const voteTargetId = targetId || productId;

  if (!voteTargetId) {
    return NextResponse.json({ error: "Missing vote target id." }, { status: 400 });
  }

  if (voteTargetType === "product") {
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id,category,available")
      .eq("id", voteTargetId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    if (product.available === false || nonVotableCategories.includes(product.category as Category)) {
      return NextResponse.json({ error: "Product is not votable." }, { status: 400 });
    }
  } else {
    const { data: flavor, error: flavorError } = await supabaseAdmin
      .from("chicha_flavors")
      .select("id,available")
      .eq("id", voteTargetId)
      .single();

    if (flavorError || !flavor) {
      return NextResponse.json({ error: "Flavor not found." }, { status: 404 });
    }

    if (flavor.available === false) {
      return NextResponse.json({ error: "Flavor is not votable." }, { status: 400 });
    }
  }

  const weekStart = getWeekStart();
  const { data: vote, error: voteError } = await supabaseAdmin.rpc("increment_product_vote", {
    vote_target_type: voteTargetType,
    vote_target_id: voteTargetId,
    vote_week_start: weekStart
  });

  if (voteError) {
    return NextResponse.json({ error: voteError.message }, { status: 500 });
  }

  const row = Array.isArray(vote) ? vote[0] : vote;

  return NextResponse.json({
    ok: true,
    vote: {
      product_id: row?.product_id || (voteTargetType === "product" ? voteTargetId : undefined),
      target_type: row?.target_type || voteTargetType,
      target_id: row?.target_id || voteTargetId,
      count: row?.count || 1,
      week_start: row?.week_start || weekStart
    }
  });
}
