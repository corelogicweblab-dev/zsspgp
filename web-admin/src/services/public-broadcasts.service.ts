import { createAdminClient } from "@/lib/supabase/admin";
import { MOCK_PUBLIC_BROADCASTS } from "@/lib/mock-data";
import type { PublicBroadcast } from "@/types";

/** Published public broadcasts for citizen-facing pages. */
export async function getPublicBroadcasts(limit = 40): Promise<PublicBroadcast[]> {
  const db = createAdminClient();

  if (!db) {
    return MOCK_PUBLIC_BROADCASTS.slice(0, limit);
  }

  try {
    const { data, error } = await db
      .from("public_broadcasts")
      .select("id, title, message, link_url, source, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data?.length) {
      return MOCK_PUBLIC_BROADCASTS.slice(0, limit);
    }

    return data as PublicBroadcast[];
  } catch {
    return MOCK_PUBLIC_BROADCASTS.slice(0, limit);
  }
}
