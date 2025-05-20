"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "firebase/auth"
import { useRouter, usePathname } from "next/navigation"
import { setCookie, removeCookie } from "@/lib/cookies"
import { LoadingSpinner } from "@/components/loading-spinner"

// Import from the correct path using the @/ alias
import { auth, db } from "@/lib/firebase-client"
import { doc, getDoc, setDoc } from "firebase/firestore"

interface AuthContextType {
  user: User | null
  userRole: string | null
  userRoles: string[]
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signInWithGoogle: () => Promise<User>
  signUp: (email: string, password: string, displayName?: string) => Promise<User>
  signOut: () => Promise<void>
  isAdmin: () => boolean
  isInstructor: () => boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  hasAllRoles: (roles: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Use dynamic import for onAuthStateChanged
        const { onAuthStateChanged } = await import("firebase/auth")

        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
          setIsLoading(true)

          if (authUser) {
            setUser(authUser)

            // Get the ID token result which contains custom claims
            const { getIdTokenResult } = await import("firebase/auth")
            const idTokenResult = await getIdTokenResult(authUser)
            const claims = idTokenResult.claims

            // Set roles from custom claims
            const roles = claims.roles || (claims.role ? [claims.role] : [])
            setUserRoles(roles)

            // Set single role for backward compatibility
            setUserRole(roles[0] || null)

            // Set auth cookie
            setCookie("firebase-auth-token", await authUser.getIdToken(), 1)

            // Set role cookie for middleware
            setCookie("user-role", roles[0] || "", 1)

            // Set enrollment cookies for courses the user is enrolled in
            try {
              // Get user enrollments from Firestore
              const { collection, query, where, getDocs } = await import("firebase/firestore")
              const enrollmentsRef = collection(db, "enrollments")
              const q = query(enrollmentsRef, where("userId", "==", authUser.uid))
              const enrollmentsSnapshot = await getDocs(q)

              // Set cookies for each enrollment
              enrollmentsSnapshot.forEach((doc) => {
                const { courseId } = doc.data()
                if (courseId) {
                  setCookie(`enrolled-${courseId}`, "true", 30)
                }
              })
            } catch (error) {
              console.error("Error setting enrollment cookies:", error)
            }
          } else {
            setUser(null)
            setUserRole(null)
            setUserRoles([])
            removeCookie("firebase-auth-token")
            removeCookie("user-role")
          }

          setIsLoading(false)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error("Error initializing auth:", error)
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      const { signInWithEmail } = await import("@/lib/firebase-client")
      const userCredential = await signInWithEmail(email, password)

      if (!userCredential.user) {
        throw new Error("Failed to sign in")
      }

      return userCredential.user
    } catch (error: any) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signInWithGoogle = async (): Promise<User> => {
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth")
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      if (!result.user) {
        throw new Error("Failed to sign in with Google")
      }

      // Check if user profile exists, if not create it
      const userRef = doc(db, "users", result.user.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: "student",
          createdAt: new Date().toISOString(),
        })
      }

      return result.user
    } catch (error: any) {
      console.error("Google sign in error:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, displayName?: string): Promise<User> => {
    try {
      const { signUpWithEmail } = await import("@/lib/firebase-client")
      const userCredential = await signUpWithEmail(email, password)

      if (!userCredential.user) {
        throw new Error("Failed to create user")
      }

      // Create user profile with default role
      const userRef = doc(db, "users", userCredential.user.uid)
      await setDoc(userRef, {
        email,
        displayName: displayName || email.split("@")[0],
        role: "student",
        createdAt: new Date().toISOString(),
      })

      return userCredential.user
    } catch (error: any) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signOutUser = async (): Promise<void> => {
    try {
      const { signOut } = await import("@/lib/firebase-client")
      await signOut()

      // Clear cookies
      removeCookie("firebase-auth-token")
      removeCookie("user-role")

      // Clear enrollment cookies
      document.cookie.split(";").forEach((c) => {
        if (c.trim().startsWith("enrolled-")) {
          const cookieName = c.split("=")[0].trim()
          removeCookie(cookieName)
        }
      })

      // Redirect to home page
      router.push("/")
    } catch (error: any) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  // Role checking functions
  const isAdmin = () => userRoles.includes("admin")
  const isInstructor = () => userRoles.includes("instructor") || userRoles.includes("admin")
  const hasRole = (role: string) => userRoles.includes(role)
  const hasAnyRole = (roles: string[]) => roles.some((role) => userRoles.includes(role))
  const hasAllRoles = (roles: string[]) => roles.every((role) => userRoles.includes(role))

  const value = {
    user,
    userRole,
    userRoles,
    isLoading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut: signOutUser,
    isAdmin,
    isInstructor,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  }

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
