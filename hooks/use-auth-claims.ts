"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

// Define permission types
export type Permission =
  | "courses:view"
  | "courses:create"
  | "courses:edit"
  | "courses:delete"
  | "lessons:view"
  | "lessons:create"
  | "lessons:edit"
  | "lessons:delete"
  | "users:view"
  | "users:edit"
  | "users:delete"
  | "roles:manage"
  | "admin:access"

// Define role-permission mappings
const rolePermissions: Record<string, Permission[]> = {
  student: ["courses:view", "lessons:view"],
  instructor: [
    "courses:view",
    "courses:create",
    "courses:edit",
    "lessons:view",
    "lessons:create",
    "lessons:edit",
    "lessons:delete",
  ],
  admin: [
    "courses:view",
    "courses:create",
    "courses:edit",
    "courses:delete",
    "lessons:view",
    "lessons:create",
    "lessons:edit",
    "lessons:delete",
    "users:view",
    "users:edit",
    "users:delete",
    "roles:manage",
    "admin:access",
  ],
}

export function useAuthClaims() {
  const { user, userRoles, isLoading } = useAuth()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      // Combine permissions from all roles
      const allPermissions = userRoles.flatMap((role) => rolePermissions[role] || [])

      // Remove duplicates
      setPermissions([...new Set(allPermissions)])
      setLoading(false)
    }
  }, [userRoles, isLoading])

  const hasPermission = (permission: Permission) => {
    return permissions.includes(permission)
  }

  const hasAllPermissions = (requiredPermissions: Permission[]) => {
    return requiredPermissions.every((permission) => permissions.includes(permission))
  }

  const hasAnyPermission = (requiredPermissions: Permission[]) => {
    return requiredPermissions.some((permission) => permissions.includes(permission))
  }

  return {
    loading: isLoading || loading,
    permissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    isAdmin: userRoles.includes("admin"),
    isInstructor: userRoles.includes("instructor") || userRoles.includes("admin"),
    isStudent: userRoles.includes("student") || userRoles.length === 0,
  }
}
