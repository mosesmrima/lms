"use client"

import React from "react"
import { Button as HeroButton, type ButtonProps as HeroButtonProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface ToggleProps extends HeroButtonProps {
  asChild?: boolean
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroButton ref={ref} className={cn(className)} {...props} />
})
Toggle.displayName = "Toggle"

export { Toggle }
