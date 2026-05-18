import { AnnouncementBannerSection } from "@/components/announcements/announcement-banner-section";
import { LandingHero } from "@/components/landing/landing-hero";
import { NewsHeadlinesSection } from "@/components/news/news-headlines-section";
import { PioImageCarousel } from "@/components/landing/pio-image-carousel";
import { ProvincialCapitolMap } from "@/components/landing/provincial-capitol-map";
import { ContactSection } from "@/components/layout/contact-section";
import { ExecutiveOrdersSection } from "@/components/landing/executive-orders-section";
import { GovernorSpotlight } from "@/components/landing/governor-spotlight";
import { getFeaturedNews, getPublishedNews } from "@/services/news.service";
import {
  getPublishedCarouselSlides,
  getPublishedExecutiveOrders,
} from "@/services/pio-content.service";

export default async function LandingPage() {
  const [featured, recent, carouselSlides, executiveOrders] = await Promise.all([
    getFeaturedNews(8),
    getPublishedNews(8),
    getPublishedCarouselSlides(16),
    getPublishedExecutiveOrders(16),
  ]);
  const newsItems = featured.length > 0 ? featured : recent;

  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-16">
      <LandingHero />

      <AnnouncementBannerSection />

      <NewsHeadlinesSection
        articles={newsItems}
        maxItems={8}
        title="Provincial Updates"
        subtitle="Latest headlines — browse all releases on the news page"
      />

      {carouselSlides.length > 0 && <PioImageCarousel slides={carouselSlides} />}

      <ProvincialCapitolMap />

      <ContactSection />

      <ExecutiveOrdersSection orders={executiveOrders} />

      <GovernorSpotlight />
    </div>
  );
}
