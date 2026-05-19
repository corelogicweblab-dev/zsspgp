"use client";

import Link from "next/link";
import { FastImage } from "@/components/ui/fast-image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LOGO_PATH } from "@/lib/constants";

export function LandingHero() {
  return (
    <section className="gradient-hero relative overflow-hidden rounded-2xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative flex flex-col items-center gap-10 lg:flex-row lg:justify-between"
      >
        <div className="max-w-2xl text-center lg:text-left">
          <h1 className="text-4xl font-bold text-white text-glow sm:text-5xl">
            Smart Provincial Governance
          </h1>
          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link href="/register">
              <Button variant="gov" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring" }}>
          <FastImage
            src={LOGO_PATH}
            alt="Zamboanga Sibugay"
            width={200}
            height={200}
            className="logo-glow rounded-full"
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
