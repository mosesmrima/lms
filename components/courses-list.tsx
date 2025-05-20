"use client"

import { useEffect, useState } from "react"
import { CourseCard } from "@/components/course-card"
import { getCourses } from "@/lib/firebase"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Course } from "@/lib/types"

export function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const coursesData = await getCourses()
        setCourses(coursesData)
      } catch (err) {
        console.error("Error fetching courses:", err)
        setError("Failed to load courses. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-[#1e1e1e] rounded-lg">
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p className="text-gray-300 mb-6">{error}</p>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1e1e1e] rounded-lg">
        <h3 className="text-xl font-bold mb-2">No Courses Available</h3>
        <p className="text-gray-300 mb-6">Check back later for new courses.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
