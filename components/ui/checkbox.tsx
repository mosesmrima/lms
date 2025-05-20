import React from "react"
import { Checkbox as HeroCheckbox, type CheckboxProps as HeroCheckboxProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends HeroCheckboxProps {
  asChild?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroCheckbox ref={ref} className={cn(className)} {...props} />
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
