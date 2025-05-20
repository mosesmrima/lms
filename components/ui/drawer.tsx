"use client"

import React from "react"
import { Drawer as HeroDrawer, type DrawerProps as HeroDrawerProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface DrawerProps extends HeroDrawerProps {
  asChild?: boolean
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroDrawer ref={ref} className={cn(className)} {...props} />
})
Drawer.displayName = "Drawer"

const DrawerTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn("", className)} {...props} />
  },
)
DrawerTrigger.displayName = "DrawerTrigger"

const DrawerContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
DrawerBody.displayName = "DrawerBody"

const DrawerFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
DrawerFooter.displayName = "DrawerFooter"

export { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter }
