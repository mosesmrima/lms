"use client"

import Link from "next/link"
import { SignInForm } from "@/components/sign-in-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"

export function SignInClientPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
  const email = searchParams?.get("email") || ""

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md border-gray-800 bg-[#0a0a0a] text-white shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm callbackUrl={callbackUrl} email={email} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-gray-800 pt-4">
          <div className="text-sm text-gray-400 text-center">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup${callbackUrl !== "/dashboard" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
              className="text-[#f90026] hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
