"use client";

import { motion } from "framer-motion";
import { ProvincialLogo } from "@/components/ui/provincial-logo";

export function HeroLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
      whileHover={{ scale: 1.05 }}
      className="shrink-0"
    >
      <ProvincialLogo size={220} priority showGlow />
    </motion.div>
  );
}
