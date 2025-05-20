"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { hasInstructorPermission } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CourseForm } from "@/components/course-form"

export default function CreateCoursePage() {
  const { userRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect non-instructors after loading completes
    if (!loading && !hasInstructorPermission(userRole)) {
      router.push("/dashboard")
    }
  }, [userRole, loading, router])

  // Show loading state while checking permissions
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If not an instructor, don't render the page content
  // (the useEffect will handle the redirect)
  if (!hasInstructorPermission(userRole)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-white">You don't have permission to access this page.</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      <CourseForm />
    </div>
  )
}
