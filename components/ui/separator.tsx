"use client"

import React from "react"
import { Divider as HeroDivider, type DividerProps as HeroDividerProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface SeparatorProps extends HeroDividerProps {
  asChild?: boolean
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroDivider ref={ref} className={cn(className)} {...props} />
})
Separator.displayName = "Separator"

export { Separator }
