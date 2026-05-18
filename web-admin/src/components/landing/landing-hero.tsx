import { LandingHeroActions } from "@/components/landing/landing-hero-actions";
import { HeroDateTime } from "@/components/landing/hero-datetime";
import { HeroLogo } from "@/components/landing/hero-logo";
import { APP_NAME } from "@/lib/constants";

export function LandingHero() {
  const titleBase = APP_NAME.replace(/ Platform$/, "");

  return (
    <section className="landing-hero relative overflow-hidden rounded-2xl">
      <div className="landing-hero-grid absolute inset-0" aria-hidden />

      <div className="relative z-10 flex flex-col items-center gap-5 px-4 py-8 sm:gap-7 sm:px-8 sm:py-11 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-10 lg:py-14">
        <HeroLogo />

        <div className="landing-hero-copy w-full max-w-2xl text-center lg:order-first lg:text-left">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-200 sm:mb-3 sm:text-xs sm:tracking-[0.25em]">
            Province of Zamboanga Sibugay
          </p>
          <h1 className="landing-hero-title text-xl font-bold leading-snug sm:text-3xl lg:text-4xl xl:text-[2.35rem] xl:leading-tight">
            {titleBase}{" "}
            <span className="text-amber-200">Platform</span>
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:mt-4 sm:text-base lg:text-lg">
            Modern, premium, enterprise-grade provincial governance — government-ready.
          </p>
          <HeroDateTime />
          <LandingHeroActions />
        </div>
      </div>
    </section>
  );
}
