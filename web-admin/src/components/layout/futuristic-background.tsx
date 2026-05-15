"use client";

import { motion } from "framer-motion";

const orbs = [
  { size: 420, x: "10%", y: "15%", color: "rgba(56,189,248,0.35)", duration: 22 },
  { size: 320, x: "75%", y: "55%", color: "rgba(99,102,241,0.28)", duration: 18 },
  { size: 280, x: "45%", y: "80%", color: "rgba(14,165,233,0.22)", duration: 26 },
  { size: 200, x: "85%", y: "10%", color: "rgba(6,182,212,0.2)", duration: 20 },
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
