import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasInstructorPermission(userRole: string | null | undefined): boolean {
  return userRole === "instructor" || userRole === "admin"
}
