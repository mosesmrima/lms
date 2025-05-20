import React from "react"
import { Select as HeroSelect, SelectItem as HeroSelectItem, type SelectProps as HeroSelectProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface SelectProps extends HeroSelectProps {
  asChild?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroSelect ref={ref} className={cn(className)} {...props} />
})
Select.displayName = "Select"

// Add the missing exports that are being used elsewhere in the project
const SelectTrigger = Select

const SelectValue = ({ children }: { children: React.ReactNode }) => children

const SelectContent = ({ children }: { children: React.ReactNode }) => children

const SelectItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => {
    return <HeroSelectItem ref={ref} className={cn(className)} {...props} />
  },
)
SelectItem.displayName = "SelectItem"

export { Select, SelectItem, SelectTrigger, SelectValue, SelectContent }
