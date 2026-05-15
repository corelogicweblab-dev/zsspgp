"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function LandingHeroActions() {
  return (
    <motion.div
      className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Link href="/register">
        <Button variant="gov" size="lg">
          Create Account
        </Button>
      </Link>
      <Link href="/login">
        <Button variant="outline" size="lg">
          Official Login
        </Button>
      </Link>
    </motion.div>
  );
}
