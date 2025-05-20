// Role-based access control types

export type Permission =
  // Course permissions
  | "courses:create"
  | "courses:read"
  | "courses:update"
  | "courses:delete"
  | "courses:enroll"

  // Lesson permissions
  | "lessons:create"
  | "lessons:read"
  | "lessons:update"
  | "lessons:delete"

  // User permissions
  | "users:read"
  | "users:update"
  | "users:delete"
  | "users:manage-roles"

  // Admin permissions
  | "admin:access"
  | "admin:manage-system"

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

export interface UserRoles {
  userId: string
  roleIds: string[]
}
