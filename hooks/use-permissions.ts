"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { Permission } from "@/lib/rbac/types"
import { hasPermission, hasAllPermissions, hasAnyPermission } from "@/lib/rbac/permissions"

export function usePermissions() {
  const { user, userRole } = useAuth()
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserRoles = async () => {
      if (user) {
        try {
          // Import the getUserRoles function
          const { getUserRoles } = await import("@/lib/firebase")
          const roles = await getUserRoles(user.uid)
          setUserRoles(roles)
        } catch (error) {
          console.error("Error loading user roles:", error)
          // Fallback to the legacy role from auth context
          if (userRole) {
            setUserRoles([userRole])
          } else {
            setUserRoles([])
          }
        } finally {
          setLoading(false)
        }
      } else {
        setUserRoles([])
        setLoading(false)
      }
    }

    loadUserRoles()
  }, [user, userRole])

  return {
    loading,
    userRoles,
    can: (permission: Permission) => hasPermission(userRoles, permission),
    canAll: (permissions: Permission[]) => hasAllPermissions(userRoles, permissions),
    canAny: (permissions: Permission[]) => hasAnyPermission(userRoles, permissions),
    isAdmin: () => userRoles.includes("admin"),
    isInstructor: () => userRoles.includes("instructor") || userRoles.includes("admin"),
    isStudent: () => userRoles.includes("student") || userRoles.length === 0, // Default to student if no roles
  }
}
