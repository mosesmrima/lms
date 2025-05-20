"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@heroui/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstructorCoursesList } from "@/components/instructor-courses-list"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { hasInstructorPermission } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function InstructorDashboard() {
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
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Instructor Dashboard</h1>
        <Link href="/instructor/create">
          <Button className="bg-[#f90026] hover:bg-[#d10021] w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Course
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="bg-[#1e1e1e] mb-6 w-full">
          <TabsTrigger value="courses" className="flex-1">
            My Courses
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1">
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="courses">
          <InstructorCoursesList />
        </TabsContent>
        <TabsContent value="analytics">
          <div className="bg-[#1e1e1e] p-4 sm:p-6 rounded-lg border border-[#333333] text-center py-8 sm:py-12">
            <h3 className="text-lg sm:text-xl font-bold mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Course performance analytics will be available in the next update.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
