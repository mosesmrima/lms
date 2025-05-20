"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useAuth } from "@/contexts/auth-context"

interface UserRoleDialogProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    email: string
    displayName?: string
    role?: string
  }
  onRoleChange: () => void
}

export function UserRoleDialog({ isOpen, onClose, user, onRoleChange }: UserRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState(user.role || "student")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user: currentUser } = useAuth()

  const handleRoleChange = async () => {
    if (!currentUser) return

    setIsLoading(true)
    setError(null)

    try {
      // Get the current user's ID token
      const idToken = await currentUser.getIdToken()

      // Call the API to update the role
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: user.id,
          role: selectedRole,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user role")
      }

      // Notify parent component of the change
      onRoleChange()

      // Close the dialog
      onClose()
    } catch (err: any) {
      console.error("Error updating user role:", err)
      setError(err.message || "An error occurred while updating the user role")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>Update the role for {user.displayName || user.email}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleRoleChange} disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" /> : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
