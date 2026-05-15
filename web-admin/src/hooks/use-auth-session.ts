"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session: next } }) => {
      if (!cancelled) {
        setSession(next);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!cancelled) setSession(next);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}
