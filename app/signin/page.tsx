import { Suspense } from "react"
import { SignInClientPage } from "./SignInClientPage"
import { Spinner } from "@heroui/react"

export default function SignInPage() {
  return (
    <div className="container mx-auto py-10">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[60vh]">
            <Spinner size="lg" color="primary" />
          </div>
        }
      >
        <SignInClientPage />
      </Suspense>
    </div>
  )
}
