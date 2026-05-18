import { CitizenPage } from "@/components/layout/citizen-page";
import { NewsHeadlinesSection } from "@/components/news/news-headlines-section";
import { NewsArticleCard } from "@/components/news/news-article-card";
import { getPublishedNews } from "@/services/news.service";

export default async function NewsPage() {
  const articles = await getPublishedNews(50);

  return (
    <CitizenPage
      title="News & Information"
      subtitle="Official headlines from the Provincial Information Office of Zamboanga Sibugay"
      maxWidth="5xl"
    >
      <NewsHeadlinesSection articles={articles} maxItems={6} showViewAll={false} />

      {articles.length > 1 && (
        <section className="mt-10">
          <h2 className="mb-6 text-xl font-bold text-white">More headlines</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(1).map((article, i) => (
              <NewsArticleCard key={article.id} article={article} priority={i < 3} />
            ))}
          </div>
        </section>
      )}
    </CitizenPage>
  );
}
