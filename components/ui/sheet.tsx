"use client"

import React from "react"
import { Drawer as HeroDrawer, type DrawerProps as HeroDrawerProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface SheetProps extends HeroDrawerProps {
  asChild?: boolean
}

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroDrawer ref={ref} className={cn(className)} {...props} />
})
Sheet.displayName = "Sheet"

const SheetTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn("", className)} {...props} />
  },
)
SheetTrigger.displayName = "SheetTrigger"

const SheetContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
SheetContent.displayName = "SheetContent"

const SheetHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
SheetHeader.displayName = "SheetHeader"

const SheetBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
SheetBody.displayName = "SheetBody"

const SheetFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
SheetFooter.displayName = "SheetFooter"

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetBody, SheetFooter }
