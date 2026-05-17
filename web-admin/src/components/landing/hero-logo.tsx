"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GOVERNOR_HEADER_IMAGE_PATH,
  GOVERNOR_PROFILE,
  KNOW_YOUR_GOVERNOR_PATH,
} from "@/lib/governor-profile";

export function HeroLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, delay: 0.12 }}
      className="hero-governor-portrait shrink-0"
    >
      <Link
        href={KNOW_YOUR_GOVERNOR_PATH}
        className="group relative isolate block"
        aria-label={`Know Your Governor — ${GOVERNOR_PROFILE.name}`}
      >
        <div className="hero-portrait-ring" aria-hidden />
        <div className="relative z-10 h-[7.5rem] w-[7.5rem] overflow-hidden rounded-full border-2 border-cyan-400/40 bg-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.35)] sm:h-36 sm:w-36 lg:h-44 lg:w-44">
          <Image
            src={GOVERNOR_HEADER_IMAGE_PATH}
            alt={GOVERNOR_PROFILE.name}
            fill
            className="object-cover object-top transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 120px, 176px"
            priority
          />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-slate-950/50 via-transparent to-cyan-400/10" />
        </div>
        <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-wider text-cyan-300/80 sm:text-xs">
          Working Governor
        </p>
      </Link>
    </motion.div>
  );
}
