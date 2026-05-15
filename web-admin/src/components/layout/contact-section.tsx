"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CONTACT_INFO } from "@/lib/constants";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-2xl font-bold text-white sm:text-3xl"
      >
        Contact Us
      </motion.h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-400">
        Provincial Capitol — Zamboanga Sibugay Smart Provincial Governance Platform
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CONTACT_INFO.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="h-full">
              <CardContent className="flex flex-col items-center p-5 text-center">
                <item.icon className="mb-3 h-8 w-8 text-cyan-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500/80">
                  {item.label}
                </p>
                <p className="mt-2 text-sm text-slate-300">{item.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500"
      >
        <Shield className="h-4 w-4 text-emerald-500/80" />
        Secured with enterprise encryption, RBAC, RLS, and audit-ready activity logging.
      </motion.p>
    </section>
  );
}
