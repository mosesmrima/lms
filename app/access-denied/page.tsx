import Link from "next/link"
import { Button } from "@heroui/react"
import { ShieldAlert, Home, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Access Denied | AfricaHackon LMS",
  description: "You do not have permission to access this page",
}

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-4">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-[#f90026]/10">
            <ShieldAlert className="h-12 w-12 text-[#f90026]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          You do not have permission to access this page. If you believe this is an error, please contact an
          administrator.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as={Link}
            href="/"
            variant="flat"
            className="bg-[#111] text-white border border-[#333] hover:border-[#f90026]"
            startContent={<Home className="h-4 w-4" />}
          >
            Go to Home
          </Button>
          <Button
            as={Link}
            href="/dashboard"
            color="primary"
            className="bg-[#f90026] hover:bg-[#d10021]"
            startContent={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
