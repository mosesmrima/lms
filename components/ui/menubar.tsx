"use client"

import React from "react"
import { Navbar as HeroNavbar, type NavbarProps as HeroNavbarProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface MenubarProps extends HeroNavbarProps {
  asChild?: boolean
}

const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroNavbar ref={ref} className={cn(className)} {...props} />
})
Menubar.displayName = "Menubar"

const MenubarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn("", className)} {...props} />
  },
)
MenubarTrigger.displayName = "MenubarTrigger"

const MenubarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
MenubarContent.displayName = "MenubarContent"

const MenubarItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
MenubarItem.displayName = "MenubarItem"

const MenubarSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
MenubarSeparator.displayName = "MenubarSeparator"

export { Menubar, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator }
