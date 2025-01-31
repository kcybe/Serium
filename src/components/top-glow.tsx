"use client"

import { motion, transform } from "framer-motion"

interface TopGlowProps {
  color?: string
}

export function TopGlow({ color = "rgba(99, 102, 241, 0.3)" }: TopGlowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, transform: "translateX(-100px)"}}
      animate={{ opacity: 1, scale: 1, transform: "translateX(0px)"}}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-x-0 top-0 z-0 h-[300px] pointer-events-none"
      style={{
        background: `radial-gradient(600px at 50% -100px, ${color}, transparent 80%)`,
      }}
    />
  )
}