"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProvincialLogo } from "@/components/ui/provincial-logo";
import { FooterSealPanel } from "@/components/layout/footer-seal-panel";
import {
  FOOTER_CITIZEN_SERVICES,
  FOOTER_GOV_LINKS,
  FOOTER_TRANSPARENCY_LINKS,
} from "@/lib/site-navigation";
import { APP_NAME, APP_TAGLINE, FOOTER_TEXT, POWERED_BY } from "@/lib/constants";
import { useSupport } from "@/components/support/support-provider";
import { cn } from "@/lib/utils";

/** ZSSPGP site footer — identity, seals, gov links, citizen services, transparency. */
export function ProvincialFooter() {
  const { openSupport } = useSupport();

  return (
    <footer
      className="futuristic-footer relative z-10 mt-auto overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="futuristic-footer-grid absolute inset-0" aria-hidden />
      <div className="futuristic-footer-mesh absolute inset-0" aria-hidden />
      <div className="futuristic-footer-beam" aria-hidden />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {/* 1. Top — Identity */}
        <section
          className="flex flex-col items-center gap-4 border-b border-white/10 pb-8 text-center sm:flex-row sm:items-start sm:text-left"
          aria-labelledby="footer-identity-heading"
        >
          <ProvincialLogo size={72} priority className="shrink-0" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <h2
              id="footer-identity-heading"
              className="text-base font-bold leading-snug text-white sm:text-lg"
            >
              {APP_NAME}
            </h2>
            <p className="text-sm font-medium text-cyan-300/90">{APP_TAGLINE}</p>
            <p className="text-xs text-slate-400">
              © {FOOTER_TEXT} — Powered by{" "}
              <span className="font-medium text-cyan-300">{POWERED_BY}</span>
            </p>
          </div>
        </section>

        {/* 2. Middle — Seals & government links */}
        <div
          className="footer-gateway-row mt-8"
          role="group"
          aria-label="Government seals and external links"
        >
          <FooterSealPanel />

          <section
            className="footer-gateway-cell footer-panel"
            aria-labelledby="footer-gov-heading"
          >
            <h3 id="footer-gov-heading" className="footer-panel-title">
              Gov&apos;t links
            </h3>
            <nav
              className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4"
              aria-label="National government agency links"
            >
              {FOOTER_GOV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "footer-gov-chip justify-center px-2 py-2 text-center text-[10px] sm:text-xs",
                    link.color === "cyan" && "footer-gov-chip-cyan",
                    link.color === "amber" && "footer-gov-chip-amber",
                    link.color === "white" && "footer-gov-chip-white"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </section>
        </div>

        {/* 3. Lower — Citizen services */}
        <section
          className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between"
          aria-labelledby="footer-services-heading"
        >
          <div className="min-w-0 flex-1">
            <h3 id="footer-services-heading" className="footer-panel-title mb-3">
              Citizen services
            </h3>
            <nav aria-label="Quick access citizen services">
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {FOOTER_CITIZEN_SERVICES.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="footer-link-row group"
                      title={item.description}
                    >
                      <ChevronRight
                        className="h-3.5 w-3.5 shrink-0 text-cyan-500/70 transition group-hover:translate-x-0.5 group-hover:text-cyan-300"
                        aria-hidden
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex shrink-0 justify-center lg:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-w-[9rem] border-cyan-500/35 text-cyan-100 hover:bg-cyan-500/10"
              onClick={() => openSupport("welcome")}
            >
              Contact Us!
            </Button>
          </div>
        </section>

        {/* 4. Bottom bar — Transparency & credits */}
        <div className="footer-bottom-bar mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <nav
            className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-xs text-slate-400 sm:justify-start"
            aria-label="Transparency policies"
          >
            {FOOTER_TRANSPARENCY_LINKS.map((link, index) => (
              <span key={link.label} className="inline-flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-slate-600" aria-hidden>
                    |
                  </span>
                )}
                <Link
                  href={link.href}
                  className="transition hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                  title={link.description}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
          <p className="text-center text-xs text-slate-500 sm:text-right">
            Powered by{" "}
            <span className="font-medium text-cyan-300/90">{POWERED_BY}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
