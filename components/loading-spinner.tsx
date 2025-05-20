"use client"

import { Spinner } from "@nextui-org/react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return <Spinner size={size} color="primary" className={className} />
}
