"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { isUserEnrolledInCourse } from "@/lib/firebase"
import { FileText, Download, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Attachment } from "@/lib/types"

interface AttachmentListProps {
  attachments: Attachment[]
  courseId: string
  className?: string
}

export function AttachmentList({ attachments, courseId, className }: AttachmentListProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  if (!attachments || attachments.length === 0) {
    return null
  }

  const handleDownload = async (attachment: Attachment) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to download course materials.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCheckingEnrollment(true)
      setDownloadingId(attachment.id)

      // Check if user is enrolled in this course
      const enrolled = await isUserEnrolledInCourse(user.uid, courseId)

      if (!enrolled) {
        toast({
          title: "Enrollment Required",
          description: "You need to enroll in this course to download materials.",
          variant: "destructive",
        })
        return
      }

      // Proceed with secure download
      const response = await fetch(
        `/api/download?fileUrl=${encodeURIComponent(attachment.url)}&fileName=${encodeURIComponent(attachment.name)}&courseId=${courseId}&userId=${user.uid}`,
      )

      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = attachment.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download Started",
        description: `${attachment.name} is downloading.`,
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingEnrollment(false)
      setDownloadingId(null)
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-medium flex items-center">
        <FileText className="mr-2 h-4 w-4" />
        Course Materials
      </h3>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-3 bg-[#111111] rounded-md border border-[#333333]"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <FileText className="h-5 w-5 flex-shrink-0 text-gray-400" />
              <div className="min-w-0">
                <p className="font-medium truncate">{attachment.name}</p>
                <p className="text-xs text-gray-400">{attachment.type}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-4 flex-shrink-0 border-[#333333] hover:bg-[#111111] hover:text-white text-xs sm:text-sm"
              onClick={() => handleDownload(attachment)}
              disabled={isCheckingEnrollment || downloadingId === attachment.id}
            >
              {downloadingId === attachment.id ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : user ? (
                <>
                  <Download className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Download
                </>
              ) : (
                <>
                  <Lock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Sign in to Download
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
