"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PioCarouselSlide } from "@/types";

const COLS = 4;
const ROWS = 4;
const MAX_CELLS = COLS * ROWS;
const AUTO_MS = 3000;

export function PioImageCarousel({ slides }: { slides: PioCarouselSlide[] }) {
  const items = useMemo(() => slides.slice(0, MAX_CELLS), [slides]);
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);

  const rowCount = Math.min(ROWS, Math.max(1, Math.ceil(items.length / COLS)));

  useEffect(() => {
    if (items.length <= COLS || paused) return;
    const t = window.setInterval(() => {
      setOffset((o) => (o + COLS) % items.length);
    }, AUTO_MS);
    return () => window.clearInterval(t);
  }, [items.length, paused]);

  if (!items.length) return null;

  const gridCells = Array.from({ length: rowCount * COLS }, (_, i) => {
    if (i >= items.length && items.length < rowCount * COLS) return null;
    return items[(offset + i) % items.length];
  });

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
        <div
          className="pio-gallery-grid grid gap-1.5 sm:gap-2"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
          }}
        >
          {gridCells.map((slide, i) => (
            <div
              key={slide ? `${slide.id}-${offset}-${i}` : `empty-${i}`}
              className={cn(
                "pio-gallery-cell relative aspect-square overflow-hidden rounded-lg border border-cyan-500/15 bg-slate-900",
                !slide && "invisible"
              )}
            >
              {slide && (
                <>
                  <Image
                    src={slide.image_url}
                    alt={slide.title ?? "Provincial highlight"}
                    fill
                    className="object-contain p-0.5 transition-opacity duration-500"
                    sizes="(max-width: 640px) 22vw, 200px"
                    priority={i < COLS && offset === 0}
                  />
                  {slide.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent px-1.5 pb-1.5 pt-4">
                      <p className="line-clamp-1 text-[9px] font-semibold text-white sm:text-[10px]">
                        {slide.title}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
