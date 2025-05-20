"use client"

import React from "react"
import { Progress as HeroProgress, type ProgressProps as HeroProgressProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends HeroProgressProps {
  asChild?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroProgress ref={ref} className={cn(className)} {...props} />
})
Progress.displayName = "Progress"

export { Progress }
