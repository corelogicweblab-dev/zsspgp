"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DesignatedImage } from "@/components/ui/designated-image";
import {
  GOVERNOR_IMAGE_PATH,
  GOVERNOR_IMAGE_FALLBACK,
  GOVERNOR_PROFILE,
  KNOW_YOUR_GOVERNOR_PATH,
} from "@/lib/governor-profile";

export function GovernorSpotlight() {
  return (
    <section
      id="working-governor"
      className="governor-spotlight relative scroll-mt-24 overflow-hidden rounded-2xl"
      aria-labelledby="working-governor-heading"
    >
      <div className="relative flex flex-col gap-6 p-5 sm:gap-8 sm:p-8 lg:min-h-[400px] lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:p-10">
        <div className="relative z-10 order-1 w-full text-center lg:order-1 lg:max-w-xl lg:pb-10 lg:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300/90">
            Working Governor
          </p>
          <h2
            id="working-governor-heading"
            className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
          >
            {GOVERNOR_PROFILE.name}
          </h2>
          <p className="mt-2 text-sm font-medium text-cyan-200/90 sm:text-base">
            {GOVERNOR_PROFILE.title}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:mt-4 sm:text-base">
            {GOVERNOR_PROFILE.tagline}
          </p>
          <Link href={KNOW_YOUR_GOVERNOR_PATH} className="mt-5 inline-block sm:mt-6">
            <Button variant="gov" size="lg" className="group">
              Know Your Governor
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="order-2 flex w-full shrink-0 justify-center lg:order-2 lg:absolute lg:bottom-0 lg:right-0 lg:w-auto lg:justify-end">
          <div className="relative mx-auto h-48 w-full max-w-[220px] sm:h-56 sm:max-w-[260px] lg:h-[380px] lg:max-w-[420px]">
            <DesignatedImage
              src={GOVERNOR_IMAGE_PATH}
              fallbackSrc={GOVERNOR_IMAGE_FALLBACK}
              alt={`${GOVERNOR_PROFILE.name}, ${GOVERNOR_PROFILE.title}`}
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 1024px) 260px, 420px"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
