import { CitizenPage } from "@/components/layout/citizen-page";
import { Card, CardContent } from "@/components/ui/card";
import { NewsArticleCard } from "@/components/news/news-article-card";
import { getPublishedNews } from "@/services/news.service";

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
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article, i) => (
            <NewsArticleCard key={article.id} article={article} priority={i < 4} />
          ))}
        </div>
      )}
    </CitizenPage>
  );
}
