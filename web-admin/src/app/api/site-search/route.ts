import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNavSearchResults, mergeSearchResults, type SiteSearchResult } from "@/lib/site-search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] as SiteSearchResult[] });
  }

  const navResults = getNavSearchResults(q);
  const safe = q.replace(/[%_\\,]/g, "").slice(0, 80);
  const pattern = `%${safe}%`;
  const remote: SiteSearchResult[] = [];

  try {
    const supabase = await createClient();

    const [newsRes, annRes, eoRes] = await Promise.all([
      supabase
        .from("news")
        .select("id, title, summary")
        .eq("is_published", true)
        .ilike("title", pattern)
        .order("published_at", { ascending: false })
        .limit(6),
      supabase
        .from("announcements")
        .select("id, title, content, category")
        .eq("is_published", true)
        .ilike("title", pattern)
        .order("published_at", { ascending: false })
        .limit(6),
      supabase
        .from("executive_orders")
        .select("id, title, summary, order_number")
        .eq("is_published", true)
        .ilike("title", pattern)
        .order("published_at", { ascending: false })
        .limit(6),
    ]);

    for (const row of newsRes.data ?? []) {
      remote.push({
        id: `news-${row.id}`,
        title: row.title as string,
        href: `/news/${row.id}`,
        category: "News",
        excerpt: (row.summary as string | null) ?? undefined,
      });
    }

    for (const row of annRes.data ?? []) {
      remote.push({
        id: `ann-${row.id}`,
        title: row.title as string,
        href: `/announcements`,
        category: "Announcement",
        excerpt: typeof row.content === "string" ? row.content.slice(0, 120) : undefined,
      });
    }

    for (const row of eoRes.data ?? []) {
      remote.push({
        id: `eo-${row.id}`,
        title: row.title as string,
        href: `/executive-orders/${row.id}`,
        category: "Executive Order",
        excerpt: (row.order_number as string | null) ?? (row.summary as string | null) ?? undefined,
      });
    }
  } catch {
    /* Supabase unavailable — nav-only results still work */
  }

  return NextResponse.json({ results: mergeSearchResults(navResults, remote) });
}
