"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-2xl font-bold text-white text-glow sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-2 text-slate-400">{subtitle}</p>}
    </motion.header>
  );
}
