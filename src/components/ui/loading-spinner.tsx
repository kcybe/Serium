"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/services/utils/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: number
}

export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
  return (
    <Loader2 
      className={cn("animate-spin", className)} 
      size={size}
    />
  )
}