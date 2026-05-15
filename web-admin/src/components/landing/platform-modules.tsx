"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  BarChart3,
  Building2,
  MessageSquare,
  AlertTriangle,
  Bell,
  Smartphone,
  Shield,
  Radio,
  Layers,
  Newspaper,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PLATFORM_MODULES } from "@/lib/constants";

const icons = [
  BarChart3,
  Building2,
  MessageSquare,
  AlertTriangle,
  Bell,
  Smartphone,
  Shield,
  Radio,
  Layers,
  Newspaper,
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function PlatformModules() {
  return (
    <section>
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-3xl font-bold text-white"
      >
        Integrated Governance Modules
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mx-auto mt-3 max-w-2xl text-center text-slate-400"
      >
        Select a module to open its page — same destinations as the side menu.
      </motion.p>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {PLATFORM_MODULES.map((mod, i) => {
          const Icon = icons[i] ?? Building2;
          return (
            <motion.div key={mod.title} variants={item} whileHover={{ y: -4 }}>
              <Link href={mod.href} className="group block h-full">
                <Card className="h-full border-cyan-500/10 transition group-hover:border-cyan-400/50 group-hover:shadow-[0_0_28px_rgba(56,189,248,0.15)]">
                  <CardContent className="flex h-full flex-col p-6">
                    <Icon className="mb-4 h-10 w-10 text-cyan-400 transition group-hover:scale-110" />
                    <h3 className="text-lg font-semibold text-cyan-50 group-hover:text-white">
                      {mod.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-slate-400">{mod.desc}</p>
                    <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
                      <span>{mod.menuLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
