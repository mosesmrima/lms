import React from "react"
import { Button as HeroButton, type ButtonProps as HeroButtonProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends HeroButtonProps {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroButton ref={ref} className={cn(className)} {...props} />
})
Button.displayName = "Button"

// This is for compatibility with existing code
export const buttonVariants = (options: any = {}) => {
  const { variant = "solid", size = "md", className = "" } = options
  return cn(className)
}

export { Button }
