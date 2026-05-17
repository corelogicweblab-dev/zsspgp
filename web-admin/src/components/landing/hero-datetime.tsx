"use client";

import { LiveClock } from "@/components/layout/live-clock";

export function HeroDateTime() {
  return (
    <div className="mt-4 flex justify-center sm:mt-5 lg:mt-6 lg:justify-start">
      <LiveClock className="flex max-w-full items-center gap-1.5 rounded-lg border border-cyan-500/25 bg-slate-900/70 px-2.5 py-1 text-[10px] backdrop-blur-sm sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs" />
    </div>
  );
}
