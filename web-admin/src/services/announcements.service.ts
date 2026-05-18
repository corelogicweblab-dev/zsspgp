import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MOCK_ANNOUNCEMENTS } from "@/lib/mock-data";
import type { Announcement, AnnouncementCategory } from "@/types";

type AnnouncementRow = Announcement & {
  department_id?: string | null;
  departments?: { code?: string } | { code?: string }[] | null;
};

const SELECT =
  "id, title, content, category, link_url, is_published, published_at, expires_at, created_at, updated_at, department_id, departments(code)";

function isInfoDepartment(row: AnnouncementRow): boolean {
  const dept = row.departments;
  if (!dept) return true;
  const code = Array.isArray(dept) ? dept[0]?.code : dept.code;
  return !code || code.toUpperCase() === "INFO";
}

function mapRow(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: (row.category as Announcement["category"]) ?? "general",
    link_url: row.link_url ?? null,
    is_published: row.is_published,
    published_at: row.published_at,
    expires_at: row.expires_at ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function notExpired(row: AnnouncementRow): boolean {
  if (!row.expires_at) return true;
  return new Date(row.expires_at) > new Date();
}

/** Published PIO announcements (all categories including hiring). */
export async function getPublishedInfoAnnouncements(
  limit = 20,
  category?: AnnouncementCategory
): Promise<Announcement[]> {
  const admin = createAdminClient();
  const supabase = admin ?? (await createClient());

  try {
    let query = supabase
      .from("announcements")
      .select(SELECT)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (category) query = query.eq("category", category);

    const { data, error } = await query;

    if (error || !data?.length) {
      return filterMock(category);
    }

    const filtered = (data as AnnouncementRow[])
      .filter(isInfoDepartment)
      .filter(notExpired)
      .map(mapRow);

    return filtered.length > 0 ? filtered : filterMock(category);
  } catch {
    return filterMock(category);
  }
}

function filterMock(category?: AnnouncementCategory): Announcement[] {
  let items = MOCK_ANNOUNCEMENTS.filter((a) => a.is_published);
  if (category) items = items.filter((a) => a.category === category);
  return items;
}
