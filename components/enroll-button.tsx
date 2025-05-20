"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { setCookie, eraseCookie } from "@/lib/cookies"

interface EnrollButtonProps {
  courseId: string
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { enrolledCourses, enrollInCourse, unenrollFromCourse, fetchEnrolledCourses } = useStore()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) return

      try {
        await fetchEnrolledCourses(user.uid)
      } catch (error) {
        console.error("Error checking enrollment:", error)
      }
    }

    checkEnrollment()
  }, [user, fetchEnrolledCourses])

  useEffect(() => {
    setIsEnrolled(enrolledCourses.includes(courseId))
  }, [enrolledCourses, courseId])

  const handleEnrollment = async () => {
    if (!user) {
      router.push(`/signin?callbackUrl=/courses/${courseId}`)
      return
    }

    setIsLoading(true)

    try {
      if (isEnrolled) {
        await unenrollFromCourse(user.uid, courseId)
        // Remove enrollment cookie
        eraseCookie(`enrolled-${courseId}`)

        toast({
          title: "Unenrolled",
          description: "You have been unenrolled from this course.",
        })
      } else {
        await enrollInCourse(user.uid, courseId)
        // Set enrollment cookie for middleware checks
        setCookie(`enrolled-${courseId}`, "true", 7)

        toast({
          title: "Enrolled",
          description: "You have been enrolled in this course.",
        })
      }
    } catch (error) {
      console.error("Error handling enrollment:", error)
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleEnrollment}
      disabled={isLoading}
      className={isEnrolled ? "bg-gray-600 hover:bg-gray-700" : "bg-[#f90026] hover:bg-[#d10021]"}
      size="lg"
      fullWidth
    >
      {isLoading ? "Processing..." : isEnrolled ? "Unenroll from Course" : "Enroll in Course"}
    </Button>
  )
}
