import React from "react"
import { Avatar as HeroAvatar, type AvatarProps as HeroAvatarProps } from "@heroui/react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends HeroAvatarProps {
  asChild?: boolean
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ className, asChild = false, ...props }, ref) => {
  return <HeroAvatar ref={ref} className={cn(className)} {...props} />
})
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => {
    return <img ref={ref} className={cn("h-full w-full object-cover", className)} {...props} />
  },
)
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800", className)}
        {...props}
      />
    )
  },
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
