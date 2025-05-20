"use client"

import * as React from "react"
import { addToast as heroAddToast } from "@heroui/react"
import { cn } from "@/lib/utils"

// For compatibility with existing code
const ToastProvider = ({ children }: { children: React.ReactNode }) => children

const ToastViewport = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => null

// Simple wrapper around HeroUI's toast
const toast = {
  // Basic toast function
  async: (title: string, description?: string) => {
    heroAddToast({
      title,
      description,
      color: "default",
    })
    return { id: Date.now().toString() }
  },

  // Success toast
  success: (title: string, description?: string) => {
    heroAddToast({
      title,
      description,
      color: "success",
    })
    return { id: Date.now().toString() }
  },

  // Error toast
  error: (title: string, description?: string) => {
    heroAddToast({
      title,
      description,
      color: "danger",
    })
    return { id: Date.now().toString() }
  },

  // Info toast
  info: (title: string, description?: string) => {
    heroAddToast({
      title,
      description,
      color: "primary",
    })
    return { id: Date.now().toString() }
  },

  // Warning toast
  warning: (title: string, description?: string) => {
    heroAddToast({
      title,
      description,
      color: "warning",
    })
    return { id: Date.now().toString() }
  },

  // Default toast (alias for async)
  default: (title: string, description?: string) => {
    heroAddToast({
      title,
      description,
      color: "default",
    })
    return { id: Date.now().toString() }
  },

  // Dismiss toast (no-op as HeroUI handles this automatically)
  dismiss: (id?: string) => {},
}

// Compatibility components
const Toast = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
Toast.displayName = "Toast"

const ToastTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h2 ref={ref} className={cn("text-sm font-semibold", className)} {...props} />,
)
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm opacity-90", className)} {...props} />,
)
ToastDescription.displayName = "ToastDescription"

const ToastClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => <button ref={ref} className={cn("", className)} {...props} />,
)
ToastClose.displayName = "ToastClose"

const ToastAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => <button ref={ref} className={cn("", className)} {...props} />,
)
ToastAction.displayName = "ToastAction"

export { toast, ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction }
