import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requirePioManager } from "@/lib/pio-api-auth";

const SELECT =
  "id, title, summary, image_url, document_url, order_number, published_at, is_published, sort_order, created_at";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "true";
  const db = createAdminClient() ?? (await createClient());

  if (admin) {
    const auth = await requirePioManager();
    if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let query = db.from("executive_orders").select(SELECT).order("sort_order").order("published_at", {
    ascending: false,
  });

  if (!admin) query = query.eq("is_published", true).limit(100);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requirePioManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const image_url = String(body.image_url ?? "").trim();
  if (!title || !image_url) {
    return NextResponse.json({ error: "Title and cover image are required." }, { status: 400 });
  }

  const db = createAdminClient() ?? auth.supabase;
  const is_published = body.is_published !== false;
  const published_at = body.published_at
    ? String(body.published_at)
    : is_published
      ? new Date().toISOString()
      : null;

  const { data, error } = await db
    .from("executive_orders")
    .insert({
      title,
      image_url,
      summary: body.summary ? String(body.summary).trim() : null,
      document_url: body.document_url ? String(body.document_url).trim() : null,
      order_number: body.order_number ? String(body.order_number).trim() : null,
      sort_order: Number(body.sort_order ?? 0),
      is_published,
      published_at,
      author_id: auth.userId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ order: data }, { status: 201 });
}
