import { Suspense } from "react"
import UsersClient from "./users-client"
import { LoadingSpinner } from "@/components/loading-spinner"

export const metadata = {
  title: "User Management | Admin Dashboard",
  description: "Manage users and permissions in the AfricaHackon LMS",
}

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[60vh]">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <UsersClient />
      </Suspense>
    </div>
  )
}
