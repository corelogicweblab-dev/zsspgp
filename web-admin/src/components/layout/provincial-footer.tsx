"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Clock, ExternalLink, Sparkles } from "lucide-react";
import { ProvincialBrand } from "@/components/ui/provincial-brand";
import { Button } from "@/components/ui/button";
import {
  FOOTER_GOV_LINKS,
  FOOTER_QUICK_LINKS,
  OFFICE_HOURS,
} from "@/lib/site-navigation";
import { FOOTER_TEXT, POWERED_BY } from "@/lib/constants";
import { useSupport } from "@/components/support/support-provider";
import { cn } from "@/lib/utils";

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45 },
  }),
};

export function ProvincialFooter() {
  const { openSupport } = useSupport();

  return (
    <footer className="futuristic-footer relative z-10 mt-auto overflow-hidden">
      <div className="futuristic-footer-grid absolute inset-0" aria-hidden />
      <div className="futuristic-footer-mesh absolute inset-0" aria-hidden />
      <div className="futuristic-footer-beam" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <motion.div
          className="mb-8 flex flex-col items-center gap-3 text-center sm:mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="footer-chip inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-300/90">
            <Sparkles className="h-3 w-3" />
            Provincial Digital Gateway
          </span>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {/* Seal — hero pod */}
          <motion.div
            custom={0}
            variants={columnVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="footer-panel footer-panel-seal lg:col-span-4"
          >
            <h3 className="footer-panel-title">Seal</h3>
            <div className="footer-seal-pod">
              <div className="footer-seal-ring" aria-hidden />
              <div className="footer-seal-ring footer-seal-ring-outer" aria-hidden />
              <ProvincialBrand
                href="/"
                logoSize={72}
                showGlow
                textAlign="center"
                className="relative z-10"
              />
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
              Smart Provincial Governance Platform
            </p>
          </motion.div>

          {/* Quick links — grid chips */}
          <motion.div
            custom={1}
            variants={columnVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="footer-panel lg:col-span-3"
          >
            <h3 className="footer-panel-title">Quick Link</h3>
            <ul className="mt-4 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link-row group">
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-cyan-500/70 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Gov links — neon chips */}
          <motion.div
            custom={2}
            variants={columnVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="footer-panel lg:col-span-3"
          >
            <h3 className="footer-panel-title">Gov&apos;t Link</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {FOOTER_GOV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "footer-gov-chip group",
                    link.color === "cyan" && "footer-gov-chip-cyan",
                    link.color === "amber" && "footer-gov-chip-amber",
                    link.color === "white" && "footer-gov-chip-white"
                  )}
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3 opacity-50 transition group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Office hours — status card */}
          <motion.div
            custom={3}
            variants={columnVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="footer-panel lg:col-span-2"
          >
            <h3 className="footer-panel-title flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400/80" />
              Office Hours
            </h3>
            <div className="mt-4 space-y-3">
              <div className="footer-hours-block">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    {OFFICE_HOURS.weekdays}
                  </p>
                  <span className="footer-status-open text-[10px] font-bold uppercase">Open</span>
                </div>
                <p className="mt-1 font-mono text-lg font-semibold tracking-tight text-cyan-100">
                  {OFFICE_HOURS.weekdayTime}
                </p>
              </div>
              <div className="footer-hours-block footer-hours-closed">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    {OFFICE_HOURS.weekend}
                  </p>
                  <span className="text-[10px] font-bold uppercase text-amber-400/90">Off</span>
                </div>
                <p className="mt-1 font-mono text-base font-bold text-amber-300">
                  {OFFICE_HOURS.weekendStatus}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="footer-bottom-bar mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-slate-400">
            © {FOOTER_TEXT} — Powered by{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text font-semibold text-transparent">
              {POWERED_BY}
            </span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-cyan-500/35 text-cyan-100 hover:bg-cyan-500/10"
            onClick={() => openSupport("welcome")}
          >
            Contact Us!
          </Button>
        </motion.div>
      </div>
    </footer>
  );
}
