"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PioCarouselSlide } from "@/types";

export function PioImageCarousel({ slides }: { slides: PioCarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides.length;
  const safeIndex = count ? index % count : 0;
  const current = slides[safeIndex];

  const next = useCallback(() => {
    if (!count) return;
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (!count) return;
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const t = window.setInterval(next, 5000);
    return () => window.clearInterval(t);
  }, [count, paused, next]);

  if (!count) return null;

  return (
    <section className="pio-carousel overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/80">
      <div className="border-b border-cyan-500/15 px-4 py-3 sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/90">
          Provincial Gallery
        </p>
        <h2 className="text-lg font-bold text-white sm:text-xl">Highlights from Zamboanga Sibugay</h2>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative aspect-[21/9] w-full bg-slate-900 sm:aspect-[2.4/1]">
          <Image
            src={current.image_url}
            alt={current.title ?? "Provincial highlight"}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority={safeIndex === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          {(current.title || current.caption) && (
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              {current.title && (
                <p className="text-base font-bold text-white sm:text-xl">{current.title}</p>
              )}
              {current.caption && (
                <p className="mt-1 line-clamp-2 text-sm text-slate-300">{current.caption}</p>
              )}
            </div>
          )}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-slate-950/70 p-2 text-white backdrop-blur hover:bg-cyan-500/30"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-slate-950/70 p-2 text-white backdrop-blur hover:bg-cyan-500/30"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === safeIndex ? "w-6 bg-amber-400" : "w-1.5 bg-white/40"
                  )}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
