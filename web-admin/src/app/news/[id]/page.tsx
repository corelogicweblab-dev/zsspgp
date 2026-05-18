import { notFound } from "next/navigation";
import Image from "next/image";
import { NewsCoverImage } from "@/components/news/news-cover-image";
import { NewsArticleContent } from "@/components/news/news-article-content";
import { NewsShareBar } from "@/components/news/news-share-bar";
import { createClient } from "@/lib/supabase/server";
import { CitizenPage } from "@/components/layout/citizen-page";
import { CardContent } from "@/components/ui/card";
import { LOGO_PATH } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { NewsArticle } from "@/types";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let article: NewsArticle | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .single();
    article = data as NewsArticle;
  } catch {
    article = null;
  }

  if (!article) notFound();

  const when = article.published_at ?? article.created_at;

  return (
    <CitizenPage title={article.title} maxWidth="3xl">
      <article className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/40">
        {article.cover_image_url && (
          <div className="relative aspect-[16/9] w-full bg-slate-900">
            <NewsCoverImage
              src={article.cover_image_url}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        <CardContent className="p-6 sm:p-8 lg:p-10">
          <div className="mb-4 flex items-center gap-3 border-b border-cyan-500/15 pb-4">
            <Image src={LOGO_PATH} alt="" width={40} height={40} className="rounded-full" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/90">
                Provincial Information Office
              </p>
              <p className="text-sm font-medium text-cyan-400">{formatDateTime(when)}</p>
            </div>
          </div>

          {article.summary && (
            <p className="mt-4 text-lg leading-relaxed text-slate-300">{article.summary}</p>
          )}

          <div className="mt-6">
            <NewsShareBar articleId={article.id} title={article.title} />
          </div>

          {article.media_url && (
            <div className="mt-8 overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/50">
              {article.media_type === "video" ? (
                <video src={article.media_url} controls className="w-full" playsInline />
              ) : (
                <div className="relative aspect-video w-full">
                  <NewsCoverImage
                    src={article.media_url}
                    className="object-contain"
                    sizes="800px"
                  />
                </div>
              )}
            </div>
          )}

          <NewsArticleContent content={article.content} className="mt-8" />
        </CardContent>
      </article>
    </CitizenPage>
  );
}
