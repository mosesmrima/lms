import React from "react"
import { Tabs as HeroTabs, Tab as HeroTab } from "@heroui/react"
import { cn } from "@/lib/utils"

// Simple wrappers around HeroUI components
export const Tabs = HeroTabs
export const Tab = HeroTab

// For compatibility with existing code
const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex", className)} {...props} />
  },
)
TabsList.displayName = "TabsList"

// For compatibility with existing code
const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: string }
>(({ className, ...props }, ref) => {
  return <button ref={ref} className={cn(className)} {...props} />
})
TabsTrigger.displayName = "TabsTrigger"

// For compatibility with existing code
const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: string }>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    )
  },
)
TabsContent.displayName = "TabsContent"

export { TabsList, TabsTrigger, TabsContent }
