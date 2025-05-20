"use client"
import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VideoPlayer } from "@/components/video-player"
import { AttachmentList } from "@/components/attachment-list"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getCourse, updateLessonProgress, isUserEnrolledInCourse } from "@/lib/firebase"
import type { Course, Lesson } from "@/lib/types"

export default function LessonPage({ params }: { params: { id: string; lessonId: string } }) {
  const { id: courseId, lessonId } = params
  const { toast } = useToast()
  const router = useRouter()
  const { courseProgress, fetchCourseProgress } = useStore()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [course, setCourse] = useState<Course | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const [currentVideoTime, setCurrentVideoTime] = useState(0)

  useEffect(() => {
    const checkAuthAndEnrollment = async () => {
      // If no user, redirect to sign in
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this lesson.",
          variant: "destructive",
        })
        router.push(`/signin?callbackUrl=/courses/${courseId}/lesson/${lessonId}`)
        return
      }

      try {
        setIsCheckingEnrollment(true)
        // Check if user is enrolled in this course
        const enrolled = await isUserEnrolledInCourse(user.uid, courseId)
        setIsEnrolled(enrolled)

        if (!enrolled) {
          toast({
            title: "Enrollment Required",
            description: "You need to enroll in this course to access lessons.",
            variant: "destructive",
          })
          router.push(`/courses/${courseId}?enrollmentRequired=true`)
          return
        }
      } catch (error) {
        console.error("Error checking enrollment:", error)
      } finally {
        setIsCheckingEnrollment(false)
      }
    }

    checkAuthAndEnrollment()
  }, [user, courseId, lessonId, router, toast])

  useEffect(() => {
    const loadCourseAndLesson = async () => {
      try {
        setIsLoading(true)

        // Fetch the course data
        const courseData = await getCourse(courseId)
        setCourse(courseData)

        // Find the specific lesson
        const lessonData = courseData?.lessons.find((l) => l.id === lessonId) || null
        setLesson(lessonData)

        // If user is logged in, fetch their progress for this course
        if (user) {
          await fetchCourseProgress(user.uid, courseId)
        }
      } catch (error) {
        console.error("Error loading lesson:", error)
        toast({
          title: "Error",
          description: "Failed to load the lesson. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (!isCheckingEnrollment && isEnrolled) {
      loadCourseAndLesson()
    }
  }, [courseId, lessonId, user, fetchCourseProgress, toast, isCheckingEnrollment, isEnrolled])

  // Check if the lesson is already completed
  const isCompleted = courseProgress[courseId]?.[lessonId]?.completed || false

  const handleMarkComplete = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to track your progress.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsMarkingComplete(true)

      // Update progress in Firebase
      await updateLessonProgress(user.uid, courseId, lessonId, true)

      // Update local state
      await fetchCourseProgress(user.uid, courseId)

      toast({
        title: "Lesson Completed",
        description: "Your progress has been saved.",
      })
    } catch (error) {
      console.error("Error marking lesson as complete:", error)
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMarkingComplete(false)
    }
  }

  const handleVideoTimeUpdate = (time: number) => {
    setCurrentVideoTime(time)
  }

  if (isCheckingEnrollment) {
    return (
      <div className="container px-4 py-8 md:py-12 flex justify-center">
        <LoadingSpinner />
        <p className="ml-2">Verifying access...</p>
      </div>
    )
  }

  if (!isEnrolled) {
    return (
      <div className="container px-4 py-8 md:py-12">
        <div className="text-center">
          <Lock className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-[#f90026]" />
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Enrollment Required</h1>
          <p className="text-gray-300 mb-6">You need to enroll in this course to access its lessons.</p>
          <Link href={`/courses/${courseId}`}>
            <Button className="bg-[#f90026] hover:bg-[#d10021]">Go to Course Page</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8 md:py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!course || !lesson) {
    return (
      <div className="container px-4 py-8 md:py-12">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Lesson Not Found</h1>
          <p className="text-gray-300 mb-6">The lesson you are looking for does not exist.</p>
          <Link href={`/courses`}>
            <Button className="bg-[#f90026] hover:bg-[#d10021]">Browse Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get lesson index for navigation
  const currentIndex = course.lessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null

  return (
    <div className="container px-4 py-6 md:py-12">
      <div className="mb-4 md:mb-6">
        <Link href={`/courses/${courseId}`} className="inline-flex items-center text-gray-300 hover:text-[#f90026]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to course
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-2">{lesson.title}</h1>
            <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
              {course.title} • {lesson.duration}
            </p>
          </div>

          {/* Enhanced Video Player */}
          <div className="w-full overflow-hidden">
            <VideoPlayer
              url={lesson.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
              title={lesson.title}
              timestamps={lesson.timestamps || []}
              courseId={courseId}
              lessonId={lessonId}
              onTimeUpdate={handleVideoTimeUpdate}
            />
          </div>

          <Card className="bg-[#1e1e1e] p-4 md:p-6 border-[#333333]">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Lesson Content</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-sm md:text-base">{lesson.description}</p>
            </div>
          </Card>

          {/* Attachments Section */}
          <AttachmentList
            attachments={lesson.attachments || []}
            courseId={params.id}
            className="bg-[#1e1e1e] p-4 md:p-6 rounded-lg border border-[#333333]"
          />

          <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mt-6 md:mt-8">
            {prevLesson ? (
              <Link href={`/courses/${courseId}/lesson/${prevLesson.id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-[#333333] hover:bg-[#111111] hover:text-white text-sm"
                >
                  Previous Lesson
                </Button>
              </Link>
            ) : (
              <div className="flex-1 hidden sm:block"></div>
            )}

            <Button
              className={`
                ${isCompleted ? "bg-green-600 hover:bg-green-700" : "bg-[#f90026] hover:bg-[#d10021]"}
                w-full sm:min-w-[200px] sm:w-auto text-sm
              `}
              onClick={handleMarkComplete}
              disabled={isCompleted || isMarkingComplete}
              isLoading={isMarkingComplete}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>

            {nextLesson ? (
              <Link href={`/courses/${courseId}/lesson/${nextLesson.id}`} className="flex-1">
                <Button className="w-full bg-[#f90026] hover:bg-[#d10021] text-sm">Next Lesson</Button>
              </Link>
            ) : (
              <div className="flex-1 hidden sm:block"></div>
            )}
          </div>
        </div>

        <div className="space-y-6 order-first lg:order-last">
          <Card className="bg-[#1e1e1e] p-4 md:p-6 border-[#333333]">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Course Content</h2>
            <nav className="space-y-2">
              {course.lessons.map((l, index) => {
                const isCurrentLesson = l.id === lessonId
                const isLessonCompleted = courseProgress[courseId]?.[l.id]?.completed || false

                return (
                  <Link key={l.id} href={`/courses/${courseId}/lesson/${l.id}`}>
                    <div
                      className={`p-2 md:p-3 rounded-md flex items-center gap-2 ${
                        isCurrentLesson
                          ? "bg-[#f90026] text-white"
                          : isLessonCompleted
                            ? "bg-[#111111] border border-green-600/50"
                            : "bg-[#111111] hover:bg-[#2e2e2e]"
                      }`}
                    >
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#2e2e2e] text-xs md:text-sm">
                        {isLessonCompleted ? (
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-xs md:text-sm">{l.title}</div>
                        <p className="text-xs text-gray-400">{l.duration}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </nav>
          </Card>
        </div>
      </div>
    </div>
  )
}
