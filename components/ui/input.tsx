import React from "react"
import { Input as HeroInput, type InputProps as HeroInputProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface InputProps extends HeroInputProps {
  asChild?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroInput ref={ref} className={cn(className)} {...props} />
})
Input.displayName = "Input"

export { Input }
