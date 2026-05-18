"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ProvincialLogo } from "@/components/ui/provincial-logo";
import {
  FOOTER_GOV_LINKS,
  FOOTER_QUICK_LINKS,
  OFFICE_HOURS,
} from "@/lib/site-navigation";
import { FOOTER_TEXT, LOGO_PATH, POWERED_BY } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ProvincialFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="provincial-footer relative z-10 mt-auto"
    >
      <div className="provincial-footer-glow absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Seal */}
          <div>
            <h3 className="provincial-footer-heading">Seal</h3>
            <div className="provincial-footer-rule" />
            <div className="relative mt-4 flex flex-col items-center gap-4">
              <div className="relative h-28 w-28 opacity-90">
                <Image
                  src={LOGO_PATH}
                  alt="Province of Zamboanga Sibugay"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="112px"
                />
              </div>
              <ProvincialLogo size={40} showGlow={false} />
              <p className="text-center text-xs text-slate-400">
                Zamboanga Sibugay Smart Provincial Governance Platform
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="provincial-footer-heading">Quick Link</h3>
            <div className="provincial-footer-rule" />
            <ul className="mt-4 space-y-2">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="provincial-footer-link flex items-center gap-2 text-sm text-slate-300 transition hover:translate-x-1 hover:text-amber-200"
                  >
                    <span className="text-amber-400/80">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Gov links */}
          <div>
            <h3 className="provincial-footer-heading">Gov&apos;t Link</h3>
            <div className="provincial-footer-rule" />
            <p className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-2 text-sm leading-relaxed">
              {FOOTER_GOV_LINKS.map((link, i) => (
                <span key={link.href} className="inline-flex items-center">
                  {i > 0 && <span className="px-1 text-slate-600">|</span>}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "transition hover:underline",
                      link.color === "cyan" && "text-cyan-400",
                      link.color === "amber" && "text-amber-300",
                      link.color === "white" && "text-slate-200"
                    )}
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </p>
          </div>

          {/* Office hours */}
          <div>
            <h3 className="provincial-footer-heading">Office Hours</h3>
            <div className="provincial-footer-rule" />
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div>
                <p>{OFFICE_HOURS.weekdays}</p>
                <p className="text-base font-bold text-white">{OFFICE_HOURS.weekdayTime}</p>
              </div>
              <div>
                <p>{OFFICE_HOURS.weekend}</p>
                <p className="text-base font-bold text-amber-300">{OFFICE_HOURS.weekendStatus}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-amber-500/15 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-400">
            © {FOOTER_TEXT} — Powered by{" "}
            <span className="font-semibold text-cyan-400">{POWERED_BY}</span>
          </p>
          <p className="text-xs text-slate-500">Contact Us · AI-assisted provincial support</p>
        </div>
      </div>
    </motion.footer>
  );
}
