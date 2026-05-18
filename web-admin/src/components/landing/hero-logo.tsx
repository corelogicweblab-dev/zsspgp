"use client";

import Link from "next/link";
import { DesignatedImage } from "@/components/ui/designated-image";
import {
  GOVERNOR_HEADER_IMAGE_PATH,
  GOVERNOR_HEADER_FALLBACK,
  GOVERNOR_PROFILE,
  KNOW_YOUR_GOVERNOR_PATH,
} from "@/lib/governor-profile";
import { usePerformanceMode } from "@/lib/use-performance-mode";

export function HeroLogo() {
  const lite = usePerformanceMode();

  return (
    <div className="hero-governor-portrait mx-auto max-w-[11rem] sm:max-w-none">
      <Link
        href={KNOW_YOUR_GOVERNOR_PATH}
        className="group relative isolate flex flex-col items-center"
        aria-label={`Know Your Governor — ${GOVERNOR_PROFILE.name}`}
      >
        <div className="relative">
          {!lite && <div className="hero-portrait-ring motion-safe-only" aria-hidden />}
          <div className="relative z-10 mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-cyan-400/40 bg-slate-950 sm:h-36 sm:w-36 lg:h-44 lg:w-44">
            <DesignatedImage
              src={GOVERNOR_HEADER_IMAGE_PATH}
              fallbackSrc={GOVERNOR_HEADER_FALLBACK}
              alt={GOVERNOR_PROFILE.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 112px, 176px"
              priority
            />
          </div>
        </div>
        <p className="hero-governor-label mt-3 w-full max-w-[11rem] text-center text-[10px] font-bold uppercase tracking-[0.18em] sm:text-xs">
          Working Governor
        </p>
      </Link>
    </div>
  );
}
