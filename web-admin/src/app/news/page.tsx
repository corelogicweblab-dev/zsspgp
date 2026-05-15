import Link from "next/link";
import { CitizenPage } from "@/components/layout/citizen-page";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedNews } from "@/services/news.service";
import { formatDate } from "@/lib/utils";

export default async function NewsPage() {
  const articles = await getPublishedNews(50);

  return (
    <CitizenPage
      title="News & Information"
      subtitle="Official releases from the Provincial Information Office"
      maxWidth="4xl"
    >
      {articles.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-slate-400">
            No published news articles yet. Official provincial updates will appear here.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Link key={article.id} href={`/news/${article.id}`}>
              <Card className="transition hover:border-cyan-500/40">
                <CardContent className="p-6">
                  {article.is_featured && (
                    <span className="mb-2 inline-block text-xs font-semibold text-cyan-400">
                      Featured
                    </span>
                  )}
                  <h2 className="text-xl font-semibold text-cyan-50">{article.title}</h2>
                  {article.summary && (
                    <p className="mt-2 text-slate-400 line-clamp-2">{article.summary}</p>
                  )}
                  <p className="mt-3 text-xs text-slate-500">
                    {article.published_at
                      ? formatDate(article.published_at)
                      : formatDate(article.created_at)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </CitizenPage>
  );
}
