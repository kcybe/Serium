"use client"

import { motion } from "framer-motion"
import { pixelifySans } from "@/lib/fonts"
import { useState } from "react"

export function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="flex items-center justify-center gap-2"
    >
      <motion.span
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className={`
          ${pixelifySans.className} 
          text-xl 
          font-bold 
          matrix-text
          relative
          [animation:matrix-reveal_1s_cubic-bezier(0.25,0.46,0.45,0.94)_both]
        `}
      >
        serium
      </motion.span>
    </motion.div>
  )
}