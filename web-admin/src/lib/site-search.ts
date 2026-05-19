import { PROVINCIAL_NAV_ITEMS, STATIC_SITE_PAGES } from "@/lib/site-navigation";

export type SiteSearchResult = {
  id: string;
  title: string;
  href: string;
  category: "Page" | "News" | "Announcement" | "Executive Order";
  excerpt?: string;
};

/** Static portal pages from the main navigation tree. */
export function getNavSearchResults(query: string): SiteSearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const entries: SiteSearchResult[] = [];

  for (const item of PROVINCIAL_NAV_ITEMS) {
    if (!item.hasDropdown) {
      entries.push({
        id: `nav-${item.title}`,
        title: item.title,
        href: item.link,
        category: "Page",
      });
    }
    for (const child of item.children ?? []) {
      if (child.href.startsWith("http")) continue;
      entries.push({
        id: `nav-${child.href}-${child.label}`,
        title: child.label,
        href: child.href,
        category: "Page",
        excerpt: child.description,
      });
    }
  }

  for (const page of STATIC_SITE_PAGES) {
    if (page.href.startsWith("http")) continue;
    entries.push({
      id: `static-${page.href}-${page.label}`,
      title: page.label,
      href: page.href,
      category: "Page",
      excerpt: page.description,
    });
  }

  return entries.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.excerpt?.toLowerCase().includes(q) ||
      e.href.toLowerCase().includes(q)
  );
}

export function mergeSearchResults(
  nav: SiteSearchResult[],
  remote: SiteSearchResult[]
): SiteSearchResult[] {
  const seen = new Set<string>();
  const out: SiteSearchResult[] = [];
  for (const item of [...nav, ...remote]) {
    const key = `${item.category}:${item.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out.slice(0, 12);
}
