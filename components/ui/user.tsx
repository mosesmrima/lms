import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserProps {
  name: string
  email?: string
  avatarUrl?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function User({ name, email, avatarUrl, className, size = "md" }: UserProps) {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  // Determine avatar size
  const avatarSize = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }[size]

  // Determine text size
  const textSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size]

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar className={avatarSize}>
        {avatarUrl && <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className={cn("font-medium leading-none", textSize)}>{name}</p>
        {email && <p className="text-muted-foreground text-sm">{email}</p>}
      </div>
    </div>
  )
}
