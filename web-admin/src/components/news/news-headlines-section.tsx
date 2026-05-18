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

export function NewsHeadlinesSection({
  articles,
  title = "Latest Headlines",
  subtitle = "Official releases from the Provincial Information Office",
  showViewAll = true,
  maxItems = 6,
}: NewsHeadlinesSectionProps) {
  const items = articles.slice(0, maxItems);
  const lead = items[0];
  const rest = items.slice(1);

  return (
    <section className="pio-headlines overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900">
      <div className="border-b border-cyan-500/15 bg-slate-950/60 px-4 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Image
                src={LOGO_PATH}
                alt=""
                width={36}
                height={36}
                className="rounded-full object-contain"
              />
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300/90">
                <Newspaper className="h-4 w-4 text-cyan-400" />
                Provincial Information Office
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-400 sm:text-base">{subtitle}</p>
          </div>
          {showViewAll && (
            <Link href="/news">
              <Button variant="outline" className="gap-2 shrink-0">
                All headlines <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="px-8 py-16 text-center text-slate-500">
          No published headlines yet. Official provincial updates will appear here.
        </p>
      ) : (
        <div className="grid gap-0 lg:grid-cols-12">
          {lead && (
            <Link
              href={`/news/${lead.id}`}
              className="group border-b border-cyan-500/10 lg:col-span-7 lg:border-b-0 lg:border-r"
            >
              <article className="flex h-full flex-col">
                <div className="relative aspect-[16/10] w-full bg-slate-900 lg:aspect-[16/9]">
                  {lead.cover_image_url ? (
                    <NewsCoverImage
                      src={lead.cover_image_url}
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-800/50">
                      <Newspaper className="h-16 w-16 text-cyan-500/30" />
                    </div>
                  )}
                  {lead.is_featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-8">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-cyan-400">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDateTime(lead.published_at ?? lead.created_at)}
                  </p>
                  <h3 className="mt-2 text-xl font-bold leading-snug text-white transition group-hover:text-cyan-100 sm:text-2xl lg:text-3xl">
                    {lead.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400 sm:text-base">
                    {lead.summary ?? lead.content.replace(/<[^>]+>/g, "").slice(0, 200)}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-cyan-300 group-hover:underline">
                    Read full article →
                  </span>
                </div>
              </article>
            </Link>
          )}

          <div className="lg:col-span-5">
            {rest.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.id}`}
                className="group flex gap-4 border-b border-cyan-500/10 p-4 transition last:border-0 hover:bg-cyan-500/5 sm:p-5"
              >
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-900 sm:h-24 sm:w-32">
                  {article.cover_image_url ? (
                    <NewsCoverImage
                      src={article.cover_image_url}
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Newspaper className="h-8 w-8 text-cyan-500/25" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-cyan-500/90">
                    {formatDateTime(article.published_at ?? article.created_at)}
                  </p>
                  <h4 className="mt-0.5 font-bold leading-snug text-cyan-50 line-clamp-2 group-hover:text-cyan-100">
                    {article.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
