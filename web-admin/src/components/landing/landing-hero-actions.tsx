"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function LandingHeroActions() {
  return (
    <motion.div
      className="mt-5 flex flex-wrap justify-center gap-2.5 sm:mt-7 sm:gap-3 lg:justify-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Link href="/register">
        <Button variant="gov" size="default" className="sm:h-12 sm:px-8 sm:text-base">
          Create Account
        </Button>
      </Link>
      <Link href="/login">
        <Button variant="outline" size="default" className="sm:h-12 sm:px-8 sm:text-base">
          Official Login
        </Button>
      </Link>
    </motion.div>
  );
}
