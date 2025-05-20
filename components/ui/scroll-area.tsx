"use client"

import React from "react"
import { ScrollShadow as HeroScrollShadow, type ScrollShadowProps as HeroScrollShadowProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface ScrollAreaProps extends HeroScrollShadowProps {
  asChild?: boolean
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroScrollShadow ref={ref} className={cn(className)} {...props} />
})
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
