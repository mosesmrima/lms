"use client"

import React from "react"
import { Switch as HeroSwitch, type SwitchProps as HeroSwitchProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends HeroSwitchProps {
  asChild?: boolean
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroSwitch ref={ref} className={cn(className)} {...props} />
})
Switch.displayName = "Switch"

export { Switch }
