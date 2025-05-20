"use client"

import type React from "react"

import { useState } from "react"
import { Button, Input } from "@heroui/react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import { sendPasswordResetRequest } from "@/lib/firebase"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await sendPasswordResetRequest(email)
      setIsSuccess(true)
      toast.success("Password reset email sent!")
    } catch (error: any) {
      console.error("Password reset error:", error)
      toast.error(error.message || "Failed to send reset email. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-[#111111] border border-[#333333] rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Check Your Email</h2>
        <p className="text-gray-400 mb-6">
          We've sent a password reset link to <span className="font-medium text-white">{email}</span>. Please check your
          inbox and follow the instructions to reset your password.
        </p>
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#333333] hover:bg-[#222222]"
            onClick={() => {
              setIsSuccess(false)
              setEmail("")
            }}
          >
            Try another email
          </Button>
          <Link href="/signin" className="block">
            <Button
              type="button"
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] border border-[#333333] rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#111111] border-[#333333]"
            disabled={isSubmitting}
          />
        </div>
        <Button
          type="submit"
          color="primary"
          className="w-full bg-[#f90026] hover:bg-[#d10021]"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner size="sm" /> : "Send Reset Link"}
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
