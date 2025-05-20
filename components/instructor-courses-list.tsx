"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getInstructorCourses, deleteCourse } from "@/lib/firebase"
import type { Course } from "@/lib/types"

export function InstructorCoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const instructorCourses = await getInstructorCourses(user.uid)
        setCourses(instructorCourses)
      } catch (error) {
        console.error("Error fetching instructor courses:", error)
        toast({
          title: "Error",
          description: "Failed to load your courses. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [user, toast])

  const handleDeleteCourse = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse(courseToDelete)
        setCourses(courses.filter((course) => course.id !== courseToDelete))
        toast({
          title: "Course deleted",
          description: "The course has been successfully deleted.",
        })
      } catch (error) {
        console.error("Error deleting course:", error)
        toast({
          title: "Error",
          description: "Failed to delete the course. Please try again.",
          variant: "destructive",
        })
      } finally {
        setCourseToDelete(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1e1e1e] rounded-lg">
        <h3 className="text-xl font-bold mb-2">No Courses Created</h3>
        <p className="text-gray-300 mb-6">You haven't created any courses yet.</p>
        <Link href="/instructor/create">
          <Button className="bg-[#f90026] hover:bg-[#d10021]">Create Your First Course</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="bg-[#1e1e1e] border-[#333333] overflow-hidden flex flex-col">
            <div className="relative aspect-video">
              <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{course.title}</h3>
                <Badge variant="outline" className="bg-[#f90026]/10 text-[#f90026] border-[#f90026]/20">
                  {course.level}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Users className="h-4 w-4" />
                <span>{course.students} students</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-300 line-clamp-3">{course.description}</p>
              <div className="flex items-center gap-2 mt-4">
                <Badge variant="secondary" className="bg-[#111111]">
                  {course.lessons.length} lessons
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-[#333333] hover:bg-[#111111] hover:text-white"
                onClick={() => setCourseToDelete(course.id)}
              >
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
              <Link href={`/instructor/edit/${course.id}`} className="flex-1">
                <Button className="w-full bg-[#f90026] hover:bg-[#d10021]">
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <AlertDialogContent className="bg-[#1e1e1e] border-[#333333]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete the course and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#333333] text-white hover:bg-[#111111] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
