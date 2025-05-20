import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase"
import { getUserEnrollments } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token from the request
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]

    // Verify the token and get the user
    const decodedToken = await auth.verifyIdToken(token)
    const userId = decodedToken.uid

    // Get the request body
    const { courseId, attachmentUrl } = await request.json()

    if (!courseId || !attachmentUrl) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Check if the user is enrolled in the course
    const enrollments = await getUserEnrollments(userId)
    const isEnrolled = enrollments.includes(courseId)

    if (!isEnrolled) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 })
    }

    // If enrolled, return a signed URL or redirect to the file
    // For now, we'll just return the original URL since we're using mock data
    // In a real implementation, you would generate a short-lived signed URL here

    return NextResponse.json({ url: attachmentUrl })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
