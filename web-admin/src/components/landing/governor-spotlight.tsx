"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  GOVERNOR_IMAGE_PATH,
  GOVERNOR_PROFILE,
  KNOW_YOUR_GOVERNOR_PATH,
} from "@/lib/governor-profile";

export function GovernorSpotlight() {
  return (
    <section
      id="working-governor"
      className="governor-spotlight relative scroll-mt-24 overflow-hidden rounded-2xl"
      aria-labelledby="working-governor-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative flex min-h-[320px] flex-col justify-end sm:min-h-[380px] lg:min-h-[420px]"
      >
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="pointer-events-none absolute bottom-0 right-0 z-0 flex justify-end"
        >
          <div className="relative h-[280px] w-[min(100%,320px)] sm:h-[340px] sm:w-[380px] lg:h-[400px] lg:w-[440px]">
            <Image
              src={GOVERNOR_IMAGE_PATH}
              alt={`${GOVERNOR_PROFILE.name}, ${GOVERNOR_PROFILE.title}`}
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 640px) 100vw, 440px"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative z-10 max-w-xl p-6 pb-8 sm:p-8 sm:pb-10 lg:max-w-2xl lg:pb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300/90">
            Working Governor
          </p>
          <h2
            id="working-governor-heading"
            className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
          >
            {GOVERNOR_PROFILE.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-cyan-200/90">{GOVERNOR_PROFILE.nicknames}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            {GOVERNOR_PROFILE.tagline}
          </p>
          <Link href={KNOW_YOUR_GOVERNOR_PATH} className="mt-6 inline-block">
            <Button variant="gov" size="lg" className="group shadow-[0_0_32px_rgba(251,191,36,0.2)]">
              Know Your Governor
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
