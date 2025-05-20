"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button, Input } from "@heroui/react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import { verifyPasswordResetToken, completePasswordReset } from "@/lib/firebase"
import { ArrowLeft, CheckCircle, Eye, EyeOff, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ResetPasswordFormProps {
  oobCode?: string
}

export function ResetPasswordForm({ oobCode }: ResetPasswordFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [email, setEmail] = useState("")

  // Verify the reset token when the component mounts
  useEffect(() => {
    async function verifyToken() {
      if (!oobCode) {
        setIsVerifying(false)
        return
      }

      try {
        const userEmail = await verifyPasswordResetToken(oobCode)
        setEmail(userEmail)
        setIsValidToken(true)
      } catch (error) {
        console.error("Invalid or expired reset token:", error)
        toast.error("This password reset link is invalid or has expired. Please request a new one.")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [oobCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsSubmitting(true)

    try {
      if (!oobCode) {
        throw new Error("Reset code is missing")
      }

      await completePasswordReset(oobCode, password)
      setIsSuccess(true)
      toast.success("Password has been reset successfully!")
    } catch (error: any) {
      console.error("Password reset error:", error)
      toast.error(error.message || "Failed to reset password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="bg-[#111111] border border-[#333333] rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-400">Verifying your reset link...</p>
      </div>
    )
  }

  if (!isValidToken && !isVerifying) {
    return (
      <div className="bg-[#111111] border border-[#333333] rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Invalid Reset Link</h2>
        <p className="text-gray-400 mb-6">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/forgot-password" className="block">
          <Button type="button" color="primary" className="w-full bg-[#f90026] hover:bg-[#d10021]">
            Request New Reset Link
          </Button>
        </Link>
        <div className="mt-4">
          <Link
            href="/signin"
            className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="bg-[#111111] border border-[#333333] rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Password Reset Complete</h2>
        <p className="text-gray-400 mb-6">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link href="/signin" className="block">
          <Button type="button" color="primary" className="w-full bg-[#f90026] hover:bg-[#d10021]">
            Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] border border-[#333333] rounded-lg p-6">
      {email && (
        <div className="mb-4 p-3 bg-[#1a1a1a] rounded-md">
          <p className="text-sm text-gray-300">
            Resetting password for <span className="font-medium text-white">{email}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-300">
            New Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pr-10 bg-[#111111] border-[#333333]"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pr-10 bg-[#111111] border-[#333333]"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          color="primary"
          className="w-full bg-[#f90026] hover:bg-[#d10021]"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner size="sm" /> : "Reset Password"}
        </Button>

        <div className="text-center mt-4">
          <Link
            href="/signin"
            className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  )
}
