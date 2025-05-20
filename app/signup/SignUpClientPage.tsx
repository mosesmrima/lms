"use client"

import Link from "next/link"
import { SignUpForm } from "@/components/sign-up-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"

export function SignUpClientPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md border-gray-800 bg-[#0a0a0a] text-white shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription className="text-gray-400">Enter your details to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm callbackUrl={callbackUrl} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-gray-800 pt-4">
          <div className="text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link
              href={`/signin${callbackUrl !== "/dashboard" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
              className="text-[#f90026] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
