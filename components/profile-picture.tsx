"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"

interface ProfilePictureProps {
  src: string | null
  alt: string
  onUploadClick: () => void
  isLoading?: boolean
}

export default function ProfilePicture({ src, alt, onUploadClick, isLoading = false }: ProfilePictureProps) {
  const [isHovering, setIsHovering] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-32 h-32 rounded-full overflow-hidden mb-4"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {src ? (
          <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-4xl font-semibold">{getInitials(alt)}</span>
          </div>
        )}

        {isHovering && !isLoading && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
            onClick={onUploadClick}
          >
            <Camera className="text-white h-8 w-8" />
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <LoadingSpinner size="md" />
          </div>
        )}
      </div>

      <Button variant="outline" size="sm" onClick={onUploadClick} disabled={isLoading} className="mb-2">
        {isLoading ? "Uploading..." : "Change Picture"}
      </Button>
    </div>
  )
}
