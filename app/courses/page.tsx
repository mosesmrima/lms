import { Suspense } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CoursesList } from "@/components/courses-list"

export default function CoursesPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Explore Our Courses</h1>
        <p className="text-gray-300 text-sm md:text-base">
          Discover our comprehensive range of cybersecurity courses designed to enhance your skills
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-8 md:py-12">
            <LoadingSpinner />
          </div>
        }
      >
        <CoursesList />
      </Suspense>
    </div>
  )
}
