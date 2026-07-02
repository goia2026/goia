import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ configured: false });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const productId = formData.get("productId");

  if (!(file instanceof File) || typeof productId !== "string") {
    return NextResponse.json({ error: "Missing upload file." }, { status: 400 });
  }

  const extension = file.name.split(".").pop() || "jpg";
  const path = `${productId}-${Date.now()}.${extension}`;
  const { error } = await supabaseAdmin.storage.from("product_images").upload(path, file, {
    cacheControl: "31536000",
    upsert: true
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from("product_images").getPublicUrl(path);

  return NextResponse.json({
    configured: true,
    publicUrl: data.publicUrl
  });
}
