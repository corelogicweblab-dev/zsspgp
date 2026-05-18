import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNewsDataClient } from "@/lib/news-db";
import { requireNewsManager } from "@/lib/news-auth";
import { newsWriteSchema, toNewsRow } from "@/lib/news-api-schemas";
import { sanitizeNewsHtml, isHtmlContent } from "@/lib/sanitize-html";

const NEWS_SELECT = `
  id, title, summary, content, cover_image_url, media_url, media_type,
  author_id, department_id, is_published, is_featured, published_at, created_at, updated_at,
  author:users!author_id ( full_name, email )
`;

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const supabase = await createClient();

  const auth = await requireNewsManager();
  const isManager = auth.ok;

  let query = supabase.from("news").select(NEWS_SELECT).eq("id", id);
  if (!isManager) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: Request, ctx: RouteCtx) {
  const auth = await requireNewsManager();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = newsWriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed." },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const content = isHtmlContent(input.content)
    ? sanitizeNewsHtml(input.content)
    : input.content;

  const { data: dept } = await auth.supabase
    .from("departments")
    .select("id")
    .eq("code", "INFO")
    .maybeSingle();

  const row = toNewsRow(
    { ...input, content },
    auth.profile.userId,
    dept?.id ?? null
  );

  const { data, error } = await auth.supabase
    .from("news")
    .update(row)
    .eq("id", id)
    .select(NEWS_SELECT)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(_request: Request, ctx: RouteCtx) {
  const auth = await requireNewsManager();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const { id } = await ctx.params;

  const db = getNewsDataClient(auth.supabase);
  const { error } = await db.from("news").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
