import { createClient } from "@/lib/supabase/server";
import type { NewsArticle } from "@/types";

export async function getPublishedNews(limit = 20): Promise<NewsArticle[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error || !data?.length) return [];
    return data as NewsArticle[];
  } catch {
    return [];
  }
}

export async function getFeaturedNews(limit = 3): Promise<NewsArticle[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    return (data as NewsArticle[]) ?? [];
  } catch {
    return [];
  }
}
