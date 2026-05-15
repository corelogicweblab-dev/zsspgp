"use client";

import { createClient } from "@/lib/supabase/client";
import type { NewsArticle } from "@/types";

export async function createNewsArticle(
  article: Pick<NewsArticle, "title" | "summary" | "content" | "is_published" | "is_featured">
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const payload = {
    ...article,
    author_id: user.id,
    published_at: article.is_published ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase.from("news").insert(payload).select().single();
  if (error) throw error;
  return data as NewsArticle;
}

export async function fetchAllNewsClient(): Promise<NewsArticle[]> {
  const supabase = createClient();
  const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
  return (data as NewsArticle[]) ?? [];
}
