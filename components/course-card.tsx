import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="bg-[#1e1e1e] border-[#333333] overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video">
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg sm:text-xl font-bold line-clamp-1">{course.title}</h3>
          <Badge
            variant="outline"
            className="bg-[#f90026]/10 text-[#f90026] border-[#f90026]/20 text-xs whitespace-nowrap ml-2"
          >
            {course.level}
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-gray-300">{course.instructor}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-300 text-sm line-clamp-3">{course.description}</p>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Badge variant="secondary" className="bg-[#111111] text-xs">
            {course.duration}
          </Badge>
          <Badge variant="secondary" className="bg-[#111111] text-xs">
            {course.lessons.length} lessons
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-[#f90026] text-white hover:bg-[#f90026] hover:text-white text-sm"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
