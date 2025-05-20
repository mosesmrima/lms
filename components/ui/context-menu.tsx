"use client"

import React from "react"
import { Dropdown as HeroDropdown, type DropdownProps as HeroDropdownProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface ContextMenuProps extends HeroDropdownProps {
  asChild?: boolean
}

const ContextMenu = React.forwardRef<HTMLDivElement, ContextMenuProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroDropdown ref={ref} className={cn(className)} {...props} />
})
ContextMenu.displayName = "ContextMenu"

const ContextMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn("", className)} {...props} />
  },
)
ContextMenuTrigger.displayName = "ContextMenuTrigger"

const ContextMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
ContextMenuContent.displayName = "ContextMenuContent"

const ContextMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
ContextMenuItem.displayName = "ContextMenuItem"

const ContextMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("", className)} {...props} />
  },
)
ContextMenuSeparator.displayName = "ContextMenuSeparator"

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator }
