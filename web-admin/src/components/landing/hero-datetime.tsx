"use client";

import { LiveClock } from "@/components/layout/live-clock";

export function HeroDateTime() {
  return (
    <div className="mt-6 flex justify-center lg:justify-start">
      <LiveClock className="flex items-center gap-2 rounded-lg border border-cyan-500/25 bg-slate-900/60 px-3 py-1.5 text-xs" />
    </div>
  );
}
