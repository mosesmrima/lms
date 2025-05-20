"use client"
import { Suspense } from "react"
import { SignUpClientPage } from "./SignUpClientPage"
import { Spinner } from "@heroui/react"

export default function SignUpPage() {
  return (
    <div className="container mx-auto py-10">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[60vh]">
            <Spinner size="lg" color="primary" />
          </div>
        }
      >
        <SignUpClientPage />
      </Suspense>
    </div>
  )
}
