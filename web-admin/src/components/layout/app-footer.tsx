"use client";

import { motion } from "framer-motion";
import { ProvincialLogo } from "@/components/ui/provincial-logo";
import { FOOTER_TEXT, POWERED_BY } from "@/lib/constants";

export function AppFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative z-10 mt-auto border-t border-cyan-500/20 glass-panel"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-5 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <ProvincialLogo size={44} showGlow />
          <p className="text-sm text-slate-400">
            © {FOOTER_TEXT} — Powered by:{" "}
            <span className="font-semibold text-cyan-400">{POWERED_BY}</span>
          </p>
        </div>
        <p className="text-xs text-slate-500">Smart Provincial Governance Platform</p>
      </div>
    </motion.footer>
  );
}
