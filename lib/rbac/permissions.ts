import type { Permission } from "./types"
import { getPermissionsForRole } from "./roles"

// Helper function to get all permissions for a user with multiple roles
export function getUserPermissions(roleIds: string[]): Permission[] {
  // Get unique permissions from all roles
  const allPermissions = roleIds.flatMap((roleId) => getPermissionsForRole(roleId))
  return [...new Set(allPermissions)]
}

// Helper function to check if a user has a specific permission
export function hasPermission(userRoleIds: string[], permission: Permission): boolean {
  const permissions = getUserPermissions(userRoleIds)
  return permissions.includes(permission)
}

// Helper function to check if a user has all of the specified permissions
export function hasAllPermissions(userRoleIds: string[], requiredPermissions: Permission[]): boolean {
  const permissions = getUserPermissions(userRoleIds)
  return requiredPermissions.every((permission) => permissions.includes(permission))
}

// Helper function to check if a user has any of the specified permissions
export function hasAnyPermission(userRoleIds: string[], requiredPermissions: Permission[]): boolean {
  const permissions = getUserPermissions(userRoleIds)
  return requiredPermissions.some((permission) => permissions.includes(permission))
}
