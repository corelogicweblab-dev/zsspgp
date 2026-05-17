import { notFound } from "next/navigation";
import { NewsCoverImage } from "@/components/news/news-cover-image";
import { createClient } from "@/lib/supabase/server";
import { CitizenPage } from "@/components/layout/citizen-page";
import { Card, CardContent } from "@/components/ui/card";
import { ShareNewsLink } from "@/components/news/share-news-link";
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
      <Card className="overflow-hidden">
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
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-cyan-400">{formatDateTime(when)}</p>
            <ShareNewsLink articleId={article.id} size="default" />
          </div>
          {article.summary && (
            <p className="mt-4 text-lg leading-relaxed text-slate-300">{article.summary}</p>
          )}
          <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-slate-200 sm:text-base">
            {article.content}
          </div>
        </CardContent>
      </Card>
    </CitizenPage>
  );
}
