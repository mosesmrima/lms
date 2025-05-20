"use client"

import React from "react"
import { Popover as HeroPopover, type PopoverProps as HeroPopoverProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface PopoverProps extends HeroPopoverProps {
  asChild?: boolean
}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroPopover ref={ref} className={cn(className)} {...props} />
})
Popover.displayName = "Popover"

const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn("", className)} {...props} />
  },
)
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
