"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/loading-spinner"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeed = async () => {
    try {
      setIsLoading(true)
      setResult(null)

      const response = await fetch("/api/seed")
      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
        })
      } else {
        setResult({
          success: false,
          message: data.message || "Failed to seed database",
        })
      }
    } catch (error) {
      console.error("Error seeding database:", error)
      setResult({
        success: false,
        message: "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <Card className="max-w-md mx-auto bg-[#1e1e1e] border-[#333333]">
        <CardHeader>
          <CardTitle>Database Seed Tool</CardTitle>
          <CardDescription>
            This tool will populate your Firebase database with sample courses and lessons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Use this tool to quickly populate your database with sample data for testing. This will create:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-300">
            <li>An instructor account</li>
            <li>3 sample courses</li>
            <li>Multiple lessons for each course</li>
            <li>Attachments for lessons</li>
          </ul>

          {result && (
            <Alert
              className={`mt-6 ${result.success ? "bg-green-900/20 border-green-900" : "bg-red-900/20 border-red-900"}`}
            >
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeed} disabled={isLoading} className="w-full bg-[#f90026] hover:bg-[#d10021]">
            {isLoading ? <LoadingSpinner className="mr-2" /> : null}
            {isLoading ? "Seeding Database..." : "Seed Database"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
