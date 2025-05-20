import type { Permission, Role } from "./types"

// Define default roles with their permissions
export const DEFAULT_ROLES: Role[] = [
  {
    id: "student",
    name: "Student",
    description: "Regular user with access to enrolled courses",
    permissions: ["courses:read", "courses:enroll", "lessons:read"],
  },
  {
    id: "instructor",
    name: "Instructor",
    description: "Can create and manage courses",
    permissions: [
      "courses:create",
      "courses:read",
      "courses:update",
      "courses:enroll",
      "lessons:create",
      "lessons:read",
      "lessons:update",
      "lessons:delete",
    ],
  },
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to all system features",
    permissions: [
      "courses:create",
      "courses:read",
      "courses:update",
      "courses:delete",
      "courses:enroll",
      "lessons:create",
      "lessons:read",
      "lessons:update",
      "lessons:delete",
      "users:read",
      "users:update",
      "users:delete",
      "users:manage-roles",
      "admin:access",
      "admin:manage-system",
    ],
  },
]

// Helper function to get a role by ID
export function getRoleById(roleId: string): Role | undefined {
  return DEFAULT_ROLES.find((role) => role.id === roleId)
}

// Helper function to get permissions for a role
export function getPermissionsForRole(roleId: string): Permission[] {
  const role = getRoleById(roleId)
  return role ? role.permissions : []
}

// Helper function to check if a role has a specific permission
export function roleHasPermission(roleId: string, permission: Permission): boolean {
  const permissions = getPermissionsForRole(roleId)
  return permissions.includes(permission)
}
