"use client";

import { motion } from "framer-motion";
import { PageHeader } from "./page-header";

interface CitizenPageProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  maxWidth?: "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "7xl";
}

const widthClass = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "7xl": "max-w-7xl",
};

export function CitizenPage({
  children,
  title,
  subtitle,
  maxWidth = "2xl",
}: CitizenPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`mx-auto w-full ${widthClass[maxWidth]}`}
    >
      <PageHeader title={title} subtitle={subtitle} />
      {children}
    </motion.div>
  );
}
