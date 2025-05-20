"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Award, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getAllUserProgress, getUserEnrollments, getCourses } from "@/lib/firebase"
import { LoadingSpinner } from "@/components/loading-spinner"

export function DashboardStats() {
  const { user, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedLessons: 0,
    totalHours: 0,
  })
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Skip if auth is still loading or we've already loaded stats
    if (authLoading || hasLoaded) return

    // Only fetch stats if we have a user and haven't loaded yet
    if (user && !hasLoaded) {
      const fetchStats = async () => {
        try {
          setIsLoading(true)

          // Get enrolled courses
          const userEnrollments = (await getUserEnrollments(user.uid)) || []

          // Get completed lessons
          const completedLessons = (await getAllUserProgress(user.uid)) || []

          // Get all courses to calculate total hours
          const allCourses = (await getCourses()) || []

          // Calculate total hours from enrolled courses
          const enrolledCoursesData = allCourses.filter((course) => userEnrollments.includes(course.id))

          const totalHours = enrolledCoursesData.reduce((total, course) => {
            // Extract hours from duration (e.g., "4 weeks" -> 0)
            const hours = course.duration?.includes("hour")
              ? Number.parseInt(course.duration)
              : course.duration?.includes("week")
                ? Number.parseInt(course.duration) * 5 // Rough estimate: 5 hours per week
                : 0
            return total + hours
          }, 0)

          setStats({
            enrolledCourses: userEnrollments.length,
            completedLessons: completedLessons.length,
            totalHours,
          })

          // Mark as loaded to prevent re-fetching
          setHasLoaded(true)
        } catch (error) {
          console.error("Error fetching dashboard stats:", error)
          // Set default values in case of error
          setStats({
            enrolledCourses: 0,
            completedLessons: 0,
            totalHours: 0,
          })
          // Still mark as loaded to prevent infinite retries
          setHasLoaded(true)
        } finally {
          setIsLoading(false)
        }
      }

      fetchStats()
    }
  }, [user, authLoading, hasLoaded])

  // Show loading state while auth is loading or data is being fetched
  if (authLoading || isLoading) {
    return (
      <>
        <Card className="bg-[#1e1e1e] border-[#333333]">
          <CardContent className="p-4 sm:p-6 flex justify-center">
            <LoadingSpinner />
          </CardContent>
        </Card>
        <Card className="bg-[#1e1e1e] border-[#333333]">
          <CardContent className="p-4 sm:p-6 flex justify-center">
            <LoadingSpinner />
          </CardContent>
        </Card>
        <Card className="bg-[#1e1e1e] border-[#333333]">
          <CardContent className="p-4 sm:p-6 flex justify-center">
            <LoadingSpinner />
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <Card className="bg-[#1e1e1e] border-[#333333]">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-[#f90026]/10 p-2 sm:p-3 rounded-full">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#f90026]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-300">Enrolled Courses</p>
              <h3 className="text-xl sm:text-2xl font-bold">{stats.enrolledCourses}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-[#1e1e1e] border-[#333333]">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-[#f90026]/10 p-2 sm:p-3 rounded-full">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-[#f90026]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-300">Completed Lessons</p>
              <h3 className="text-xl sm:text-2xl font-bold">{stats.completedLessons}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-[#1e1e1e] border-[#333333]">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-[#f90026]/10 p-2 sm:p-3 rounded-full">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#f90026]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-300">Total Hours</p>
              <h3 className="text-xl sm:text-2xl font-bold">{stats.totalHours}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
