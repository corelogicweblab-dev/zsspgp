"use client";

import { createClient } from "@/lib/supabase/client";
import type { NewsArticle } from "@/types";

const NEWS_COVER_BUCKET = "news-covers";

export type CreateNewsInput = {
  title: string;
  summary: string | null;
  content: string;
  cover_image_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  /** ISO datetime from form; defaults to now when publishing */
  published_at: string | null;
};

export async function uploadNewsCoverImage(file: File): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to upload images.");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const path = `${user.id}/${Date.now()}.${safeExt}`;

  const { error: uploadError } = await supabase.storage
    .from(NEWS_COVER_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    throw new Error(
      uploadError.message.includes("Bucket not found")
        ? "Image storage is not configured. Create a public bucket named \"news-covers\" in Supabase Storage, or paste an image URL instead."
        : uploadError.message
    );
  }

  const { data } = supabase.storage.from(NEWS_COVER_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createNewsArticle(article: CreateNewsInput) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const publishedAt =
    article.is_published
      ? article.published_at ?? new Date().toISOString()
      : article.published_at;

  const payload = {
    title: article.title,
    summary: article.summary,
    content: article.content,
    cover_image_url: article.cover_image_url,
    is_published: article.is_published,
    is_featured: article.is_featured,
    author_id: user.id,
    published_at: publishedAt,
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
