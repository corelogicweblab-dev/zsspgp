"use client";

import type { Announcement, AnnouncementCategory } from "@/types";

export type AnnouncementWritePayload = {
  title: string;
  content: string;
  category: AnnouncementCategory;
  link_url?: string | null;
  is_published?: boolean;
  published_at?: string | null;
  expires_at?: string | null;
};

async function parseJson(res: Response) {
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request failed.");
  return json;
}

export async function fetchAnnouncementsAdmin(): Promise<Announcement[]> {
  const res = await fetch("/api/announcements?admin=true", { credentials: "include" });
  const json = await parseJson(res);
  return json.announcements as Announcement[];
}

export async function fetchAnnouncementsPublic(
  category?: AnnouncementCategory
): Promise<Announcement[]> {
  const q = category ? `?category=${category}` : "";
  const res = await fetch(`/api/announcements${q}`, { cache: "no-store" });
  const json = await parseJson(res);
  return json.announcements as Announcement[];
}

export async function createAnnouncementViaApi(
  payload: AnnouncementWritePayload
): Promise<Announcement> {
  const res = await fetch("/api/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const json = await parseJson(res);
  return json.announcement as Announcement;
}

export async function updateAnnouncementViaApi(
  id: string,
  payload: Partial<AnnouncementWritePayload>
): Promise<Announcement> {
  const res = await fetch(`/api/announcements/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const json = await parseJson(res);
  return json.announcement as Announcement;
}

export async function deleteAnnouncementViaApi(id: string): Promise<void> {
  const res = await fetch(`/api/announcements/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await parseJson(res);
}
