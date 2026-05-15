"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { APP_NAME, LOGO_PATH } from "@/lib/constants";

export function LandingHero() {
  return (
    <section className="gradient-hero relative overflow-hidden px-4 py-24 text-white sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:justify-between"
      >
        <div className="max-w-2xl text-center lg:text-left">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
            Province of Zamboanga Sibugay
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Smart Provincial Governance Platform
          </h1>
          <p className="mt-6 text-lg text-blue-100">{APP_NAME}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                Citizen Registration
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                Official Login
              </Button>
            </Link>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Image
            src={LOGO_PATH}
            alt="Zamboanga Sibugay"
            width={280}
            height={280}
            className="rounded-full shadow-2xl ring-4 ring-white/30"
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
