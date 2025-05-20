import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

// Simplest possible Firebase Admin initialization
let adminAuth = null

try {
  // Check if already initialized
  const apps = getApps()

  if (apps.length === 0) {
    // Get environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    // Log environment variable status without revealing values
    console.log("Firebase Admin environment variables check:")
    console.log(`- Project ID: ${projectId ? "Available" : "Missing"}`)
    console.log(`- Client Email: ${clientEmail ? "Available" : "Missing"}`)
    console.log(`- Private Key: ${privateKey ? `Available (${privateKey.length} chars)` : "Missing"}`)

    // Initialize app with simplest possible approach
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })

    // Get auth instance
    adminAuth = getAuth(app)
    console.log("Firebase Admin initialized successfully")
  } else {
    // Use existing app
    adminAuth = getAuth(apps[0])
    console.log("Using existing Firebase Admin instance")
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error)
  // Don't throw, just log the error
}

// Simple function to get user by email
export async function getUserByEmail(email) {
  if (!adminAuth) {
    throw new Error("Firebase Admin not initialized")
  }

  try {
    return await adminAuth.getUserByEmail(email)
  } catch (error) {
    console.error(`Error getting user by email (${email}):`, error)
    throw error
  }
}

// Simple function to set custom claims
export async function setAdminRole(uid) {
  if (!adminAuth) {
    throw new Error("Firebase Admin not initialized")
  }

  try {
    await adminAuth.setCustomUserClaims(uid, { role: "admin", admin: true })
    return true
  } catch (error) {
    console.error(`Error setting admin role for user (${uid}):`, error)
    throw error
  }
}
