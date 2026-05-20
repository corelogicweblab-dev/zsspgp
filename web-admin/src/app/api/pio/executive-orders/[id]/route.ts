import { NextResponse } from "next/server";
import { getNewsDataClient } from "@/lib/news-db";
import { requirePioManager } from "@/lib/pio-api-auth";
import { friendlyPioDbError } from "@/lib/fetch-json";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePioManager();
    if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

    const { id } = await params;
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const db = getNewsDataClient(auth.supabase);

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.title !== undefined) patch.title = String(body.title).trim();
    if (body.summary !== undefined) patch.summary = body.summary ? String(body.summary).trim() : null;
    if (body.image_url !== undefined) patch.image_url = String(body.image_url).trim();
    if (body.document_url !== undefined) patch.document_url = body.document_url ? String(body.document_url).trim() : null;
    if (body.order_number !== undefined) patch.order_number = body.order_number ? String(body.order_number).trim() : null;
    if (body.sort_order !== undefined) patch.sort_order = Number(body.sort_order);
    if (body.is_published !== undefined) patch.is_published = Boolean(body.is_published);
    if (body.published_at !== undefined) patch.published_at = body.published_at;

    const { data, error } = await db.from("executive_orders").update(patch).eq("id", id).select().single();

    if (error) return NextResponse.json({ error: friendlyPioDbError(error.message) }, { status: 500 });
    return NextResponse.json({ order: data });
  } catch (e) {
    console.error("[executive-orders PATCH]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Update failed." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePioManager();
    if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

    const { id } = await params;
    const db = getNewsDataClient(auth.supabase);
    const { error } = await db.from("executive_orders").delete().eq("id", id);

    if (error) return NextResponse.json({ error: friendlyPioDbError(error.message) }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[executive-orders DELETE]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Delete failed." },
      { status: 500 }
    );
  }
}
