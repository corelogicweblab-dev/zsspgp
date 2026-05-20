import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNewsDataClient } from "@/lib/news-db";
import { requirePioManager } from "@/lib/pio-api-auth";
import { friendlyPioDbError } from "@/lib/fetch-json";

const SELECT =
  "id, title, summary, image_url, document_url, order_number, published_at, is_published, sort_order, created_at";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    let db;
    if (admin) {
      const auth = await requirePioManager();
      if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
      db = getNewsDataClient(auth.supabase);
    } else {
      db = await createClient();
    }

    let query = db.from("executive_orders").select(SELECT).order("sort_order").order("published_at", {
      ascending: false,
    });

    if (!admin) query = query.eq("is_published", true).limit(100);

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: friendlyPioDbError(error.message) }, { status: 500 });
    }
    return NextResponse.json({ orders: data ?? [] });
  } catch (e) {
    console.error("[executive-orders GET]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load executive orders." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requirePioManager();
    if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const title = String(body.title ?? "").trim();
    const image_url = String(body.image_url ?? "").trim();
    if (!title || !image_url) {
      return NextResponse.json({ error: "Title and cover image are required." }, { status: 400 });
    }

    const db = getNewsDataClient(auth.supabase);
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

    if (error) {
      return NextResponse.json({ error: friendlyPioDbError(error.message) }, { status: 500 });
    }
    return NextResponse.json({ order: data }, { status: 201 });
  } catch (e) {
    console.error("[executive-orders POST]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to save executive order." },
      { status: 500 }
    );
  }
}
