import { createClient } from "@/lib/supabase/server";
import { withTimeout } from "@/lib/with-timeout";
import type { NewsArticle } from "@/types";

const DB_TIMEOUT_MS = 6_000;

async function fetchPublishedNews(limit: number): Promise<NewsArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data?.length) return [];
  return data as NewsArticle[];
}

async function fetchFeaturedNews(limit: number): Promise<NewsArticle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  return (data as NewsArticle[]) ?? [];
}

export async function getPublishedNews(limit = 20): Promise<NewsArticle[]> {
  try {
    return await withTimeout(fetchPublishedNews(limit), DB_TIMEOUT_MS, []);
  } catch {
    return [];
  }
}

export async function getFeaturedNews(limit = 3): Promise<NewsArticle[]> {
  try {
    return await withTimeout(fetchFeaturedNews(limit), DB_TIMEOUT_MS, []);
  } catch {
    return [];
  }
}
