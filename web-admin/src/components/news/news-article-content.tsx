import { sanitizeNewsHtml, isHtmlContent } from "@/lib/sanitize-html";
import { cn } from "@/lib/utils";

interface NewsArticleContentProps {
  content: string;
  className?: string;
}

export function NewsArticleContent({ content, className }: NewsArticleContentProps) {
  if (isHtmlContent(content)) {
    return (
      <div
        className={cn("news-article-prose", className)}
        dangerouslySetInnerHTML={{ __html: sanitizeNewsHtml(content) }}
      />
    );
  }

  return (
    <div className={cn("whitespace-pre-wrap text-sm leading-relaxed text-slate-200 sm:text-base", className)}>
      {content}
    </div>
  );
}
