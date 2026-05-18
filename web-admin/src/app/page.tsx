import { AnnouncementBannerSection } from "@/components/announcements/announcement-banner-section";
import { LandingHero } from "@/components/landing/landing-hero";
import { SmartFeatures } from "@/components/landing/smart-features";
import { NewsHeadlinesSection } from "@/components/news/news-headlines-section";
import { PlatformModules } from "@/components/landing/platform-modules";
import { ContactSection } from "@/components/layout/contact-section";
import { GovernorSpotlight } from "@/components/landing/governor-spotlight";
import { getFeaturedNews, getPublishedNews } from "@/services/news.service";

export default async function LandingPage() {
  const [featured, recent] = await Promise.all([
    getFeaturedNews(3),
    getPublishedNews(6),
  ]);
  const newsItems = featured.length > 0 ? featured : recent.slice(0, 3);

  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-16">
      <LandingHero />

      <AnnouncementBannerSection />

      <NewsHeadlinesSection
        articles={newsItems}
        maxItems={4}
        title="Provincial Updates"
        subtitle="Headlines, advisories, and official releases from the Provincial Information Office"
      />

      <SmartFeatures />

      <PlatformModules />

      <ContactSection />

      <GovernorSpotlight />
    </div>
  );
}
