"use client"

import { useState, useEffect, useCallback } from "react"
import { onAuthStateChange, getUserProfile } from "@/lib/firebase"
import type { User } from "firebase/auth"
import { setCookie, removeCookie } from "@/lib/cookies"

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<"student" | "instructor" | "admin" | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      try {
        if (authUser) {
          setUser(authUser)

          // Get the user's ID token
          const token = await authUser.getIdToken()

          // Set the token in a cookie that expires in 7 days
          setCookie("firebase-auth-token", token, 7)

          // Get the user's profile to determine role
          const userProfile = await getUserProfile(authUser.uid)

          if (userProfile && userProfile.role) {
            setUserRole(userProfile.role as "student" | "instructor" | "admin")
            setCookie("user-role", userProfile.role, 7)
          } else {
            // Default to student if no role is specified
            setUserRole("student")
            setCookie("user-role", "student", 7)
          }
        } else {
          setUser(null)
          setUserRole(null)

          // Clear cookies when user is not authenticated
          removeCookie("firebase-auth-token")
          removeCookie("user-role")
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      const { signInWithEmail } = await import("@/lib/firebase")
      const result = await signInWithEmail(email, password)
      return result.user
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true)
      const { signInWithGoogle } = await import("@/lib/firebase")
      const result = await signInWithGoogle()
      return result.user
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true)
      const { createUserWithEmail, createUserProfile } = await import("@/lib/firebase")
      const result = await createUserWithEmail(email, password, displayName)

      // Create a user profile with the student role
      await createUserProfile(result.user.uid, {
        email: result.user.email,
        displayName: displayName || email.split("@")[0],
        role: "student",
      })

      return result.user
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      const { signOutUser } = await import("@/lib/firebase")
      await signOutUser()

      // Clear cookies on logout
      removeCookie("firebase-auth-token")
      removeCookie("user-role")

      // Clear all enrollment cookies
      document.cookie.split(";").forEach((c) => {
        if (c.trim().startsWith("enrolled-")) {
          const cookieName = c.trim().split("=")[0]
          removeCookie(cookieName)
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    user,
    userRole,
    loading,
    error,
    signIn,
    signInWithGoogle,
    signUp,
    logout,
  }
}
