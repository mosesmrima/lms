"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, Input, Textarea, Checkbox } from "@heroui/react"
import { useRouter } from "next/navigation"
import { PlusCircle, Trash, LayoutList } from "lucide-react"
import { LessonForm, type LessonFormValues } from "@/components/lesson-form"
import type { Lesson } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { createCourse, updateCourse, getCourse, createLesson, updateLesson, deleteLesson } from "@/lib/firebase"

const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration: z.string().min(1, { message: "Duration is required" }),
  image: z.string().url({ message: "Please enter a valid URL" }),
  certificate: z.boolean().default(true),
})

type CourseFormValues = z.infer<typeof courseSchema>

interface CourseFormProps {
  courseId?: string
}

export function CourseForm({ courseId }: CourseFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(!!courseId)
  const [activeTab, setActiveTab] = useState("details")
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [certificate, setCertificate] = useState(true)
  const [level, setLevel] = useState("Beginner")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "Beginner",
      duration: "",
      image: "https://placeholder.svg?height=400&width=600&query=cybersecurity course",
      certificate: true,
    },
  })

  // Load existing course data if courseId is provided
  useEffect(() => {
    if (courseId) {
      const loadCourseData = async () => {
        try {
          setIsLoading(true)
          const courseData = await getCourse(courseId)

          if (courseData) {
            reset({
              title: courseData.title,
              description: courseData.description,
              level: courseData.level as "Beginner" | "Intermediate" | "Advanced",
              duration: courseData.duration,
              image: courseData.image,
              certificate: courseData.certificate,
            })

            setLevel(courseData.level)
            setCertificate(courseData.certificate)
            setLessons(courseData.lessons || [])
          }
        } catch (error) {
          console.error("Error loading course:", error)
          toast({
            title: "Error",
            description: "Failed to load course data. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      loadCourseData()
    }
  }, [courseId, reset, toast])

  async function onSubmit(data: CourseFormValues) {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to create or edit courses.",
        variant: "destructive",
      })
      return
    }

    if (lessons.length === 0) {
      toast({
        title: "Lessons Required",
        description: "You must add at least one lesson to your course.",
        variant: "destructive",
      })
      setActiveTab("lessons")
      return
    }

    setIsSubmitting(true)

    try {
      if (courseId) {
        // Update existing course
        await updateCourse(courseId, {
          ...data,
          lessons,
        })

        toast({
          title: "Success",
          description: "Course updated successfully!",
        })
      } else {
        // Create new course
        const newCourseId = await createCourse(user.uid, {
          ...data,
          students: 0,
          lessons: [],
        })

        // Create lessons for the course
        for (const lesson of lessons) {
          await createLesson(newCourseId, {
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration,
            videoUrl: lesson.videoUrl,
            attachments: lesson.attachments || [],
          })
        }

        toast({
          title: "Success",
          description: "Course created successfully!",
        })
      }

      router.push("/instructor")
    } catch (error) {
      console.error("Error saving course:", error)
      toast({
        title: "Error",
        description: "Failed to save course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddLesson = () => {
    setEditingLesson(null)
    setShowLessonForm(true)
  }

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setShowLessonForm(true)
  }

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      if (courseId && !lessonId.startsWith("lesson-")) {
        // Delete from Firestore if this is an existing lesson
        await deleteLesson(lessonId)
      }

      // Update local state
      setLessons(lessons.filter((lesson) => lesson.id !== lessonId))

      toast({
        title: "Success",
        description: "Lesson deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting lesson:", error)
      toast({
        title: "Error",
        description: "Failed to delete lesson. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLessonSubmit = async (data: LessonFormValues) => {
    try {
      if (editingLesson) {
        // Update existing lesson
        if (courseId && !editingLesson.id.startsWith("lesson-")) {
          // Update in Firestore if this is an existing lesson
          await updateLesson(editingLesson.id, data)
        }

        // Update local state
        setLessons(lessons.map((lesson) => (lesson.id === editingLesson.id ? { ...data, id: lesson.id } : lesson)))
      } else {
        // Add new lesson
        let newLessonId = `lesson-${Date.now()}`

        if (courseId) {
          // Create in Firestore if we have a course ID
          newLessonId = await createLesson(courseId, data)
        }

        // Add to local state
        setLessons([...lessons, { ...data, id: newLessonId }])
      }

      setShowLessonForm(false)
      setEditingLesson(null)

      toast({
        title: "Success",
        description: editingLesson ? "Lesson updated successfully." : "Lesson added successfully.",
      })
    } catch (error) {
      console.error("Error saving lesson:", error)
      toast({
        title: "Error",
        description: "Failed to save lesson. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLessonCancel = () => {
    setShowLessonForm(false)
    setEditingLesson(null)
  }

  const handleCertificateChange = (isSelected: boolean) => {
    setCertificate(isSelected)
    setValue("certificate", isSelected)
  }

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value)
    setValue("level", e.target.value as "Beginner" | "Intermediate" | "Advanced")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex border-b border-[#333333] mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "details" ? "border-b-2 border-primary text-primary" : "text-gray-300"
          }`}
          onClick={() => setActiveTab("details")}
        >
          Course Details
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "lessons" ? "border-b-2 border-primary text-primary" : "text-gray-300"
          }`}
          onClick={() => setActiveTab("lessons")}
        >
          Lessons ({lessons.length})
        </button>
      </div>

      {activeTab === "details" && (
        <div className="space-y-6">
          <form id="course-details-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Course Title
              </label>
              <Input
                id="title"
                placeholder="Enter course title"
                variant="bordered"
                {...register("title")}
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
                className="bg-background border-[#333333]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Enter course description"
                variant="bordered"
                {...register("description")}
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
                className="bg-background border-[#333333] min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="level" className="block text-sm font-medium">
                  Level
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={handleLevelChange}
                  className="w-full rounded-md border border-[#333333] bg-background px-3 py-2 text-sm"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className="block text-sm font-medium">
                  Duration
                </label>
                <Input
                  id="duration"
                  placeholder="e.g. 4 weeks"
                  variant="bordered"
                  {...register("duration")}
                  isInvalid={!!errors.duration}
                  errorMessage={errors.duration?.message}
                  className="bg-background border-[#333333]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium">
                Cover Image URL
              </label>
              <Input
                id="image"
                placeholder="Enter image URL"
                variant="bordered"
                {...register("image")}
                isInvalid={!!errors.image}
                errorMessage={errors.image?.message}
                className="bg-background border-[#333333]"
              />
              <p className="text-gray-400 text-xs">Enter a URL for the course cover image</p>
            </div>

            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#333333] p-4">
              <Checkbox isSelected={certificate} onValueChange={handleCertificateChange} color="primary">
                <div className="space-y-1 leading-none">
                  <p className="font-medium">Offer Certificate</p>
                  <p className="text-gray-400 text-xs">Students will receive a certificate upon course completion</p>
                </div>
              </Checkbox>
              <input type="hidden" {...register("certificate")} value={certificate ? "true" : "false"} />
            </div>
          </form>
        </div>
      )}

      {activeTab === "lessons" && (
        <div className="space-y-6">
          {showLessonForm ? (
            <div className="bg-[#1e1e1e] border border-[#333333] rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">{editingLesson ? "Edit Lesson" : "Add New Lesson"}</h3>
              <LessonForm
                onSubmit={handleLessonSubmit}
                onCancel={handleLessonCancel}
                defaultValues={editingLesson || undefined}
              />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Course Lessons</h3>
                <Button
                  onClick={handleAddLesson}
                  color="primary"
                  startContent={<PlusCircle className="h-4 w-4" />}
                  className="bg-primary hover:bg-[#d10021]"
                >
                  Add Lesson
                </Button>
              </div>

              {lessons.length === 0 ? (
                <div className="text-center py-12 bg-[#1e1e1e] rounded-lg border border-[#333333]">
                  <LayoutList className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-bold mb-2">No Lessons Added</h3>
                  <p className="text-gray-300 mb-6">Add your first lesson to get started</p>
                  <Button
                    onClick={handleAddLesson}
                    color="primary"
                    startContent={<PlusCircle className="h-4 w-4" />}
                    className="bg-primary hover:bg-[#d10021]"
                  >
                    Add Your First Lesson
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="bg-[#1e1e1e] p-6 rounded-lg border border-[#333333]">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-background text-sm mt-1">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{lesson.title}</h4>
                            <p className="text-gray-400 text-sm mb-2">{lesson.duration}</p>
                            <p className="text-gray-300 line-clamp-2">{lesson.description}</p>
                            {lesson.videoUrl && (
                              <div className="mt-2">
                                <span className="text-xs bg-background px-2 py-1 rounded-full">
                                  Video: {getVideoType(lesson.videoUrl)}
                                </span>
                              </div>
                            )}
                            {lesson.attachments && lesson.attachments.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs bg-background px-2 py-1 rounded-full">
                                  {lesson.attachments.length} attachments
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditLesson(lesson)}
                            variant="bordered"
                            size="sm"
                            className="h-8 border-[#333333] hover:bg-background"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            variant="light"
                            size="sm"
                            className="h-8 text-red-500 hover:text-red-400"
                            startContent={<Trash className="h-4 w-4" />}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!showLessonForm && (
        <div className="flex justify-end mt-6">
          <Button
            form="course-details-form"
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            className="bg-primary hover:bg-[#d10021]"
          >
            {isSubmitting ? "Saving..." : courseId ? "Update Course" : "Create Course"}
          </Button>
        </div>
      )}
    </div>
  )
}

// Helper function to identify video type
function getVideoType(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "YouTube"
  } else if (url.includes("drive.google.com")) {
    return "Google Drive"
  } else {
    return "External"
  }
}
