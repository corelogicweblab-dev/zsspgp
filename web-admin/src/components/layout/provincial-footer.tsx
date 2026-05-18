"use client";

import Link from "next/link";
import { ChevronRight, Clock, ExternalLink, Sparkles } from "lucide-react";
import { ProvincialBrand } from "@/components/ui/provincial-brand";
import { Button } from "@/components/ui/button";
import {
  FOOTER_GOV_LINKS,
  FOOTER_QUICK_LINKS,
  OFFICE_HOURS,
} from "@/lib/site-navigation";
import { APP_SLOGAN, FOOTER_TEXT, POWERED_BY } from "@/lib/constants";
import { useSupport } from "@/components/support/support-provider";
import { cn } from "@/lib/utils";

export function ProvincialFooter() {
  const { openSupport } = useSupport();

  return (
    <footer className="futuristic-footer relative z-10 mt-auto overflow-hidden">
      <div className="futuristic-footer-grid absolute inset-0" aria-hidden />
      <div className="futuristic-footer-mesh absolute inset-0" aria-hidden />
      <div className="futuristic-footer-beam" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-md flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="footer-chip inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300/90">
            <Sparkles className="h-3 w-3" />
            Provincial Digital Gateway
          </span>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        </div>

        <section className="footer-panel footer-panel-seal w-full">
          <h3 className="footer-panel-title text-center">Seal</h3>
          <div className="flex justify-center py-4">
            <ProvincialBrand href="/" logoSize={48} showGlow textAlign="center" />
          </div>
          <p className="text-center text-[11px] leading-relaxed text-slate-400">{APP_SLOGAN}</p>
        </section>

        <section className="footer-panel w-full">
          <h3 className="footer-panel-title">Quick links</h3>
          <ul className="mt-3 space-y-1">
            {FOOTER_QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-link-row group">
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-cyan-500/70" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="footer-panel w-full">
          <h3 className="footer-panel-title">Gov&apos;t links</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {FOOTER_GOV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "footer-gov-chip group text-xs",
                  link.color === "cyan" && "footer-gov-chip-cyan",
                  link.color === "amber" && "footer-gov-chip-amber",
                  link.color === "white" && "footer-gov-chip-white"
                )}
              >
                {link.label}
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
            ))}
          </div>
        </section>

        <section className="footer-panel w-full">
          <h3 className="footer-panel-title flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400/80" />
            Office hours
          </h3>
          <div className="mt-3 space-y-3">
            <div className="footer-hours-block">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wider text-slate-500">{OFFICE_HOURS.weekdays}</p>
                <span className="footer-status-open text-[10px] font-bold uppercase">Open</span>
              </div>
              <p className="mt-1 font-mono text-base font-semibold text-cyan-100">
                {OFFICE_HOURS.weekdayTime}
              </p>
            </div>
            <div className="footer-hours-block footer-hours-closed">
              <p className="text-xs uppercase tracking-wider text-slate-500">{OFFICE_HOURS.weekend}</p>
              <p className="mt-1 font-mono text-sm font-bold text-amber-300">{OFFICE_HOURS.weekendStatus}</p>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center gap-4 border-t border-white/10 pt-5 text-center">
          <p className="text-xs text-slate-400 sm:text-sm">
            © {FOOTER_TEXT} — Powered by{" "}
            <span className="font-semibold text-cyan-300">{POWERED_BY}</span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-cyan-500/35 text-cyan-100"
            onClick={() => openSupport("welcome")}
          >
            Contact Us!
          </Button>
        </div>
      </div>
    </footer>
  );
}
