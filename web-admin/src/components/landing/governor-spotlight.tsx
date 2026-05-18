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
      <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:items-end lg:gap-10 lg:p-10">
        <div className="relative z-10 flex flex-col justify-center text-center lg:text-left">
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
            <Button variant="gov" size="lg" className="group w-full sm:w-auto">
              Know Your Governor
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:ml-auto lg:max-w-md">
          <div className="relative aspect-[3/4] w-full min-h-[280px] sm:min-h-[320px] lg:min-h-[400px]">
            <DesignatedImage
              src={GOVERNOR_IMAGE_PATH}
              fallbackSrc={GOVERNOR_IMAGE_FALLBACK}
              alt={`${GOVERNOR_PROFILE.name}, ${GOVERNOR_PROFILE.title}`}
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 420px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
