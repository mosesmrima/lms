"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { getUserRecentActivity } from "@/lib/firebase"
import { LoadingSpinner } from "@/components/loading-spinner"
import { BookOpen, Calendar, FileText } from "lucide-react"
import Link from "next/link"

type Activity = {
  id: string
  type: "note" | "enrollment" | "progress"
  timestamp: Date
  courseId?: string
  courseTitle?: string
  lessonId?: string
  lessonTitle?: string
  content?: string
}

export function RecentActivity() {
  const { user, loading: authLoading } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Skip if auth is still loading or we've already loaded activities
    if (authLoading || hasLoaded) return

    // Only fetch activities if we have a user and haven't loaded yet
    if (user && !hasLoaded) {
      const fetchActivities = async () => {
        try {
          setIsLoading(true)
          const recentActivities = await getUserRecentActivity(user.uid, 10)
          setActivities(recentActivities)
          setHasLoaded(true)
        } catch (error) {
          console.error("Error fetching recent activities:", error)
          setActivities([])
          setHasLoaded(true)
        } finally {
          setIsLoading(false)
        }
      }

      fetchActivities()
    }
  }, [user, authLoading, hasLoaded])

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">No recent activity</h3>
        <p className="text-gray-400 text-sm sm:text-base">
          Your learning activities will appear here as you use the platform.
        </p>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return "Today"
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="bg-[#1e1e1e] border-[#333333]">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="bg-[#f90026]/10 p-2 rounded-full mt-1 flex-shrink-0">
                {activity.type === "note" && <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#f90026]" />}
                {activity.type === "enrollment" && <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#f90026]" />}
                {activity.type === "progress" && <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#f90026]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div className="pr-2">
                    {activity.type === "note" && <p className="font-medium text-sm sm:text-base">Added a note</p>}
                    {activity.type === "enrollment" && (
                      <p className="font-medium text-sm sm:text-base">Enrolled in a course</p>
                    )}
                    {activity.type === "progress" && (
                      <p className="font-medium text-sm sm:text-base">Completed a lesson</p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-1">
                      {activity.type === "note" && activity.courseTitle && (
                        <Link href={`/courses/${activity.courseId}`} className="hover:underline">
                          {activity.courseTitle}
                        </Link>
                      )}
                      {activity.type === "enrollment" && activity.courseTitle && (
                        <Link href={`/courses/${activity.courseId}`} className="hover:underline">
                          {activity.courseTitle}
                        </Link>
                      )}
                      {activity.type === "progress" && activity.lessonTitle && (
                        <Link
                          href={`/courses/${activity.courseId}/lesson/${activity.lessonId}`}
                          className="hover:underline"
                        >
                          {activity.lessonTitle}
                        </Link>
                      )}
                    </p>
                    {activity.type === "note" && activity.content && (
                      <p className="text-xs sm:text-sm text-gray-400 mt-2 line-clamp-2">{activity.content}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{formatDate(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
