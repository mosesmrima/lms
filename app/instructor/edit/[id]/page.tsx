"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { hasInstructorPermission } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CourseForm } from "@/components/course-form"
import { getCourse } from "@/lib/firebase"
import type { Course } from "@/lib/types"

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const { userRole, user, loading } = useAuth()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect non-instructors after loading completes
    if (!loading && !hasInstructorPermission(userRole)) {
      router.push("/dashboard")
    }
  }, [userRole, loading, router])

  useEffect(() => {
    async function loadCourse() {
      if (!params.id) return

      try {
        const courseData = await getCourse(params.id)

        // Check if the user is the course instructor or an admin
        if (courseData && user && (courseData.instructorId === user.uid || userRole === "admin")) {
          setCourse(courseData)
        } else {
          // Not the course owner
          router.push("/instructor")
        }
      } catch (error) {
        console.error("Error loading course:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadCourse()
    }
  }, [params.id, user, userRole, router])

  // Show loading state while checking permissions or loading course
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If not an instructor, don't render the page content
  if (!hasInstructorPermission(userRole)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-white">You don't have permission to access this page.</p>
      </div>
    )
  }

  // If course not found or user is not the owner
  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-white">Course not found or you don't have permission to edit it.</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <CourseForm initialData={course} />
    </div>
  )
}
