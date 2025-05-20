"use client"

import React from "react"
import { Label as HeroLabel, type LabelProps as HeroLabelProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface LabelProps extends HeroLabelProps {
  asChild?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return <HeroLabel ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
})
Label.displayName = "Label"

export { Label }
