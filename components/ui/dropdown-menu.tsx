"use client"

import * as React from "react"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu as HeroDropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react"
import { cn } from "@/lib/utils"

const DropdownMenu = Dropdown

const DropdownMenuTrigger = DropdownTrigger

const DropdownMenuContent = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<typeof HeroDropdownMenu>>(
  ({ className, ...props }, ref) => (
    <HeroDropdownMenu
      ref={ref}
      className={cn(
        "min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        className,
      )}
      {...props}
    />
  ),
)
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<typeof DropdownItem> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuGroup = DropdownSection

const DropdownMenuSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => <hr ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />,
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)} {...props} />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuLabel,
}
