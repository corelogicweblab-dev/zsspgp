"use client";

import { isSupabaseConfigured } from "@/lib/supabase/env";

/** Shown when env keys look wrong (common cause of "Invalid API key"). */
export function SupabaseConfigHint() {
  if (isSupabaseConfigured()) return null;
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
      <p className="font-medium text-amber-200">Supabase is not configured correctly</p>
      <p className="mt-1 text-amber-100/90">
        Set <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
        <code className="rounded bg-black/30 px-1">.env.local</code> — full anon JWT from Supabase →
        Settings → API, no quotes, no spaces. Turn off{" "}
        <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_USE_MOCK_DATA</code> for real auth.
      </p>
    </div>
  );
}
