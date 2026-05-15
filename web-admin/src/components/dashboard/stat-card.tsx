"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
  index?: number;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral",
  className,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: "0 0 32px rgba(56,189,248,0.2)" }}
      className={cn("glass-panel glass-panel-hover rounded-2xl p-6", className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend === "up" && "text-emerald-400",
                trend === "down" && "text-red-400",
                trend === "neutral" && "text-slate-500"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <motion.div
          className="rounded-xl bg-cyan-500/15 p-3 ring-1 ring-cyan-500/30"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="h-6 w-6 text-cyan-400" />
        </motion.div>
      </div>
    </motion.div>
  );
}
