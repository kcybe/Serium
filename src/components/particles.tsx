"use client"

import { motion } from "framer-motion"
import React from "react"
import { useEffect, useState, useMemo } from "react"

interface ParticlesProps {
  count?: number
  color?: string
  size?: number | [number, number]
  speed?: number | [number, number]
  range?: number
  opacity?: number | [number, number]
  shape?: "circle" | "square" | "mixed"
  className?: string
  duration?: number | [number, number]
  persistent?: boolean
}

const Particle = React.memo(({ 
  id,
  color,
  size,
  speed,
  range,
  opacity,
  shape,
  duration = 4,
  persistent = false
}: { id: number } & Omit<ParticlesProps, "count" | "className">) => {
  const [isMounted, setIsMounted] = useState(false)
  const [path, setPath] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    setIsMounted(true)
    // Generate random path points
    const points = Array.from({ length: 5 }, () => ({
      x: Math.random() * (range ?? 100) - (range ?? 100)/2,
      y: Math.random() * (range ?? 100) - (range ?? 100)/2
    }))
    setPath(points)
    return () => setIsMounted(false)
  }, [range])

  const particleSize = Array.isArray(size) 
    ? Math.random() * (size[1] - size[0]) + size[0] 
    : size ?? 1

  const animationDuration = Array.isArray(duration)
    ? Math.random() * (duration[1] - duration[0]) + duration[0]
    : duration

  const opacityRange = persistent 
    ? (Array.isArray(opacity)
      ? [opacity[0], opacity[1] ?? opacity[0]]
      : [opacity ?? 0.4, opacity ?? 0.4])
    : (Array.isArray(opacity)
      ? [Math.random() * (opacity[1] - opacity[0]) + opacity[0], 0]
      : [opacity ?? 0.4, 0])

  const shapeClass = {
    circle: "rounded-full",
    square: "rounded-sm",
    mixed: Math.random() > 0.5 ? "rounded-full" : "rounded-sm"
  }[shape ?? "circle"]

  if (!isMounted || path.length === 0) return null

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        scale: 0.5,
        y: 20,
        x: -50
      }}
      animate={{ 
        opacity: persistent ? opacityRange[0] : opacityRange,
        scale: [0.8, 1.2, 0.8],
        x: path.map(p => p.x),
        y: path.map(p => p.y)
      }}
      transition={{
        duration: animationDuration * 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
        delay: Math.random() * 2
      }}
      className={`absolute ${shapeClass} ${color ?? 'bg-primary/20 dark:bg-primary/30'}`}
      style={{
        left: `${50 + Math.random() * 20 - 10}%`,
        top: `${50 + Math.random() * 20 - 10}%`,
        width: `${particleSize}px`,
        height: `${particleSize}px`,
      }}
    />
  )
})

export function Particles({
  count = 100,
  color,
  size = 1,
  speed = 4,
  range = 100,
  opacity = 0.4,
  shape = "circle",
  duration = 4,
  persistent = false,
  className = ""
}: ParticlesProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`absolute inset-0 overflow-hidden z-0 ${className}`}
      suppressHydrationWarning
    >
      {isClient && Array.from({ length: count }).map((_, i) => (
        <Particle
          key={i}
          id={i}
          color={color}
          size={size}
          speed={speed}
          range={range}
          opacity={opacity}
          shape={shape}
          duration={duration}
          persistent={persistent}
        />
      ))}
    </motion.div>
  )
} 