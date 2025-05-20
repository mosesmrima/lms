"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardFooter, Button, Divider } from "@heroui/react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { StatsCard } from "@/components/admin/stats-card"
import {
  Users,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Settings,
  UserCog,
  BarChart3,
  FileText,
  Database,
} from "lucide-react"
import Link from "next/link"

export default function AdminClient() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalInstructors: 0,
  })
  const { user, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (userRole !== "admin") {
      router.push("/access-denied")
      return
    }

    // Fetch admin dashboard stats
    const fetchStats = async () => {
      try {
        // In a real implementation, this would fetch from your database
        // For now, we'll use mock data
        setStats({
          totalUsers: 156,
          totalCourses: 24,
          totalEnrollments: 342,
          totalInstructors: 8,
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching admin stats:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [userRole, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const adminFeatures = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: <UserCog className="h-6 w-6 text-[#f90026]" />,
      href: "/admin/users",
    },
    {
      title: "Course Management",
      description: "Manage and moderate courses",
      icon: <BookOpen className="h-6 w-6 text-[#f90026]" />,
      href: "/admin/courses",
      comingSoon: true,
    },
    {
      title: "Analytics",
      description: "View system analytics and reports",
      icon: <BarChart3 className="h-6 w-6 text-[#f90026]" />,
      href: "/admin/analytics",
      comingSoon: true,
    },
    {
      title: "Content Moderation",
      description: "Review and moderate content",
      icon: <FileText className="h-6 w-6 text-[#f90026]" />,
      href: "/admin/moderation",
      comingSoon: true,
    },
    {
      title: "System Settings",
      description: "Configure system settings",
      icon: <Settings className="h-6 w-6 text-[#f90026]" />,
      href: "/admin/settings",
      comingSoon: true,
    },
    {
      title: "Database Management",
      description: "Backup and restore database",
      icon: <Database className="h-6 w-6 text-[#f90026]" />,
      href: "/admin/database",
      comingSoon: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage your learning platform</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            color="primary"
            className="bg-[#f90026] hover:bg-[#d10021]"
            startContent={<ShieldAlert className="h-4 w-4" />}
          >
            System Status: Healthy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6" />}
          trend="+12% this month"
          positive={true}
        />
        <StatsCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={<BookOpen className="h-6 w-6" />}
          trend="+5% this month"
          positive={true}
        />
        <StatsCard
          title="Total Enrollments"
          value={stats.totalEnrollments}
          icon={<GraduationCap className="h-6 w-6" />}
          trend="+18% this month"
          positive={true}
        />
        <StatsCard
          title="Instructors"
          value={stats.totalInstructors}
          icon={<Users className="h-6 w-6" />}
          trend="+2 this month"
          positive={true}
        />
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Admin Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminFeatures.map((feature, index) => (
          <Card key={index} className="bg-[#1a1a1a] border border-[#333] hover:border-[#f90026] transition-all">
            <CardHeader className="flex gap-3">
              <div className="p-2 rounded-full bg-[#111]">{feature.icon}</div>
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-white">{feature.title}</p>
                <p className="text-small text-gray-400">{feature.description}</p>
              </div>
            </CardHeader>
            <Divider className="bg-[#333]" />
            <CardFooter className="justify-end">
              {feature.comingSoon ? (
                <Button disabled variant="flat" className="text-gray-400">
                  Coming Soon
                </Button>
              ) : (
                <Button as={Link} href={feature.href} color="primary" className="bg-[#f90026] hover:bg-[#d10021]">
                  Manage
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Recent System Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#111]">
                <Users className="h-4 w-4 text-[#f90026]" />
              </div>
              <div>
                <p className="text-white">New user registered</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#111]">
                <BookOpen className="h-4 w-4 text-[#f90026]" />
              </div>
              <div>
                <p className="text-white">New course published</p>
                <p className="text-xs text-gray-400">5 hours ago</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#111]">
                <UserCog className="h-4 w-4 text-[#f90026]" />
              </div>
              <div>
                <p className="text-white">User role updated</p>
                <p className="text-xs text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Button variant="flat" className="text-[#f90026]">
            View All Activity
          </Button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            as={Link}
            href="/admin/users"
            variant="flat"
            className="bg-[#111] text-white border border-[#333] hover:border-[#f90026]"
            startContent={<UserCog className="h-4 w-4" />}
          >
            Manage Users
          </Button>
          <Button
            variant="flat"
            className="bg-[#111] text-white border border-[#333] hover:border-[#f90026]"
            startContent={<BookOpen className="h-4 w-4" />}
          >
            Review Courses
          </Button>
          <Button
            variant="flat"
            className="bg-[#111] text-white border border-[#333] hover:border-[#f90026]"
            startContent={<Settings className="h-4 w-4" />}
          >
            System Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
