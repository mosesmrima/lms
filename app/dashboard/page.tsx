import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnrolledCoursesList } from "@/components/enrolled-courses-list"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"

export default function StudentDashboard() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Student Dashboard</h1>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8">
        <DashboardStats />
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="bg-[#1e1e1e] mb-6 w-full">
          <TabsTrigger value="courses" className="flex-1">
            My Courses
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-1">
            Recent Activity
          </TabsTrigger>
        </TabsList>
        <TabsContent value="courses">
          <EnrolledCoursesList />
        </TabsContent>
        <TabsContent value="activity">
          <RecentActivity />
        </TabsContent>
      </Tabs>
    </div>
  )
}
