import { isSupabaseConfigured } from "@/lib/supabase/env";

export function isMockMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || !isSupabaseConfigured()
  );
}
