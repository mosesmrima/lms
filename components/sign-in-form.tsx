"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button, Input } from "@heroui/react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { setCookie } from "@/lib/cookies"

interface SignInFormProps {
  callbackUrl?: string
  email?: string
}

export function SignInForm({ callbackUrl = "/dashboard", email: initialEmail = "" }: SignInFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()

  // Update email if initialEmail changes (e.g., from URL params)
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail)
    }
  }, [initialEmail])

  // Improved form submission with enhanced cookie handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Sign in and get the user directly
      const user = await signIn(email, password)

      if (user) {
        // Immediately set auth cookie with longer expiration (7 days)
        const token = await user.getIdToken()
        setCookie("firebase-auth-token", token, 7)

        // Set user role cookie (fetch from user profile)
        const { getUserProfile } = await import("@/lib/firebase-client")
        const userProfile = await getUserProfile(user.uid)
        if (userProfile && userProfile.role) {
          setCookie("user-role", userProfile.role, 7)
        }

        toast.success("Signed in successfully!")

        // Use a slightly longer delay to ensure cookies are properly set
        setTimeout(() => {
          // Use window.location for a hard navigation to ensure cookies are sent
          window.location.href = callbackUrl
        }, 500)
      } else {
        throw new Error("Authentication failed. Please try again.")
      }
    } catch (error: any) {
      console.error("Sign in error:", error)
      toast.error(error.message || "Failed to sign in. Please check your credentials.")
      setIsSubmitting(false)
    }
  }

  // Google sign-in handler with enhanced cookie handling
  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true)

    try {
      // Get user directly from Google sign-in
      const user = await signInWithGoogle()

      if (user) {
        // Immediately set auth cookie with longer expiration (7 days)
        const token = await user.getIdToken()
        setCookie("firebase-auth-token", token, 7)

        // Set user role cookie (fetch from user profile)
        const { getUserProfile } = await import("@/lib/firebase-client")
        const userProfile = await getUserProfile(user.uid)
        if (userProfile && userProfile.role) {
          setCookie("user-role", userProfile.role, 7)
        }

        toast.success("Signed in with Google successfully!")

        // Use a slightly longer delay to ensure cookies are properly set
        setTimeout(() => {
          // Use window.location for a hard navigation to ensure cookies are sent
          window.location.href = callbackUrl
        }, 500)
      } else {
        throw new Error("Google authentication failed. Please try again.")
      }
    } catch (error: any) {
      console.error("Google sign in error:", error)
      toast.error(error.message || "Failed to sign in with Google.")
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#111111] border-[#333333]"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-300">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pr-10 bg-[#111111] border-[#333333]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-[#f90026] hover:text-[#d10021] hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <Button
          type="submit"
          color="primary"
          className="w-full bg-[#f90026] hover:bg-[#d10021]"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner size="sm" /> : "Sign In"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0a0a0a] px-2 text-gray-400">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-gray-700 hover:bg-gray-800 text-white"
        onClick={handleGoogleSignIn}
        disabled={isGoogleSubmitting}
      >
        {isGoogleSubmitting ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
            Sign in with Google
          </>
        )}
      </Button>
    </div>
  )
}
