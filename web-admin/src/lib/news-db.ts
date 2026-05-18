import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

/** After requireNewsManager(), prefer service role (bypasses RLS). */
export function getNewsDataClient(userClient: SupabaseClient): SupabaseClient {
  const admin = createAdminClient();
  return admin ?? userClient;
}

export function hasNewsServiceRole(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}
