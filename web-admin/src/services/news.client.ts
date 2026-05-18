"use client";

import type { NewsArticle, NewsMediaType } from "@/types";

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

function friendlyUploadError(message: string): string {
  if (message.includes("enum user_role") && message.includes("information_office")) {
    return "Run database/FIX_PIO_NEWS_RUN_ONCE.sql in Supabase SQL Editor, then try again.";
  }
  if (message.includes("row-level security")) {
    return "Run database/FIX_PIO_NEWS_RUN_ONCE.sql in Supabase and set SUPABASE_SERVICE_ROLE_KEY on Render.";
  }
  return message;
}

async function uploadViaApi(file: File): Promise<{ url: string; mediaType?: "image" | "video" }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/news/upload", {
    method: "POST",
    body: form,
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(friendlyUploadError(json.error ?? "Upload failed."));
  return json as { url: string; mediaType?: "image" | "video" };
}

async function uploadToBucket(file: File): Promise<string> {
  const { url } = await uploadViaApi(file);
  return url;
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
  const result = await uploadViaApi(file);
  return {
    url: result.url,
    mediaType:
      (result.mediaType as NewsMediaType) ?? (file.type.startsWith("video/") ? "video" : "image"),
  };
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
