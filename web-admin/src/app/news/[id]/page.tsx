import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CitizenPage } from "@/components/layout/citizen-page";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
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

  return (
    <CitizenPage title={article.title} maxWidth="3xl">
      <Card>
        <CardContent className="p-8">
          <p className="text-sm text-slate-500">
            {article.published_at
              ? formatDate(article.published_at)
              : formatDate(article.created_at)}
          </p>
          {article.summary && (
            <p className="mt-4 text-lg text-slate-300">{article.summary}</p>
          )}
          <div className="mt-6 whitespace-pre-wrap text-slate-200">{article.content}</div>
        </CardContent>
      </Card>
    </CitizenPage>
  );
}
