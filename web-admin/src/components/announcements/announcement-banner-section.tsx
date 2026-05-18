import { createClient } from "@/lib/supabase/server";
import { AnnouncementBanner } from "@/components/announcements/announcement-banner";
import { getPublishedInfoAnnouncements } from "@/services/announcements.service";
import type { BannerAnnouncement } from "@/lib/announcement-banner";

async function getViewerContext(): Promise<{ role: string; departmentCode: string | null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { role: "public", departmentCode: null };

    const { data: row } = await supabase
      .from("users")
      .select("role, departments:department_id (code)")
      .eq("id", user.id)
      .maybeSingle();

    const deptRaw = row?.departments as { code?: string } | { code?: string }[] | null;
    const departmentCode = Array.isArray(deptRaw) ? deptRaw[0]?.code ?? null : deptRaw?.code ?? null;

    return {
      role: (row?.role as string) ?? "citizen",
      departmentCode,
    };
  } catch {
    return { role: "public", departmentCode: null };
  }
}

function toBannerItems(
  rows: Awaited<ReturnType<typeof getPublishedInfoAnnouncements>>
): BannerAnnouncement[] {
  return rows.map((a) => {
    const plain = a.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const excerpt = plain.slice(0, 140);
    const message = excerpt.length > 0 ? `${a.title} — ${excerpt}${a.content.length > 140 ? "…" : ""}` : a.title;
    return { id: a.id, title: a.title, message, category: a.category };
  });
}

type AnnouncementBannerSectionProps = {
  className?: string;
};

/** Server wrapper — fetches IO announcements and renders the client banner. */
export async function AnnouncementBannerSection({ className }: AnnouncementBannerSectionProps) {
  const [rows, viewer] = await Promise.all([getPublishedInfoAnnouncements(8), getViewerContext()]);
  const announcements = toBannerItems(rows);

  if (!announcements.length) return null;

  return (
    <AnnouncementBanner
      announcements={announcements}
      viewerRole={viewer.role}
      departmentCode={viewer.departmentCode}
      className={className}
    />
  );
}
