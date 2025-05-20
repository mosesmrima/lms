"use client"

import React from "react"
import { Tooltip as HeroTooltip, type TooltipProps as HeroTooltipProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface TooltipProps extends HeroTooltipProps {
  asChild?: boolean
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroTooltip ref={ref} className={cn(className)} {...props} />
})
Tooltip.displayName = "Tooltip"

const TooltipTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn("", className)} {...props} />
  },
)
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, sideOffset = 4, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent }
