import { Suspense } from "react"
import SetupClient from "./setup-client"
import { LoadingSpinner } from "@/components/loading-spinner"

export const metadata = {
  title: "Admin Setup | AfricaHackon LMS",
  description: "Set up the first admin user for the AfricaHackon Learning Management System",
}

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[60vh]">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <SetupClient />
      </Suspense>
    </div>
  )
}
