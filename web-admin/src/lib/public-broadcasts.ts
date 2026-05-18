import type { SupabaseClient } from "@supabase/supabase-js";

export async function createPublicBroadcast(
  db: SupabaseClient,
  payload: { title: string; message: string; link_url?: string | null; source?: string }
): Promise<void> {
  const { error } = await db.from("public_broadcasts").insert({
    title: payload.title.slice(0, 500),
    message: payload.message.slice(0, 2000),
    link_url: payload.link_url ?? null,
    source: payload.source ?? "provincial",
  });
  if (error) console.error("[public_broadcasts]", error.message);
}
