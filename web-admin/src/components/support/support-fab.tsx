"use client";

import { MessageCircle } from "lucide-react";
import { useSupport } from "./support-provider";

export function SupportFab() {
  const { open, openSupport } = useSupport();

  return (
    <div className="fixed bottom-5 right-4 z-[95] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {!open && (
        <span className="contact-fab-label rounded-full border border-cyan-500/30 bg-slate-950/95 px-3 py-1 text-[11px] font-semibold text-cyan-100 shadow-lg backdrop-blur-sm">
          Contact Us!
        </span>
      )}
      <button
        type="button"
        onClick={() => openSupport("welcome")}
        className="support-fab group flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/40 bg-gradient-to-br from-cyan-600 to-indigo-700 text-white shadow-[0_0_28px_rgba(56,189,248,0.45)] transition hover:scale-105 hover:shadow-[0_0_36px_rgba(56,189,248,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        aria-label="Contact Us — provincial support"
      >
        <MessageCircle className="h-6 w-6 transition group-hover:scale-110" />
        <span className="sr-only">Contact Us</span>
      </button>
    </div>
  );
}
