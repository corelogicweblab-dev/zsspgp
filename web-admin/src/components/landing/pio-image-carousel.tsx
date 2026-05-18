"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { PioCarouselSlide } from "@/types";

const VISIBLE = 3;
const MAX_SLIDES = 16;
const AUTO_MS = 3000;

export function PioImageCarousel({ slides }: { slides: PioCarouselSlide[] }) {
  const items = useMemo(() => slides.slice(0, MAX_SLIDES), [slides]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length <= VISIBLE || paused) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, AUTO_MS);
    return () => window.clearInterval(t);
  }, [items.length, paused]);

  if (!items.length) return null;

  const trackWidthPercent = (items.length * 100) / VISIBLE;
  const slideWidthPercent = 100 / items.length;

  return (
    <section
      className="pio-gallery overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/80"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="border-b border-cyan-500/15 px-4 py-3 sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/90">
          Provincial Gallery
        </p>
        <h2 className="text-lg font-bold text-white sm:text-xl">Highlights from Zamboanga Sibugay</h2>
      </div>

      <div className="p-3 sm:p-4">
        <div className="pio-gallery-viewport overflow-hidden">
          <div
            className="pio-gallery-track flex transition-transform duration-500 ease-in-out"
            style={{
              width: `${trackWidthPercent}%`,
              transform: `translateX(-${index * slideWidthPercent}%)`,
            }}
          >
            {items.map((slide, i) => (
              <div
                key={slide.id}
                className="pio-gallery-slide relative aspect-square shrink-0 overflow-hidden rounded-lg border border-cyan-500/15 bg-slate-900 px-1 sm:px-1.5"
                style={{ width: `${slideWidthPercent}%` }}
              >
                <Image
                  src={slide.image_url}
                  alt={slide.title ?? "Provincial highlight"}
                  fill
                  className="object-contain p-0.5"
                  sizes="(max-width: 640px) 33vw, 320px"
                  priority={i < VISIBLE}
                />
                {slide.title && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent px-2 pb-1.5 pt-5">
                    <p className="line-clamp-1 text-[10px] font-semibold text-white sm:text-xs">
                      {slide.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
