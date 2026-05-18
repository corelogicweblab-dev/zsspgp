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

/** Home page: 2 rows × 4 columns (8 cards max). Full archive at /news */
export function NewsHeadlinesSection({
  articles,
  title = "Latest Headlines",
  subtitle = "Official releases from the Provincial Information Office",
  showViewAll = true,
  maxItems = 8,
}: NewsHeadlinesSectionProps) {
  const items = articles.slice(0, maxItems);

  return (
    <section className="pio-headlines overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900">
      <div className="border-b border-cyan-500/15 bg-slate-950/60 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Image
                src={LOGO_PATH}
                alt=""
                width={32}
                height={32}
                className="rounded-full object-contain"
              />
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/90 sm:text-xs">
                <Newspaper className="h-3.5 w-3.5 text-cyan-400" />
                Provincial Information Office
              </span>
            </div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">{subtitle}</p>
          </div>
          {showViewAll && (
            <Link href="/news">
              <Button variant="outline" size="sm" className="gap-2 shrink-0">
                All headlines <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-slate-500">
          No published headlines yet. Official provincial updates will appear here.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:gap-4 sm:p-5">
          {items.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-cyan-500/10 bg-slate-950/50 transition hover:border-cyan-400/35 hover:bg-cyan-500/5"
            >
              <div className="relative aspect-[4/3] w-full bg-slate-900">
                {article.cover_image_url ? (
                  <NewsCoverImage
                    src={article.cover_image_url}
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Newspaper className="h-8 w-8 text-cyan-500/25" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                <p className="flex items-center gap-1 text-[10px] text-cyan-500/90">
                  <Clock className="h-3 w-3 shrink-0" />
                  {formatDateTime(article.published_at ?? article.created_at)}
                </p>
                <h3 className="mt-1 line-clamp-2 text-xs font-bold leading-snug text-cyan-50 group-hover:text-cyan-100 sm:text-sm">
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
