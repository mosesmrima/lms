import { type NextRequest, NextResponse } from "next/server"
import { adminAuth, setUserRole, addUserRole, removeUserRole, getUserRoles } from "@/lib/firebase-admin"

// Helper to verify admin status
async function verifyAdmin(request: NextRequest) {
  // Get the authorization token
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { isAdmin: false, error: "Unauthorized" }
  }

  const token = authHeader.split("Bearer ")[1]

  try {
    // Verify the token
    const decodedToken = await adminAuth?.verifyIdToken(token)
    if (!decodedToken) {
      return { isAdmin: false, error: "Invalid token" }
    }

    // Check if user is admin
    const claims = decodedToken.customClaims || {}
    const roles = claims.roles || (claims.role ? [claims.role] : [])

    if (!roles.includes("admin")) {
      return { isAdmin: false, error: "Insufficient permissions" }
    }

    return { isAdmin: true, uid: decodedToken.uid }
  } catch (error) {
    console.error("Error verifying admin status:", error)
    return { isAdmin: false, error: "Authentication error" }
  }
}

// GET - Get user roles
export async function GET(request: NextRequest) {
  // Verify admin status
  const { isAdmin, error, uid: adminUid } = await verifyAdmin(request)
  if (!isAdmin) {
    return NextResponse.json({ error }, { status: 403 })
  }

  // Get user ID from query params
  const { searchParams } = new URL(request.url)
  const uid = searchParams.get("uid")

  if (!uid) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const roles = await getUserRoles(uid)
    return NextResponse.json({ roles })
  } catch (error) {
    console.error("Error getting user roles:", error)
    return NextResponse.json({ error: "Failed to get user roles" }, { status: 500 })
  }
}

// POST - Set user role (replaces existing roles)
export async function POST(request: NextRequest) {
  // Verify admin status
  const { isAdmin, error, uid: adminUid } = await verifyAdmin(request)
  if (!isAdmin) {
    return NextResponse.json({ error }, { status: 403 })
  }

  try {
    const { uid, role } = await request.json()

    if (!uid || !role) {
      return NextResponse.json({ error: "User ID and role are required" }, { status: 400 })
    }

    await setUserRole(uid, role)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting user role:", error)
    return NextResponse.json({ error: "Failed to set user role" }, { status: 500 })
  }
}

// PUT - Add a role to user (keeps existing roles)
export async function PUT(request: NextRequest) {
  // Verify admin status
  const { isAdmin, error, uid: adminUid } = await verifyAdmin(request)
  if (!isAdmin) {
    return NextResponse.json({ error }, { status: 403 })
  }

  try {
    const { uid, role } = await request.json()

    if (!uid || !role) {
      return NextResponse.json({ error: "User ID and role are required" }, { status: 400 })
    }

    await addUserRole(uid, role)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding user role:", error)
    return NextResponse.json({ error: "Failed to add user role" }, { status: 500 })
  }
}

// DELETE - Remove a role from user
export async function DELETE(request: NextRequest) {
  // Verify admin status
  const { isAdmin, error, uid: adminUid } = await verifyAdmin(request)
  if (!isAdmin) {
    return NextResponse.json({ error }, { status: 403 })
  }

  try {
    const { uid, role } = await request.json()

    if (!uid || !role) {
      return NextResponse.json({ error: "User ID and role are required" }, { status: 400 })
    }

    await removeUserRole(uid, role)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing user role:", error)
    return NextResponse.json({ error: "Failed to remove user role" }, { status: 500 })
  }
}
