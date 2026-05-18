"use client";

import { createClient } from "@/lib/supabase/client";
import type { NewsArticle, NewsMediaType } from "@/types";

const NEWS_COVER_BUCKET = "news-covers";

export type NewsWritePayload = {
  headline: string;
  summary?: string | null;
  content: string;
  cover_image_url?: string | null;
  media_url?: string | null;
  media_type?: NewsMediaType;
  is_published?: boolean;
  is_featured?: boolean;
  published_at?: string | null;
};

async function uploadViaApi(file: File): Promise<{ url: string; mediaType?: "image" | "video" }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/news/upload", {
    method: "POST",
    body: form,
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed.");
  return json as { url: string; mediaType?: "image" | "video" };
}

async function uploadToBucket(file: File): Promise<string> {
  try {
    const { url } = await uploadViaApi(file);
    return url;
  } catch (apiErr) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw apiErr instanceof Error ? apiErr : new Error("Sign in to upload files.");

    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(NEWS_COVER_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      throw new Error(
        uploadError.message.includes("Bucket not found")
          ? 'Create a public "news-covers" bucket in Supabase Storage, or paste a URL instead.'
          : uploadError.message
      );
    }

    const { data } = supabase.storage.from(NEWS_COVER_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }
}

export async function uploadNewsCoverImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Cover must be an image.");
  }
  return uploadToBucket(file);
}

export async function uploadNewsMedia(file: File): Promise<{
  url: string;
  mediaType: NewsMediaType;
}> {
  try {
    const result = await uploadViaApi(file);
    return {
      url: result.url,
      mediaType: (result.mediaType as NewsMediaType) ?? (file.type.startsWith("video/") ? "video" : "image"),
    };
  } catch {
    const mediaType: NewsMediaType = file.type.startsWith("video/") ? "video" : "image";
    const url = await uploadToBucket(file);
    return { url, mediaType };
  }
}

export async function fetchNewsAdmin(): Promise<NewsArticle[]> {
  const res = await fetch("/api/news?admin=true", { credentials: "include" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to load news.");
  return json.data as NewsArticle[];
}

export async function createNewsViaApi(payload: NewsWritePayload): Promise<NewsArticle> {
  const res = await fetch("/api/news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to create article.");
  return json.data as NewsArticle;
}

export async function updateNewsViaApi(
  id: string,
  payload: NewsWritePayload
): Promise<NewsArticle> {
  const res = await fetch(`/api/news/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to update article.");
  return json.data as NewsArticle;
}

export async function deleteNewsViaApi(id: string): Promise<void> {
  const res = await fetch(`/api/news/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Failed to delete article.");
}

/** @deprecated Use API — kept for legacy callers */
export async function createNewsArticle(article: {
  title: string;
  summary: string | null;
  content: string;
  cover_image_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
}) {
  return createNewsViaApi({
    headline: article.title,
    summary: article.summary,
    content: article.content,
    cover_image_url: article.cover_image_url,
    is_published: article.is_published,
    is_featured: article.is_featured,
    published_at: article.published_at,
  });
}

export async function fetchAllNewsClient(): Promise<NewsArticle[]> {
  return fetchNewsAdmin();
}
