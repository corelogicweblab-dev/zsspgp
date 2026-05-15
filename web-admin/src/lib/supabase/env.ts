/**
 * Trimmed Supabase credentials (avoids "Invalid API key" from accidental whitespace).
 */
export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return false;
  if (!url.startsWith("http")) return false;
  if (key.length < 32) return false;
  if (/placeholder|your-anon|changeme/i.test(key)) return false;
  return true;
}
