import React from "react"
import {
  Card as HeroCard,
  CardBody,
  CardFooter as HeroCardFooter,
  CardHeader as HeroCardHeader,
  type CardProps,
} from "@heroui/react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return <HeroCard ref={ref} className={cn(className)} {...props} />
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <HeroCardHeader ref={ref} className={cn(className)} {...props} />
  },
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return <h3 ref={ref} className={cn("text-xl font-semibold", className)} {...props} />
  },
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props} />
  },
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <CardBody ref={ref} className={cn(className)} {...props} />
  },
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <HeroCardFooter ref={ref} className={cn(className)} {...props} />
  },
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
