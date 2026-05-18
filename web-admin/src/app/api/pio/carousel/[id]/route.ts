import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requirePioManager } from "@/lib/pio-api-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePioManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const body = await request.json();
  const db = createAdminClient() ?? auth.supabase;

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.title !== undefined) patch.title = body.title ? String(body.title).trim() : null;
  if (body.caption !== undefined) patch.caption = body.caption ? String(body.caption).trim() : null;
  if (body.image_url !== undefined) patch.image_url = String(body.image_url).trim();
  if (body.sort_order !== undefined) patch.sort_order = Number(body.sort_order);
  if (body.is_published !== undefined) patch.is_published = Boolean(body.is_published);

  const { data, error } = await db
    .from("pio_carousel_slides")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slide: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePioManager();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await params;
  const db = createAdminClient() ?? auth.supabase;
  const { error } = await db.from("pio_carousel_slides").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
