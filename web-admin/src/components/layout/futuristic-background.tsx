"use client";

import { usePerformanceMode } from "@/lib/use-performance-mode";

export function FuturisticBackground() {
  const lite = usePerformanceMode();

  if (lite) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="futuristic-bg absolute inset-0" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="futuristic-bg absolute inset-0" />
      <div className="grid-pulse absolute inset-0 motion-safe-only" />
      <div className="scan-line motion-safe-only" />
      <div className="hex-overlay absolute inset-0 opacity-20 motion-safe-only" />
    </div>
  );
}
