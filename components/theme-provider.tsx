"use client"

import type * as React from "react"
import { HeroUIProvider } from "@heroui/react"

type Theme = "dark" | "light" | "system"

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  return <HeroUIProvider>{children}</HeroUIProvider>
}
