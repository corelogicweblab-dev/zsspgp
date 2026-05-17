import { getBrowserSiteOrigin } from "@/lib/site-url";

/** Public article URL (no trailing slash). */
export function getNewsArticlePath(id: string): string {
  return `/news/${id}`;
}

export function getNewsArticleUrl(id: string, origin?: string): string {
  const base =
    origin ??
    (typeof window !== "undefined" ? getBrowserSiteOrigin() : process.env.NEXT_PUBLIC_SITE_URL ?? "");
  const path = getNewsArticlePath(id);
  if (!base) return path;
  return `${base.replace(/\/+$/, "")}${path}`;
}
