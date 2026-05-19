"use client";

import { usePerformanceMode } from "@/lib/use-performance-mode";

/** Lower quality on slow/mobile networks — smaller files, faster paint. */
export function useImageQuality(normal = 75): number {
  const lite = usePerformanceMode();
  return lite ? 52 : normal;
}
