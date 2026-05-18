import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

/** After requireNewsManager(), use service role when configured to avoid RLS gaps. */
export function getNewsDataClient(
  userClient: SupabaseClient
): SupabaseClient {
  return createAdminClient() ?? userClient;
}
