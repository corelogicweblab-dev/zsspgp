import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { JobApplication } from "@/types";

export async function getJobApplications(limit = 50): Promise<JobApplication[]> {
  const supabase = (await createClient()) ?? createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("job_applications")
    .select(
      "id, announcement_id, full_name, email, phone, municipality, barangay, position_applied, cover_letter, status, created_at, announcements(title, category)"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[job_applications]", error.message);
    return [];
  }

  return (data ?? []) as JobApplication[];
}

export { getPublishedAnnouncementById as getPublishedAnnouncement } from "@/services/announcements.service";
