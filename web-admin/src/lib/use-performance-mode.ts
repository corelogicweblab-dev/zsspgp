"use client";

import { useEffect, useState } from "react";

function readLiteMode(): boolean {
  if (typeof window === "undefined") return false;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 1023px)");
  const coarse = window.matchMedia("(pointer: coarse)");
  const saveData = window.matchMedia("(prefers-reduced-data: reduce)");

  const connection = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }
  ).connection;

  const slowNetwork =
    connection?.saveData === true ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g";

  return (
    reduced.matches || mobile.matches || coarse.matches || saveData.matches || slowNetwork
  );
}

/** True on mobile, touch, reduced motion, save-data, or slow network — lighter UI. */
export function usePerformanceMode(): boolean {
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 1023px)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const saveData = window.matchMedia("(prefers-reduced-data: reduce)");

    const sync = () => setLite(readLiteMode());

    sync();
    reduced.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    coarse.addEventListener("change", sync);
    saveData.addEventListener("change", sync);

    const connection = (
      navigator as Navigator & {
        connection?: { effectiveType?: string; saveData?: boolean; addEventListener?: (t: string, fn: () => void) => void; removeEventListener?: (t: string, fn: () => void) => void };
      }
    ).connection;

    connection?.addEventListener?.("change", sync);

    return () => {
      reduced.removeEventListener("change", sync);
      mobile.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      saveData.removeEventListener("change", sync);
      connection?.removeEventListener?.("change", sync);
    };
  }, []);

  return lite;
}
