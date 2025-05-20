"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Shield, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SetupClient() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()

  // Function to test the API endpoint
  const testApiEndpoint = async () => {
    setIsLoading(true)
    setError(null)
    setDebugInfo(null)

    try {
      const response = await fetch("/api/admin/test")
      const text = await response.text()

      try {
        const json = JSON.parse(text)
        setSuccessMessage(`API test succeeded: ${json.message}`)
      } catch (e) {
        setError("API test failed - received non-JSON response")
        setDebugInfo(text.substring(0, 500)) // Show first 500 chars
      }
    } catch (e) {
      setError(`API test failed: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)
    setDebugInfo(null)

    try {
      // Make the API call
      const requestUrl = "/api/admin/setup"
      console.log(`Calling API at ${requestUrl}`)

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      // Get the response as text first
      const text = await response.text()
      console.log(`API response text: "${text}"`)

      // Try to parse as JSON
      try {
        const data = JSON.parse(text)
        console.log("Parsed JSON response:", data)

        if (data.success) {
          setSuccessMessage(data.message || "Admin setup successful")
          // Redirect after success
          setTimeout(() => {
            router.push("/admin")
          }, 2000)
        } else {
          setError(data.error || "Unknown error occurred")
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        setError("Received invalid response from server")
        setDebugInfo(text)
      }
    } catch (err: any) {
      console.error("Error calling API:", err)
      setError(err.message || "Failed to set up admin user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <CardTitle className="text-center text-xl">Admin Setup</CardTitle>
          <CardDescription className="text-center">
            Set up the first admin user for your learning platform
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSetupAdmin}>
          <CardContent>
            {successMessage ? (
              <div className="text-center p-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg mb-4">
                  <p className="text-green-600 dark:text-green-400 font-medium">{successMessage}</p>
                  {successMessage.includes("Admin setup successful") && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Redirecting to admin dashboard...</p>
                  )}
                </div>
                {successMessage.includes("Admin setup successful") && (
                  <div className="flex justify-center mt-4">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Admin Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter the email of the user to make admin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This user must already exist in your authentication system.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {debugInfo && (
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto text-xs">
                    <div className="font-semibold mb-1">Debug Information:</div>
                    <pre className="whitespace-pre-wrap">{debugInfo}</pre>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-950"
                    onClick={testApiEndpoint}
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : "Test API Connection"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          {!successMessage && (
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                disabled={isLoading || !email}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Set Up Admin"}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  )
}
