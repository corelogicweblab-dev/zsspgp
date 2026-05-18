"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProvincialBrand } from "@/components/ui/provincial-brand";
import {
  FOOTER_GOV_LINKS,
  FOOTER_QUICK_LINKS,
  OFFICE_HOURS,
} from "@/lib/site-navigation";
import { FOOTER_TEXT, POWERED_BY } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Footer aligned with AppShell — max-w-7xl, glass/cyan system chrome, reference column layout. */
export function ProvincialFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t border-cyan-500/20 glass-panel">
      <motion.div
        className="provincial-footer-accent absolute inset-x-0 top-0 h-px"
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <motion.div
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 className="provincial-footer-heading">Seal</h3>
            <div className="provincial-footer-rule" />
            <div className="mt-4 flex justify-center lg:justify-start">
              <ProvincialBrand
                href="/"
                logoSize={80}
                showGlow
                textAlign="center"
                className="max-w-[220px]"
              />
            </div>
            <p className="mt-3 text-center text-xs text-slate-500 lg:text-left">
              Smart Provincial Governance Platform
            </p>
          </div>

          <div>
            <h3 className="provincial-footer-heading">Quick Link</h3>
            <div className="provincial-footer-rule" />
            <ul className="mt-4 space-y-2">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="provincial-footer-link flex items-center gap-2 text-sm text-slate-300 transition hover:translate-x-1 hover:text-cyan-200"
                  >
                    <span className="text-cyan-500/80">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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
        </motion.div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-cyan-500/15 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-400">
            © {FOOTER_TEXT} — Powered by{" "}
            <span className="font-semibold text-cyan-400">{POWERED_BY}</span>
          </p>
          <p className="text-xs text-slate-500">Contact Us · AI-assisted provincial support</p>
        </div>
      </div>
    </footer>
  );
}
