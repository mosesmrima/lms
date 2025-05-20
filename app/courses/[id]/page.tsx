"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardBody, Tabs, Tab } from "@heroui/react"
import { LessonList } from "@/components/lesson-list"
import { EnrollButton } from "@/components/enroll-button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getCourse, isUserEnrolledInCourse } from "@/lib/firebase"
import { Clock, Users, Calendar, Award, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { Course } from "@/lib/types"

export default function CoursePage({ params }: { params: { id: string } }) {
  const { id } = params
  const { toast } = useToast()
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false)
  const [activeTab, setActiveTab] = useState("curriculum")
  const searchParams = useSearchParams()
  const enrollmentRequired = searchParams.get("enrollmentRequired") === "true"

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setIsLoading(true)
        const courseData = await getCourse(id)
        setCourse(courseData)
      } catch (error) {
        console.error("Error loading course:", error)
        toast({
          title: "Error",
          description: "Failed to load the course. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCourse()
  }, [id, toast])

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !course) return

      try {
        setIsCheckingEnrollment(true)
        const enrolled = await isUserEnrolledInCourse(user.uid, id)
        setIsEnrolled(enrolled)
      } catch (error) {
        console.error("Error checking enrollment:", error)
      } finally {
        setIsCheckingEnrollment(false)
      }
    }

    checkEnrollment()
  }, [user, course, id])

  useEffect(() => {
    if (enrollmentRequired) {
      toast({
        title: "Enrollment Required",
        description: "You need to enroll in this course to access its content.",
        variant: "destructive",
      })
    }
  }, [enrollmentRequired, toast])

  if (isLoading) {
    return (
      <div className="container px-4 py-8 md:py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container px-4 py-8 md:py-12">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="text-gray-300 mb-6">The course you are looking for does not exist.</p>
          <Link href="/courses">
            <Button className="bg-[#f90026] hover:bg-[#d10021]">Browse Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Define tab items array
  const tabItems = [
    {
      id: "curriculum",
      label: "Curriculum",
      content: (
        <Card>
          <CardBody>
            <h2 className="text-lg md:text-xl font-bold mb-4">Course Content</h2>
            <LessonList courseId={id} lessons={course.lessons} isEnrolled={isEnrolled} />
          </CardBody>
        </Card>
      ),
    },
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="space-y-6">
          <Card>
            <CardBody>
              <h2 className="text-lg md:text-xl font-bold mb-4">About This Course</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 text-sm md:text-base">{course.longDescription || course.description}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-lg md:text-xl font-bold mb-4">What You'll Learn</h2>
              <ul className="space-y-2">
                {course.learningOutcomes?.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-[#f90026]">•</span>
                    <span className="text-gray-300 text-sm md:text-base">{outcome}</span>
                  </li>
                )) || (
                  <li className="text-gray-300 text-sm md:text-base">
                    Comprehensive understanding of the course material.
                  </li>
                )}
              </ul>
            </CardBody>
          </Card>

          {course.instructor && (
            <Card>
              <CardBody>
                <h2 className="text-lg md:text-xl font-bold mb-4">Your Instructor</h2>
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={
                        course.instructor.avatarUrl ||
                        "/placeholder.svg?height=100&width=100&query=instructor%20avatar" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={course.instructor.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg">{course.instructor.name}</h3>
                    <p className="text-gray-400 text-xs md:text-sm">{course.instructor.title}</p>
                    <p className="text-gray-300 mt-2 text-sm md:text-base">{course.instructor.bio}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="container px-4 py-6 md:py-12">
      <div className="mb-4 md:mb-6">
        <Link href="/courses" className="inline-flex items-center text-gray-300 hover:text-[#f90026]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to courses
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">{course.title}</h1>
            <p className="text-gray-300 text-sm md:text-base">{course.description}</p>
          </div>

          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <img
              src={course.imageUrl || "/placeholder.svg?height=400&width=800&query=cybersecurity%20course"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full">
            <Tabs
              aria-label="Course tabs"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              className="w-full"
              items={tabItems}
            >
              {(item) => (
                <Tab key={item.id} title={item.label}>
                  {item.content}
                </Tab>
              )}
            </Tabs>
          </div>
        </div>

        <div className="space-y-6 order-first lg:order-last">
          <Card className="sticky top-4">
            <CardBody className="space-y-6">
              <div>
                <div className="text-2xl md:text-3xl font-bold mb-2">
                  {course.price ? `$${course.price.toFixed(2)}` : "Free"}
                </div>
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center text-gray-300 text-xs md:text-sm">
                    <Clock className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                    {course.duration || "Self-paced"}
                  </div>
                  <div className="flex items-center text-gray-300 text-xs md:text-sm">
                    <Users className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                    {course.enrollmentCount || 0} students
                  </div>
                  <div className="flex items-center text-gray-300 text-xs md:text-sm">
                    <Calendar className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                    Last updated {course.updatedAt?.toDate().toLocaleDateString() || "Recently"}
                  </div>
                  <div className="flex items-center text-gray-300 text-xs md:text-sm">
                    <Award className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                    {course.level || "All levels"}
                  </div>
                </div>
              </div>

              <EnrollButton
                courseId={id}
                isEnrolled={isEnrolled}
                isCheckingEnrollment={isCheckingEnrollment}
                className="w-full"
              />

              <div className="space-y-3">
                <h3 className="font-medium text-sm md:text-base">This course includes:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 text-[#f90026]">•</span>
                    <span className="text-gray-300 text-sm md:text-base">{course.lessons.length} lessons</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#f90026]">•</span>
                    <span className="text-gray-300 text-sm md:text-base">Lifetime access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#f90026]">•</span>
                    <span className="text-gray-300 text-sm md:text-base">Certificate of completion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#f90026]">•</span>
                    <span className="text-gray-300 text-sm md:text-base">Downloadable resources</span>
                  </li>
                </ul>
              </div>

              {course.tags && course.tags.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 text-sm md:text-base">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-[#111111] text-gray-300 rounded-md text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
