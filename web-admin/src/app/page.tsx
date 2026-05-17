import { LandingHeroActions } from "@/components/landing/landing-hero-actions";
import { HeroDateTime } from "@/components/landing/hero-datetime";
import { HeroLogo } from "@/components/landing/hero-logo";
import { SmartFeatures } from "@/components/landing/smart-features";
import { NewsSection } from "@/components/news/news-section";
import { PlatformModules } from "@/components/landing/platform-modules";
import { ContactSection } from "@/components/layout/contact-section";
import { GovernorSpotlight } from "@/components/landing/governor-spotlight";
import { getFeaturedNews, getPublishedNews } from "@/services/news.service";
import { APP_NAME } from "@/lib/constants";

export default async function LandingPage() {
  const [featured, recent] = await Promise.all([
    getFeaturedNews(3),
    getPublishedNews(6),
  ]);
  const newsItems = featured.length > 0 ? featured : recent.slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="gradient-hero relative overflow-hidden rounded-2xl px-6 py-16 sm:px-10 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.25),transparent_50%)]" aria-hidden />
        <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-2xl text-center lg:text-left">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
              Province of Zamboanga Sibugay
            </p>
            <h1 className="text-3xl font-bold leading-tight text-white text-glow sm:text-4xl lg:text-5xl">
              {APP_NAME}
            </h1>
            <p className="mt-5 text-lg text-cyan-100/90">
              Modern, premium, enterprise-grade provincial governance — government-ready.
            </p>
            <HeroDateTime />
            <LandingHeroActions />
          </div>
          <HeroLogo />
        </div>
      </section>

      <NewsSection articles={newsItems} />

      <SmartFeatures />

      <PlatformModules />

      <ContactSection />

      <GovernorSpotlight />
    </div>
  );
}
