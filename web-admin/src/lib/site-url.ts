/** Public site origin only — no path, no trailing slash. */
export function normalizeSiteOrigin(raw: string | undefined): string {
  if (!raw?.trim()) return "";
  try {
    const u = new URL(raw.trim().includes("://") ? raw.trim() : `https://${raw.trim()}`);
    return `${u.protocol}//${u.host}`;
  } catch {
    return raw.trim().replace(/\/+$/, "");
  }
}

/** Server: prefer NEXT_PUBLIC_SITE_URL so redirects match Supabase allow-list (Render/proxy safe). */
export function getRedirectOriginFromRequest(request: Request): string {
  const fromEnv = normalizeSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (fromEnv) return fromEnv;
  return new URL(request.url).origin;
}

/** Client: OAuth / client-side redirects. */
export function getBrowserSiteOrigin(): string {
  if (typeof window === "undefined") return "";
  const fromEnv = normalizeSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (fromEnv) return fromEnv;
  return window.location.origin;
}
