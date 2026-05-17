"use client";

import { motion } from "framer-motion";
import { LandingHeroActions } from "@/components/landing/landing-hero-actions";
import { HeroDateTime } from "@/components/landing/hero-datetime";
import { HeroLogo } from "@/components/landing/hero-logo";
import { APP_NAME } from "@/lib/constants";

export function LandingHero() {
  return (
    <section className="landing-hero relative overflow-hidden rounded-2xl">
      <div className="landing-hero-grid absolute inset-0" aria-hidden />
      <motion.div
        className="landing-hero-glow absolute inset-0"
        aria-hidden
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="landing-hero-beam absolute -left-1/4 top-0 h-full w-1/2" aria-hidden />

      <div className="relative z-10 flex flex-col items-center gap-5 px-4 py-8 sm:gap-7 sm:px-8 sm:py-11 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-10 lg:py-14">
        <HeroLogo />

        <div className="w-full max-w-2xl text-center lg:order-first lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300/90 sm:mb-3 sm:text-xs sm:tracking-[0.25em]"
          >
            Province of Zamboanga Sibugay
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="landing-hero-title text-xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl xl:text-[2.35rem] xl:leading-tight"
          >
            {APP_NAME}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-sm leading-relaxed text-cyan-100/85 sm:mt-4 sm:text-base lg:text-lg"
          >
            Modern, premium, enterprise-grade provincial governance — government-ready.
          </motion.p>
          <HeroDateTime />
          <LandingHeroActions />
        </div>
      </div>
    </section>
  );
}
