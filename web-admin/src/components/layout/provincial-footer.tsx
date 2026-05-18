"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FooterSealPanel } from "@/components/layout/footer-seal-panel";
import { FOOTER_GOV_LINKS } from "@/lib/site-navigation";
import { FOOTER_TEXT, POWERED_BY } from "@/lib/constants";
import { useSupport } from "@/components/support/support-provider";
import { cn } from "@/lib/utils";

/** Provincial Digital Gateway — official seals + government links. */
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
          <FooterSealPanel />

          <section className="footer-gateway-cell footer-panel">
            <h3 className="footer-panel-title">Gov&apos;t links</h3>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
              {FOOTER_GOV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "footer-gov-chip group px-2.5 py-1 text-[10px] sm:text-xs",
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
