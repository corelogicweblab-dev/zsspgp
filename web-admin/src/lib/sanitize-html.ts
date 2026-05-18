const ALLOWED = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "ul",
  "ol",
  "li",
  "a",
  "h2",
  "h3",
  "blockquote",
]);

/** Strip unsafe markup; keep provincial news editor tags only. */
export function sanitizeNewsHtml(html: string): string {
  if (!html?.trim()) return "";

  let out = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/javascript:/gi, "");

  out = out.replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi, (full, tag: string, attrs: string) => {
    const t = tag.toLowerCase();
    if (!ALLOWED.has(t)) return "";
    if (t === "a") {
      const hrefMatch = attrs.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const href = hrefMatch?.[2] ?? hrefMatch?.[3] ?? hrefMatch?.[4] ?? "";
      if (href && (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("/"))) {
        const safe = href.replace(/"/g, "&quot;");
        return `<a href="${safe}" target="_blank" rel="noopener noreferrer">`;
      }
      return "</a>";
    }
    return full.startsWith("</") ? `</${t}>` : `<${t}>`;
  });

  return out;
}

export function isHtmlContent(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text);
}
