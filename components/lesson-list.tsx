"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AttachmentList } from "@/components/attachment-list"
import { useAuth } from "@/contexts/auth-context"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Clock, Play, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Lesson } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LessonListProps {
  courseId: string
  lessons: Lesson[]
  isEnrolled?: boolean
}

export function LessonList({ courseId, lessons, isEnrolled = false }: LessonListProps) {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)
  const { user } = useAuth()
  const { courseProgress, markLessonComplete, fetchCourseProgress } = useStore()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // If user is logged in and enrolled, fetch their progress
    if (user && isEnrolled) {
      fetchCourseProgress(user.uid, courseId).catch(console.error)
    }
  }, [user, isEnrolled, courseId, fetchCourseProgress])

  const handleToggleComplete = async (lessonId: string, completed: boolean) => {
    if (!user) return

    try {
      await markLessonComplete(user.uid, courseId, lessonId, completed)
      toast({
        title: completed ? "Lesson completed" : "Lesson marked as incomplete",
        description: completed ? "Your progress has been updated." : "The lesson has been marked as incomplete.",
      })
    } catch (error) {
      console.error("Error updating lesson progress:", error)
      toast({
        title: "Error",
        description: "Failed to update your progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStartLesson = (lessonId: string, e: React.MouseEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this lesson.",
        variant: "destructive",
      })
      router.push(`/signin?callbackUrl=/courses/${courseId}/lesson/${lessonId}`)
      return
    }

    if (!isEnrolled) {
      toast({
        title: "Enrollment Required",
        description: "Please enroll in this course to access lessons.",
        variant: "destructive",
      })
      return
    }

    router.push(`/courses/${courseId}/lesson/${lessonId}`)
  }

  if (lessons.length === 0) {
    return <p className="text-gray-300">No lessons available for this course yet.</p>
  }

  return (
    <Accordion
      type="single"
      collapsible
      value={expandedLesson || undefined}
      onValueChange={(value) => setExpandedLesson(value)}
      className="space-y-3 md:space-y-4 w-full"
    >
      {lessons.map((lesson, index) => {
        const isCompleted = courseProgress[courseId]?.[lesson.id]?.completed || false

        return (
          <AccordionItem
            key={lesson.id}
            value={lesson.id}
            className="border border-[#333333] rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-3 py-3 hover:bg-[#111111] hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#111111] text-xs sm:text-sm">
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-sm sm:text-base line-clamp-1">{lesson.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-2">
                  <div className="flex items-center text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {lesson.duration}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-3 bg-[#111111]">
              <div className="space-y-3 md:space-y-4">
                <p className="text-gray-300 text-xs sm:text-sm">{lesson.description}</p>

                {lesson.attachments && lesson.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-medium">Attachments</h4>
                    <AttachmentList
                      attachments={lesson.attachments}
                      courseId={courseId}
                      className="text-xs sm:text-sm"
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-3">
                  <div className="flex items-center space-x-2">
                    {user && isEnrolled && (
                      <Checkbox
                        id={`complete-${lesson.id}`}
                        checked={isCompleted}
                        onCheckedChange={(checked) => handleToggleComplete(lesson.id, checked === true)}
                        className="h-4 w-4"
                      />
                    )}
                    {user && isEnrolled && (
                      <label
                        htmlFor={`complete-${lesson.id}`}
                        className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Mark as completed
                      </label>
                    )}
                  </div>

                  <TooltipProvider>
                    {isEnrolled && user ? (
                      <Link href={`/courses/${courseId}/lesson/${lesson.id}`} className="w-full sm:w-auto">
                        <Button className="bg-[#f90026] hover:bg-[#d10021] w-full sm:w-auto text-xs sm:text-sm">
                          <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Start Lesson
                        </Button>
                      </Link>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="bg-gray-700 hover:bg-gray-600 w-full sm:w-auto text-xs sm:text-sm cursor-not-allowed"
                            onClick={(e) => handleStartLesson(lesson.id, e)}
                          >
                            <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            {!user ? "Sign in to Access" : "Enroll to Access"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {!user
                              ? "Please sign in to access this lesson"
                              : "You need to enroll in this course to access lessons"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
