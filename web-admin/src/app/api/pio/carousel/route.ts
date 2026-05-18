import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requirePioManager } from "@/lib/pio-api-auth";

const SELECT = "id, title, caption, image_url, sort_order, is_published, created_at";
const MAX_SLIDES = 16;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "true";
  const db = createAdminClient() ?? (await createClient());

  if (admin) {
    const auth = await requirePioManager();
    if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let query = db.from("pio_carousel_slides").select(SELECT).order("sort_order").order("created_at", {
    ascending: false,
  });

  if (!admin) query = query.eq("is_published", true).limit(MAX_SLIDES);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slides: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requirePioManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const body = await request.json();
  const image_url = String(body.image_url ?? "").trim();
  if (!image_url) return NextResponse.json({ error: "Image is required." }, { status: 400 });

  const db = createAdminClient() ?? auth.supabase;
  const { count } = await db
    .from("pio_carousel_slides")
    .select("id", { count: "exact", head: true });

  if ((count ?? 0) >= MAX_SLIDES) {
    return NextResponse.json({ error: `Maximum ${MAX_SLIDES} carousel images allowed.` }, { status: 400 });
  }

  const { data, error } = await db
    .from("pio_carousel_slides")
    .insert({
      title: body.title ? String(body.title).trim() : null,
      caption: body.caption ? String(body.caption).trim() : null,
      image_url,
      sort_order: Number(body.sort_order ?? count ?? 0),
      is_published: body.is_published !== false,
      author_id: auth.userId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slide: data }, { status: 201 });
}
