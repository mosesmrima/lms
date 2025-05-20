"use client"

import React from "react"
import { Slider as HeroSlider, type SliderProps as HeroSliderProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface SliderProps extends HeroSliderProps {
  asChild?: boolean
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroSlider ref={ref} className={cn(className)} {...props} />
})
Slider.displayName = "Slider"

export { Slider }
