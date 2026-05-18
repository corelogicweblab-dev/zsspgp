"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { PROVINCIAL_CAPITOL } from "@/lib/constants";

const CapitolMapInner = dynamic(
  () => import("@/components/landing/provincial-capitol-map-inner").then((m) => m.ProvincialCapitolMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(280px,50vh)] items-center justify-center rounded-xl bg-slate-900 text-sm text-slate-500">
        Loading map…
      </div>
    ),
  }
);

export function ProvincialCapitolMap() {
  return (
    <section id="capitol-map" className="scroll-mt-24">
      <div className="mb-4 text-center sm:mb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
          <MapPin className="h-3.5 w-3.5" />
          Provincial Capitol
        </span>
        <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
          Zamboanga Sibugay Capitol Complex
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          Visit us at {PROVINCIAL_CAPITOL.label}. Pin shows the seat of provincial government in Ipil.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/40 shadow-lg">
        <CapitolMapInner />
      </div>
    </section>
  );
}
