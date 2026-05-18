"use client";

import { useEffect, useState } from "react";

/** True on mobile, touch, reduced motion, or save-data — use lighter UI (no heavy motion). */
export function usePerformanceMode(): boolean {
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 1023px)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const saveData = window.matchMedia("(prefers-reduced-data: reduce)");

    const sync = () =>
      setLite(
        reduced.matches || mobile.matches || coarse.matches || saveData.matches
      );

    sync();
    reduced.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    coarse.addEventListener("change", sync);
    saveData.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      mobile.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      saveData.removeEventListener("change", sync);
    };
  }, []);

  return lite;
}
