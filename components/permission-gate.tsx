"use client"

import type { ReactNode } from "react"
import { useAuthClaims, type Permission } from "@/hooks/use-auth-claims"
import { LoadingSpinner } from "@/components/loading-spinner"

interface PermissionGateProps {
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGate({
  permission,
  permissions = [],
  requireAll = false,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { loading, hasPermission, hasAllPermissions, hasAnyPermission } = useAuthClaims()

  if (loading) {
    return <LoadingSpinner size="sm" />
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasPermissions = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions)

    if (!hasPermissions) {
      return <>{fallback}</>
    }
  }

  // User has the required permissions
  return <>{children}</>
}
