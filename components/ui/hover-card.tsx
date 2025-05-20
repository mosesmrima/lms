"use client"

import React from "react"
import { Tooltip as HeroTooltip, type TooltipProps as HeroTooltipProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface HoverCardProps extends HeroTooltipProps {
  asChild?: boolean
}

const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroTooltip ref={ref} className={cn(className)} {...props} />
})
HoverCard.displayName = "HoverCard"

const HoverCardTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn("", className)} {...props} />
  },
)
HoverCardTrigger.displayName = "HoverCardTrigger"

const HoverCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
HoverCardContent.displayName = "HoverCardContent"

export { HoverCard, HoverCardTrigger, HoverCardContent }
