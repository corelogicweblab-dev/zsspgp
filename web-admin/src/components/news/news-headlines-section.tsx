import Link from "next/link";
import Image from "next/image";
import { Newspaper, ArrowRight, Clock } from "lucide-react";
import { NewsCoverImage } from "@/components/news/news-cover-image";
import { Button } from "@/components/ui/button";
import { LOGO_PATH } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { NewsArticle } from "@/types";

interface NewsHeadlinesSectionProps {
  articles: NewsArticle[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  maxItems?: number;
}

/** Home: 2 columns × 4 rows (8 items). Full list at /news */
export function NewsHeadlinesSection({
  articles,
  title = "Latest Headlines",
  subtitle = "Official releases from the Provincial Information Office",
  showViewAll = true,
  maxItems = 8,
}: NewsHeadlinesSectionProps) {
  const items = articles.slice(0, maxItems);

  return (
    <section className="pio-headlines overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900">
      <div className="border-b border-cyan-500/15 bg-slate-950/70 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <Image
                src={LOGO_PATH}
                alt=""
                width={28}
                height={28}
                className="rounded-full object-contain"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/90 sm:text-xs">
                Provincial Information Office
              </span>
            </div>
            <h2 className="text-lg font-bold text-white sm:text-2xl">{title}</h2>
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          </div>
          {showViewAll && (
            <Link href="/news">
              <Button variant="outline" size="sm" className="shrink-0 gap-2">
                All headlines <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-slate-500">
          No published headlines yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
          {items.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="group flex gap-3 overflow-hidden rounded-xl border border-cyan-500/15 bg-slate-950/60 p-3 transition hover:border-cyan-400/40 hover:bg-cyan-500/5 sm:gap-4 sm:p-3.5"
            >
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-900 sm:h-[5.5rem] sm:w-28">
                {article.cover_image_url ? (
                  <NewsCoverImage
                    src={article.cover_image_url}
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Newspaper className="h-7 w-7 text-cyan-500/30" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 text-[10px] font-medium text-cyan-500/90">
                  <Clock className="h-3 w-3 shrink-0" />
                  {formatDateTime(article.published_at ?? article.created_at)}
                </p>
                <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-snug text-cyan-50 group-hover:text-white">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
