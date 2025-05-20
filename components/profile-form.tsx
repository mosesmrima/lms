"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { User } from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { LoadingSpinner } from "@/components/loading-spinner"

const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(50),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100).optional(),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: User
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileFormValues>({
    displayName: user.displayName || user.email?.split("@")[0] || "",
    bio: "",
    location: "",
    website: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [profilePicture, setProfilePicture] = useState<string | null>(user.photoURL)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true)
      try {
        const profileDoc = await getDoc(doc(db, "userProfiles", user.uid))
        if (profileDoc.exists()) {
          const data = profileDoc.data()
          setProfileData({
            displayName: data.displayName || user.displayName || user.email?.split("@")[0] || "",
            bio: data.bio || "",
            location: data.location || "",
            website: data.website || "",
          })
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
        toast.error("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    setIsSaving(true)
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-pictures/${user.uid}`)
      await uploadBytes(storageRef, file)

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Update user profile
      await user.updateProfile({
        photoURL: downloadURL,
      })

      // Update state
      setProfilePicture(downloadURL)
      toast.success("Profile picture updated successfully")
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      toast.error("Failed to upload profile picture")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate form data
      const validatedData = profileSchema.parse(profileData)

      setIsSaving(true)

      // Update user profile in Firebase Auth
      await user.updateProfile({
        displayName: validatedData.displayName,
      })

      // Update or create profile document in Firestore
      const profileRef = doc(db, "userProfiles", user.uid)
      const profileDoc = await getDoc(profileRef)

      if (profileDoc.exists()) {
        await updateDoc(profileRef, validatedData)
      } else {
        await setDoc(profileRef, {
          ...validatedData,
          userId: user.uid,
          email: user.email,
          createdAt: new Date(),
        })
      }

      toast.success("Profile updated successfully")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      } else {
        console.error("Error updating profile:", error)
        toast.error("Failed to update profile")
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            name="displayName"
            value={profileData.displayName}
            onChange={handleChange}
            placeholder="Your name"
            className={errors.displayName ? "border-destructive" : ""}
          />
          {errors.displayName && <p className="text-sm text-destructive">{errors.displayName}</p>}
          <p className="text-sm text-muted-foreground">
            This is your public display name. It can be your real name or a pseudonym.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={profileData.bio || ""}
            onChange={handleChange}
            placeholder="Tell us a little bit about yourself"
            className={`resize-none min-h-[120px] ${errors.bio ? "border-destructive" : ""}`}
          />
          {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
          <p className="text-sm text-muted-foreground">{profileData.bio?.length || 0}/500 characters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={profileData.location || ""}
              onChange={handleChange}
              placeholder="City, Country"
              className={errors.location ? "border-destructive" : ""}
            />
            {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={profileData.website || ""}
              onChange={handleChange}
              placeholder="https://example.com"
              className={errors.website ? "border-destructive" : ""}
            />
            {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
