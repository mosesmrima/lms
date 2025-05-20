"use client"

import React from "react"
import { RadioGroup as HeroRadioGroup, type RadioGroupProps as HeroRadioGroupProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface RadioGroupProps extends HeroRadioGroupProps {
  asChild?: boolean
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroRadioGroup ref={ref} className={cn(className)} {...props} />
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} type="radio" className={cn("", className)} {...props} />
  },
)
RadioGroupItem.displayName = "RadioGroupItem"

const RadioGroupLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return <label ref={ref} className={cn("", className)} {...props} />
  },
)
RadioGroupLabel.displayName = "RadioGroupLabel"

export { RadioGroup, RadioGroupItem, RadioGroupLabel }
