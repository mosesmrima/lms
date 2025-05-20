import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

// Function to properly format the private key
function formatPrivateKey(key: string | undefined): string {
  if (!key) return ""
  // If the key already contains newline characters, it's already properly formatted
  if (key.includes("\n")) return key
  // Otherwise, replace the literal string \n with actual newline characters
  return key.replace(/\\n/g, "\n")
}

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  // Get environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY)

  // Log environment variable status (without exposing values)
  console.log("Firebase Admin SDK initialization:")
  console.log(`- Project ID: ${projectId ? "Present" : "Missing"}`)
  console.log(`- Client Email: ${clientEmail ? "Present" : "Missing"}`)
  console.log(`- Private Key: ${privateKey ? "Present (length: " + privateKey.length + ")" : "Missing"}`)

  // Check for required environment variables
  if (!projectId || !clientEmail || !privateKey) {
    console.error("Firebase Admin SDK initialization failed. Missing environment variables.")
    // We'll return null instead of throwing to allow the app to start
    return null
  }

  try {
    // Check if Firebase Admin is already initialized
    if (getApps().length > 0) {
      console.log("Firebase Admin SDK already initialized")
      return {
        auth: getAuth(),
        db: getFirestore(),
      }
    }

    // Initialize Firebase Admin SDK
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId: "ahlms-ddef5", // Updated to match client config
    })

    console.log("Firebase Admin SDK initialized successfully")
    return {
      auth: getAuth(app),
      db: getFirestore(app),
    }
  } catch (error) {
    console.error("Firebase Admin SDK initialization error:", error)
    return null
  }
}

// Initialize Firebase Admin
const firebaseAdmin = initializeFirebaseAdmin()

// Export Firebase Admin services
export const adminAuth = firebaseAdmin?.auth || null
export const adminDb = firebaseAdmin?.db || null

// Helper function to add a role to a user
export async function addUserRole(uid: string, role: string) {
  if (!adminAuth) {
    throw new Error("Firebase Admin not initialized")
  }

  try {
    // Get the current user
    const user = await adminAuth.getUser(uid)

    // Set custom claims
    await adminAuth.setCustomUserClaims(uid, {
      role,
      roles: [role],
      admin: role === "admin",
    })

    console.log(`Role '${role}' added to user ${uid}`)
    return true
  } catch (error) {
    console.error("Error adding role to user:", error)
    throw error
  }
}

// Role management functions
export async function setUserRole(uid: string, role: string) {
  if (!adminAuth) {
    throw new Error("Firebase Admin not initialized")
  }

  try {
    // Get the current user claims
    const user = await adminAuth.getUser(uid)
    const currentClaims = user.customClaims || {}

    // Get current roles or initialize empty array
    const currentRoles = currentClaims.roles || []

    // Add the new role if it doesn't exist
    if (!currentRoles.includes(role)) {
      const newRoles = [...currentRoles, role]

      // Set custom claims
      await adminAuth.setCustomUserClaims(uid, {
        ...currentClaims,
        roles: newRoles,
        role: role, // Set the primary role
        admin: role === "admin" || currentRoles.includes("admin"),
      })

      console.log(`Role '${role}' added to user ${uid}`)
    }

    return true
  } catch (error) {
    console.error("Error setting user role:", error)
    throw error
  }
}

export async function removeUserRole(uid: string, role: string) {
  if (!adminAuth) {
    throw new Error("Firebase Admin not initialized")
  }

  try {
    // Get the current user claims
    const user = await adminAuth.getUser(uid)
    const currentClaims = user.customClaims || {}

    // Get current roles or initialize empty array
    const currentRoles = currentClaims.roles || []

    // Remove the role
    const newRoles = currentRoles.filter((r: string) => r !== role)

    // Determine primary role (first in the array or empty)
    const primaryRole = newRoles.length > 0 ? newRoles[0] : ""

    // Set custom claims
    await adminAuth.setCustomUserClaims(uid, {
      ...currentClaims,
      roles: newRoles,
      role: primaryRole,
      admin: newRoles.includes("admin"),
    })

    console.log(`Role '${role}' removed from user ${uid}`)
    return true
  } catch (error) {
    console.error("Error removing user role:", error)
    throw error
  }
}

export async function getUserRoles(uid: string) {
  if (!adminAuth) {
    throw new Error("Firebase Admin not initialized")
  }

  try {
    const user = await adminAuth.getUser(uid)
    const claims = user.customClaims || {}
    return claims.roles || []
  } catch (error) {
    console.error("Error getting user roles:", error)
    throw error
  }
}
