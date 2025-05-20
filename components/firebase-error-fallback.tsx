"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface FirebaseErrorFallbackProps {
  error?: Error
  resetErrorBoundary?: () => void
}

export function FirebaseErrorFallback({ error, resetErrorBoundary }: FirebaseErrorFallbackProps) {
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Auto-retry up to 3 times with increasing delays
    if (retryCount > 0 && retryCount <= 3 && resetErrorBoundary) {
      const timer = setTimeout(() => {
        resetErrorBoundary()
      }, retryCount * 1000) // 1s, 2s, 3s

      return () => clearTimeout(timer)
    }
  }, [retryCount, resetErrorBoundary])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    if (resetErrorBoundary) {
      resetErrorBoundary()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-300 mb-6">
          We're having trouble connecting to our services. This might be a temporary issue.
        </p>
        {error && (
          <div className="bg-[#1e1e1e] p-4 rounded-md mb-6 text-left overflow-auto max-h-32">
            <p className="text-red-400 text-sm font-mono">{error.message}</p>
          </div>
        )}
        <Button onClick={handleRetry} className="bg-[#f90026] hover:bg-[#d10021]">
          Try Again
        </Button>
        <p className="mt-4 text-sm text-gray-400">
          If the problem persists, please try again later or contact support.
        </p>
      </div>
    </div>
  )
}
