"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { VideoPlayer } from "@/components/video-player"
import { TimestampEditor } from "@/components/timestamp-editor"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getCourse, updateLesson } from "@/lib/firebase"
import type { Course, Lesson, Timestamp } from "@/lib/types"

export default function EditLessonPage({ params }: { params: { id: string; lessonId: string } }) {
  const { id: courseId, lessonId } = params
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [course, setCourse] = useState<Course | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [duration, setDuration] = useState("")
  const [timestamps, setTimestamps] = useState<Timestamp[]>([])
  const [currentVideoTime, setCurrentVideoTime] = useState(0)

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

        if (lessonData) {
          setTitle(lessonData.title)
          setDescription(lessonData.description)
          setVideoUrl(lessonData.videoUrl)
          setDuration(lessonData.duration)
          setTimestamps(lessonData.timestamps || [])
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

    loadCourseAndLesson()
  }, [courseId, lessonId, toast])

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to edit lessons.",
        variant: "destructive",
      })
      return
    }

    if (!title || !description || !videoUrl || !duration) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const updatedLesson: Partial<Lesson> = {
        title,
        description,
        videoUrl,
        duration,
        timestamps,
        updatedAt: new Date(),
      }

      await updateLesson(courseId, lessonId, updatedLesson)

      toast({
        title: "Lesson Updated",
        description: "Your changes have been saved successfully.",
      })

      // Navigate back to course edit page
      router.push(`/instructor/edit/${courseId}`)
    } catch (error) {
      console.error("Error updating lesson:", error)
      toast({
        title: "Error",
        description: "Failed to update the lesson. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleVideoTimeUpdate = (time: number) => {
    setCurrentVideoTime(time)
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16 flex justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!course || !lesson) {
    return (
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Lesson Not Found</h1>
          <p className="text-gray-300 mb-6">The lesson you are trying to edit does not exist.</p>
          <Link href={`/instructor`}>
            <Button className="bg-[#f90026] hover:bg-[#d10021]">Back to Instructor Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-6">
        <Link
          href={`/instructor/edit/${courseId}`}
          className="inline-flex items-center text-gray-300 hover:text-[#f90026]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to course editor
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Lesson</h1>
        <Button onClick={handleSave} className="bg-[#f90026] hover:bg-[#d10021]" disabled={isSaving}>
          {isSaving ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="bg-[#1e1e1e] p-6 border-[#333333]">
            <h2 className="text-xl font-bold mb-4">Lesson Details</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Lesson Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter lesson title"
                  className="bg-[#252525] border-[#333333]"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter lesson description"
                  className="bg-[#252525] border-[#333333] min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium mb-1">
                    Duration
                  </label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 45 min"
                    className="bg-[#252525] border-[#333333]"
                  />
                </div>

                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-medium mb-1">
                    Video URL
                  </label>
                  <Input
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="YouTube or Google Drive URL"
                    className="bg-[#252525] border-[#333333]"
                  />
                </div>
              </div>
            </div>
          </Card>

          <TimestampEditor timestamps={timestamps} onChange={setTimestamps} currentTime={currentVideoTime} />
        </div>

        <div className="space-y-6">
          <Card className="bg-[#1e1e1e] p-6 border-[#333333]">
            <h2 className="text-xl font-bold mb-4">Video Preview</h2>
            <VideoPlayer url={videoUrl} title={title} timestamps={timestamps} onTimeUpdate={handleVideoTimeUpdate} />
            <p className="text-sm text-gray-400 mt-4">
              Preview how your video will appear to students. Add timestamps below to help students navigate the
              content.
            </p>
          </Card>

          <Card className="bg-[#1e1e1e] p-6 border-[#333333]">
            <h2 className="text-xl font-bold mb-4">Instructions</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                <strong>Video URL:</strong> Enter a YouTube or Google Drive video URL.
              </p>
              <p>
                <strong>Timestamps:</strong> Add timestamps to help students navigate to important parts of the video.
              </p>
              <p>
                <strong>Adding Timestamps:</strong> Click "Add Timestamp" and fill in the details. You can use the
                current video time by clicking the clock icon.
              </p>
              <p>
                <strong>Note:</strong> Timestamp navigation works best with YouTube videos. Google Drive videos will
                display timestamps but cannot automatically jump to specific times.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
