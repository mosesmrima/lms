import { Suspense } from "react"
import { ForgotPasswordForm } from "./forgot-password-form"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-gray-400">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-[200px]">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
