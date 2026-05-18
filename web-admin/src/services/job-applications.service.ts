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

export async function getPublishedAnnouncement(id: string) {
  const admin = createAdminClient();
  const supabase = admin ?? (await createClient());
  if (!supabase) return null;

  const { data } = await supabase
    .from("announcements")
    .select("id, title, content, category, is_published, published_at")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  return data;
}
