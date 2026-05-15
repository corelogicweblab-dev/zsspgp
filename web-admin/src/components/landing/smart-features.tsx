"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BellRing,
  Fingerprint,
  Globe2,
  LineChart,
  Lock,
  Radio,
  Server,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SMART_FEATURES } from "@/lib/constants";

const icons = [Radio, LineChart, BellRing, Fingerprint, Globe2, Lock, Server, Activity];

export function SmartFeatures() {
  return (
    <section>
      <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
        Smart Governance Capabilities
      </h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-slate-400">
        Built for real-time provincial operations, citizen engagement, and executive oversight.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SMART_FEATURES.map((f, i) => {
          const Icon = icons[i] ?? Activity;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full border-cyan-500/15">
                <CardContent className="p-5">
                  <Icon className="mb-3 h-8 w-8 text-cyan-400" />
                  <h3 className="font-semibold text-cyan-50">{f.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
