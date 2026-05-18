import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireNewsManager } from "@/lib/news-auth";
import { newsWriteSchema, toNewsRow } from "@/lib/news-api-schemas";
import { sanitizeNewsHtml, isHtmlContent } from "@/lib/sanitize-html";

const NEWS_SELECT = `
  id, title, summary, content, cover_image_url, media_url, media_type,
  author_id, department_id, is_published, is_featured, published_at, created_at, updated_at,
  author:users!author_id ( full_name, email )
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "true";
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);

  const supabase = await createClient();

  if (admin) {
    const auth = await requireNewsManager();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { data, error } = await auth.supabase
      .from("news")
      .select(NEWS_SELECT)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data: data ?? [] });
  }

  const { data, error } = await supabase
    .from("news")
    .select(
      "id, title, summary, content, cover_image_url, media_url, media_type, is_featured, published_at, created_at"
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireNewsManager();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

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

  let departmentId: string | null = null;
  const { data: dept } = await auth.supabase
    .from("departments")
    .select("id")
    .eq("code", "INFO")
    .maybeSingle();
  departmentId = dept?.id ?? null;

  const row = {
    ...toNewsRow({ ...input, content }, auth.profile.userId, departmentId),
  };

  const { data, error } = await auth.supabase
    .from("news")
    .insert(row)
    .select(NEWS_SELECT)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
