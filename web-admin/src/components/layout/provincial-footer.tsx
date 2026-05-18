"use client";

import Link from "next/link";
import { ChevronRight, Clock, Sparkles } from "lucide-react";
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

/** Provincial Digital Gateway — always one horizontal row (scroll on narrow screens). */
export function ProvincialFooter() {
  const { openSupport } = useSupport();

  return (
    <footer className="futuristic-footer relative z-10 mt-auto overflow-hidden">
      <div className="futuristic-footer-grid absolute inset-0" aria-hidden />
      <div className="futuristic-footer-mesh absolute inset-0" aria-hidden />
      <div className="futuristic-footer-beam" aria-hidden />

      <div className="relative mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8">
        <div className="mb-4 flex justify-center">
          <span className="footer-chip inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/90">
            <Sparkles className="h-3 w-3" />
            Provincial Digital Gateway
          </span>
        </div>

        <div className="footer-gateway-row" role="group" aria-label="Provincial Digital Gateway links">
          <section className="footer-gateway-cell footer-panel footer-panel-seal">
            <h3 className="footer-panel-title">Seal</h3>
            <ProvincialBrand href="/" logoSize={36} showGlow textAlign="center" className="mx-auto py-2" />
            <p className="line-clamp-2 text-center text-[10px] leading-snug text-slate-400">{APP_SLOGAN}</p>
          </section>

          <section className="footer-gateway-cell footer-panel">
            <h3 className="footer-panel-title">Quick links</h3>
            <ul className="mt-2 max-h-36 space-y-0.5 overflow-y-auto pr-1">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link-row group text-xs">
                    <ChevronRight className="h-3 w-3 shrink-0 text-cyan-500/70" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="footer-gateway-cell footer-panel">
            <h3 className="footer-panel-title">Gov&apos;t links</h3>
            <div className="mt-2 flex max-h-36 flex-wrap gap-1 overflow-y-auto">
              {FOOTER_GOV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "footer-gov-chip group px-2 py-1 text-[10px]",
                    link.color === "cyan" && "footer-gov-chip-cyan",
                    link.color === "amber" && "footer-gov-chip-amber",
                    link.color === "white" && "footer-gov-chip-white"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>

          <section className="footer-gateway-cell footer-panel">
            <h3 className="footer-panel-title flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-cyan-400/80" />
              Hours
            </h3>
            <div className="mt-2 space-y-2 text-xs">
              <div>
                <p className="text-[10px] uppercase text-slate-500">{OFFICE_HOURS.weekdays}</p>
                <p className="font-mono text-sm font-semibold text-cyan-100">{OFFICE_HOURS.weekdayTime}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500">{OFFICE_HOURS.weekend}</p>
                <p className="font-mono text-sm font-bold text-amber-300">{OFFICE_HOURS.weekendStatus}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="footer-bottom-bar mt-5 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row">
          <p className="text-center text-xs text-slate-400 sm:text-left">
            © {FOOTER_TEXT} — Powered by <span className="text-cyan-300">{POWERED_BY}</span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 border-cyan-500/35 text-cyan-100"
            onClick={() => openSupport("welcome")}
          >
            Contact Us!
          </Button>
        </div>
      </div>
    </footer>
  );
}

