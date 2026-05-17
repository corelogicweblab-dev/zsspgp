import Link from "next/link";
import { NewsCoverImage } from "@/components/news/news-cover-image";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import type { NewsArticle } from "@/types";

interface NewsArticleCardProps {
  article: NewsArticle;
  showFeaturedBadge?: boolean;
}

export function NewsArticleCard({ article, showFeaturedBadge = true }: NewsArticleCardProps) {
  const when = article.published_at ?? article.created_at;

  return (
    <Link href={`/news/${article.id}`} className="block h-full">
      <Card className="h-full overflow-hidden transition hover:border-cyan-400/40">
        {article.cover_image_url && (
          <div className="relative aspect-[16/10] w-full bg-slate-900">
            <NewsCoverImage
              src={article.cover_image_url}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}
        <CardContent className="p-5 sm:p-6">
          {showFeaturedBadge && article.is_featured && (
            <span className="mb-2 inline-block rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              Featured
            </span>
          )}
          <p className="text-xs font-medium text-cyan-400/90">{formatDateTime(when)}</p>
          <h3 className="mt-1 text-lg font-semibold text-cyan-50 line-clamp-2">{article.title}</h3>
          <p className="mt-2 text-sm text-slate-400 line-clamp-3">
            {article.summary ?? article.content}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
