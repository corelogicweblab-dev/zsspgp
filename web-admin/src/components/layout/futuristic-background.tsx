"use client";

import { motion } from "framer-motion";

const orbs = [
  { size: 480, x: "8%", y: "12%", color: "rgba(56,189,248,0.32)", duration: 24 },
  { size: 360, x: "78%", y: "50%", color: "rgba(99,102,241,0.26)", duration: 20 },
  { size: 300, x: "42%", y: "82%", color: "rgba(14,165,233,0.2)", duration: 28 },
  { size: 220, x: "88%", y: "8%", color: "rgba(6,182,212,0.18)", duration: 22 },
  { size: 260, x: "5%", y: "72%", color: "rgba(251,191,36,0.14)", duration: 26 },
];

export function FuturisticBackground() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <div className="futuristic-bg absolute inset-0" />
      <div className="grid-pulse absolute inset-0" />
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -35, 25, 0],
            scale: [1, 1.15, 0.95, 1],
            opacity: [0.5, 0.85, 0.6, 0.5],
          }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="scan-line" />
      <motion.div
        className="hex-overlay absolute inset-0"
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
