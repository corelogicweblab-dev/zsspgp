import { AnnouncementBannerSection } from "@/components/announcements/announcement-banner-section";
import { PioImageCarousel } from "@/components/landing/pio-image-carousel";
import { ExecutiveOrdersSection } from "@/components/landing/executive-orders-section";
import { GovernorSpotlight } from "@/components/landing/governor-spotlight";
import { NewsHeadlinesSection } from "@/components/news/news-headlines-section";
import { getFeaturedNews, getPublishedNews } from "@/services/news.service";
import { getPublishedCarouselSlides, getPublishedExecutiveOrders } from "@/services/pio-content.service";

export async function HomeAnnouncementBanner() {
  return <AnnouncementBannerSection />;
}

export async function HomeNewsSection() {
  const featured = await getFeaturedNews(8);
  const newsItems =
    featured.length > 0 ? featured : await getPublishedNews(8);

  return (
    <NewsHeadlinesSection
      articles={newsItems}
      maxItems={8}
      title="Provincial Updates"
      subtitle="Latest headlines — browse all releases on the news page"
    />
  );
}

export async function HomeGallerySection() {
  const carouselSlides = await getPublishedCarouselSlides(16);
  if (!carouselSlides.length) return null;
  return <PioImageCarousel slides={carouselSlides} />;
}

export async function HomeExecutiveOrdersSection() {
  const executiveOrders = await getPublishedExecutiveOrders(4);
  return <ExecutiveOrdersSection orders={executiveOrders} />;
}

export function HomeGovernorSpotlight() {
  return <GovernorSpotlight />;
}
