import { Suspense } from "react";
import { LandingHero } from "@/components/landing/landing-hero";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import {
  HomeAnnouncementBanner,
  HomeExecutiveOrdersSection,
  HomeGallerySection,
  HomeGovernorSpotlight,
  HomeNewsSection,
} from "@/components/landing/home-sections";

export const revalidate = 60;

export default function LandingPage() {
  return (
    <div className="space-y-10 sm:space-y-14 lg:space-y-16">
      <LandingHero />

      <Suspense fallback={<SectionSkeleton variant="banner" />}>
        <HomeAnnouncementBanner />
      </Suspense>

      <Suspense fallback={<SectionSkeleton variant="news" />}>
        <HomeNewsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton variant="gallery" />}>
        <HomeGallerySection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton variant="cards" />}>
        <HomeExecutiveOrdersSection />
      </Suspense>

      <HomeGovernorSpotlight />
    </div>
  );
}
