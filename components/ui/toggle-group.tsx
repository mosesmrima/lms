"use client"

import React from "react"
import { ButtonGroup as HeroButtonGroup, type ButtonGroupProps as HeroButtonGroupProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface ToggleGroupProps extends HeroButtonGroupProps {
  asChild?: boolean
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroButtonGroup ref={ref} className={cn(className)} {...props} />
})
ToggleGroup.displayName = "ToggleGroup"

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn("", className)} {...props} />
  },
)
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }
