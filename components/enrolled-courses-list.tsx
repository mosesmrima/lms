"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useStore } from "@/lib/store"
import { getCourses, getUserEnrollments, getUserCourseProgress } from "@/lib/firebase"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Course } from "@/lib/types"

export function EnrolledCoursesList() {
  const { user, loading: authLoading } = useAuth()
  const { enrolledCourses, fetchEnrolledCourses } = useStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [courseProgress, setCourseProgress] = useState<Record<string, Record<string, { completed: boolean }>>>({})
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Skip if auth is still loading or we've already loaded courses
    if (authLoading || hasLoaded) return

    // Only fetch courses if we have a user and haven't loaded yet
    if (user && !hasLoaded) {
      const fetchCourses = async () => {
        try {
          setIsLoading(true)

          // Get user enrollments
          const enrollmentIds = await getUserEnrollments(user.uid)

          // Update global state with enrollments
          await fetchEnrolledCourses(user.uid)

          if (!enrollmentIds || enrollmentIds.length === 0) {
            setCourses([])
            setIsLoading(false)
            setHasLoaded(true)
            return
          }

          // Get all courses
          const allCourses = await getCourses()

          // Filter to only enrolled courses
          const enrolledCourses = allCourses.filter((course) => enrollmentIds.includes(course.id))

          // Get progress for each course
          const progressData: Record<string, Record<string, { completed: boolean }>> = {}

          await Promise.all(
            enrollmentIds.map(async (courseId) => {
              const progress = await getUserCourseProgress(user.uid, courseId)
              progressData[courseId] = progress
            }),
          )

          setCourseProgress(progressData)
          setCourses(enrolledCourses)
          setHasLoaded(true)
        } catch (error) {
          console.error("Error fetching enrolled courses:", error)
          setCourses([])
          setHasLoaded(true)
        } finally {
          setIsLoading(false)
        }
      }

      fetchCourses()
    }
  }, [user, authLoading, fetchEnrolledCourses, hasLoaded])

  // Calculate progress percentage for a course
  const calculateProgress = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course || !course.lessons || course.lessons.length === 0) return 0

    const progress = courseProgress[courseId] || {}
    const completedLessons = Object.values(progress).filter((lesson) => lesson.completed).length
    return Math.round((completedLessons / course.lessons.length) * 100)
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">You haven't enrolled in any courses yet</h3>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">Browse our courses and start learning today!</p>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const progressPercent = calculateProgress(course.id)
        const isCompleted = progressPercent === 100

        return (
          <Card key={course.id} className="bg-[#1e1e1e] border-[#333333] overflow-hidden flex flex-col">
            <div className="relative h-36 sm:h-48 overflow-hidden">
              <img
                src={course.image || `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(course.title)}`}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              {isCompleted && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Completed
                </div>
              )}
            </div>

            <CardContent className="flex-grow p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-1">{course.title}</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>

              <div className="mb-4">
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-[#f90026]"}`}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-gray-400">
                <p>
                  {course.lessons?.length || 0} lessons • {course.duration}
                </p>
                <p className="mt-2 line-clamp-2">
                  {isCompleted
                    ? "You've completed this course! Review the material anytime."
                    : progressPercent > 0
                      ? `Continue your progress! You're ${progressPercent}% through this course.`
                      : "Start this course to track your progress."}
                </p>
              </div>
            </CardContent>

            <CardFooter className="p-4 sm:p-6 pt-0">
              <Button
                asChild
                className={`w-full text-xs sm:text-sm ${isCompleted ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                <Link href={`/courses/${course.id}`}>
                  {progressPercent > 0 && !isCompleted
                    ? "Continue Learning"
                    : isCompleted
                      ? "Review Course"
                      : "Start Learning"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
