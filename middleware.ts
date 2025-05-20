import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that should be accessible even when logged in
const publicRoutes = ["/signin", "/signup", "/forgot-password", "/reset-password"]

// Define routes that require authentication
const protectedRoutes = ["/dashboard", "/instructor", "/profile"]

// Define routes that require specific roles
const roleProtectedRoutes = {
  instructor: ["/instructor"],
  admin: ["/admin"],
}

// Special routes with custom handling
const specialRoutes = ["/admin/setup"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Don't redirect from public routes to dashboard even if authenticated
  // This prevents the infinite redirect loop when signing in
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow access to special routes
  if (specialRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is a lesson route that requires enrollment
  const isLessonRoute = pathname.match(/\/courses\/(.+)\/lesson\/(.+)/)

  // Check if the current path is a role-protected route
  const isInstructorRoute = pathname.startsWith("/instructor")
  const isAdminRoute = pathname.startsWith("/admin")

  // Check for authentication token in cookies
  const authCookie = request.cookies.get("firebase-auth-token")
  const userRoleCookie = request.cookies.get("user-role")

  // If no authentication token is found and route requires authentication
  if ((isProtectedRoute || isLessonRoute || isAdminRoute || isInstructorRoute) && !authCookie) {
    const url = new URL("/signin", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // If it's a lesson route, we need to check enrollment
  if (isLessonRoute) {
    const courseId = isLessonRoute[1]

    // Check if user is enrolled in this course
    const enrollmentCookie = request.cookies.get(`enrolled-${courseId}`)

    // If not enrolled, redirect to course page with enrollment message
    if (!enrollmentCookie) {
      const courseUrl = new URL(`/courses/${courseId}`, request.url)
      courseUrl.searchParams.set("enrollmentRequired", "true")
      return NextResponse.redirect(courseUrl)
    }
  }

  // Role-based access control
  if (isInstructorRoute && userRoleCookie?.value !== "instructor" && userRoleCookie?.value !== "admin") {
    return NextResponse.redirect(new URL("/access-denied", request.url))
  }

  if (isAdminRoute && userRoleCookie?.value !== "admin") {
    return NextResponse.redirect(new URL("/access-denied", request.url))
  }

  // Allow access to protected route
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
