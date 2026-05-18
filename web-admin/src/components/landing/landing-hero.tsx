import { LandingHeroActions } from "@/components/landing/landing-hero-actions";
import { HeroDateTime } from "@/components/landing/hero-datetime";
import { HeroLogo } from "@/components/landing/hero-logo";
import { APP_NAME, APP_SLOGAN } from "@/lib/constants";

export function LandingHero() {
  const titleBase = APP_NAME.replace(/ Platform$/, "");

  return (
    <section className="landing-hero relative overflow-hidden rounded-2xl">
      <div className="landing-hero-grid absolute inset-0 pointer-events-none" aria-hidden />

      <div className="relative z-10 flex flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-10 lg:py-14">
        <div className="landing-hero-copy order-1 w-full min-w-0 max-w-2xl text-center lg:flex-1 lg:text-left">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200 sm:text-xs sm:tracking-[0.25em]">
            Province of Zamboanga Sibugay
          </p>
          <h1 className="landing-hero-title text-xl font-bold leading-snug sm:text-3xl lg:text-4xl xl:text-[2.35rem] xl:leading-tight">
            {titleBase}{" "}
            <span className="text-amber-200">Platform</span>
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-amber-100/90 sm:mt-4 sm:text-base lg:text-lg">
            {APP_SLOGAN}
          </p>
          <HeroDateTime />
          <LandingHeroActions />
        </div>

        <div className="order-2 flex w-full justify-center lg:w-auto lg:shrink-0">
          <HeroLogo />
        </div>
      </div>
    </section>
  );
}
