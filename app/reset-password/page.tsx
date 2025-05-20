import { Suspense } from "react"
import { ResetPasswordForm } from "./reset-password-form"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const oobCode = searchParams.oobCode as string

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Password</h1>
          <p className="text-gray-400">Your new password must be different from previously used passwords.</p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-[200px]">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <ResetPasswordForm oobCode={oobCode} />
        </Suspense>
      </div>
    </div>
  )
}
